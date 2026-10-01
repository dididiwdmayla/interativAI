/*
 * O Web Worker onde o código do jogador roda (Ilha Lógica). Isolamento:
 * - um worker não tem página (nada de document, window, localStorage), então
 *   o código não alcança o jogo nem o progresso;
 * - a rede e o armazenamento que um worker teria (fetch, XMLHttpRequest,
 *   WebSocket, EventSource, importScripts, indexedDB, caches, outros
 *   workers, BroadcastChannel) são apagados do global e da cadeia de
 *   protótipos antes do primeiro código, e import() é recusado na leitura
 *   do código (instrumentar.ts);
 * - postMessage e o ouvinte de mensagens ficam guardados só aqui dentro: o
 *   código do jogador não conversa com a página;
 * - loop infinito: os ganchos param o programa por passos e por tempo; se
 *   algo escapar deles, a página encerra o worker (sessaoNavegador.ts).
 */
import { NucleoExecutor } from "./nucleo";
import type { PedidoExecutor, RespostaExecutor } from "./mensagens";

const escopo = globalThis as unknown as Record<string, unknown> & {
  postMessage(mensagem: unknown): void;
  addEventListener(tipo: "message", ouvinte: (evento: MessageEvent<PedidoExecutor>) => void): void;
};

const enviar = escopo.postMessage.bind(escopo);
const ouvir = escopo.addEventListener.bind(escopo);
// Chamar o eval guardado numa variável é um eval indireto: roda no escopo global do worker.
const evalGlobal = globalThis.eval;
const avaliarGlobal = (codigo: string): unknown => evalGlobal(codigo);
const FuncaoNativa = Function;
const relogio = performance.now.bind(performance);

const PROIBIDOS = [
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "WebSocketStream",
  "EventSource",
  "WebTransport",
  "importScripts",
  "Worker",
  "SharedWorker",
  "BroadcastChannel",
  "indexedDB",
  "caches",
  "postMessage",
  "addEventListener",
  "removeEventListener",
  "dispatchEvent",
  "close",
  "setTimeout",
  "setInterval",
  "clearTimeout",
  "clearInterval",
  "queueMicrotask",
  "requestAnimationFrame",
  "Notification",
  "FileReaderSync",
  "Request",
  "Response",
  "Headers",
];

for (let alvo: object | null = escopo; alvo; alvo = Object.getPrototypeOf(alvo)) {
  for (const nome of PROIBIDOS) {
    if (!Object.prototype.hasOwnProperty.call(alvo, nome)) continue;
    try {
      delete (alvo as Record<string, unknown>)[nome];
    } catch {
      /* não configurável: fica sombreado abaixo */
    }
  }
}
for (const nome of [...PROIBIDOS, "onmessage", "onmessageerror"]) {
  try {
    Object.defineProperty(escopo, nome, { value: undefined, writable: false, configurable: false });
  } catch {
    /* já apagado */
  }
}
try {
  const nav = escopo.navigator as Record<string, unknown> | undefined;
  if (nav) Object.defineProperty(escopo, "navigator", { value: undefined, writable: false, configurable: false });
} catch {
  /* sem navigator */
}

const nucleo = new NucleoExecutor({
  global: escopo,
  avaliar: avaliarGlobal,
  mensagemDeSintaxe: (fonte) => {
    try {
      new FuncaoNativa(fonte);
      return null;
    } catch (erro) {
      return erro instanceof Error ? erro.message : String(erro);
    }
  },
  agora: relogio,
}, { deterministico: new URL(globalThis.location.href).searchParams.get("executor-teste") === "1" });

ouvir("message", (evento) => {
  const pedido = evento.data;
  let resposta: RespostaExecutor;
  try {
    if (pedido.tipo === "executar") {
      resposta = { id: pedido.id, tipo: "executar", resultado: nucleo.executar(pedido.codigo, pedido.origem) };
    } else if (pedido.tipo === "testarFuncao") {
      resposta = { id: pedido.id, tipo: "testarFuncao", resultado: nucleo.testarFuncao(pedido.nome, pedido.casos) };
    } else {
      for (const entrada of pedido.entradas) nucleo.executar(entrada.codigo, entrada.origem, { gravar: false });
      resposta = { id: pedido.id, tipo: "repetir" };
    }
  } catch (erro) {
    resposta = { id: pedido.id, tipo: "falha", mensagem: erro instanceof Error ? erro.message : String(erro) };
  }
  enviar(resposta);
});
