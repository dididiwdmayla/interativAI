/*
 * O Web Worker do Python: carrega o Pyodide servido pelo próprio jogo
 * (public/pyodide/<versão>/, sem CDN de fora) e roda os programas.
 *
 * - A carga baixa os arquivos grandes contando os bytes (a barra de
 *   "baixando o Python"); com o cabeçalho de cache do next.config.ts, a
 *   segunda visita vem do cache do navegador, sem baixar de novo.
 * - Depois de carregar, a rede do worker é apagada (fetch, XMLHttpRequest,
 *   WebSocket...) e o Python perde o módulo js: o programa do aluno não
 *   alcança a página nem a internet.
 * - Loop infinito: o worker não tem como parar o Python no meio; a página
 *   encerra o worker no tempo limite (sessao.ts) e um novo acorda.
 */
import { executarPython, prepararPython, type PythonCarregado } from "./nucleo";
import type { PedidoPython, RespostaPython } from "./mensagens";
import type { CargaPython } from "../tipos";

const escopo = globalThis as unknown as Record<string, unknown> & {
  postMessage(mensagem: unknown): void;
  addEventListener(tipo: "message", ouvinte: (evento: MessageEvent<PedidoPython>) => void): void;
  location: { origin: string };
};
const enviar = (resposta: RespostaPython) => escopo.postMessage(resposta);
const avisar = (carga: CargaPython) => enviar({ id: 0, tipo: "carga", carga });

/** Os arquivos grandes, com o tamanho aproximado (quando o servidor não diz o tamanho). */
const ARQUIVOS_GRANDES: readonly { nome: string; aproximado: number }[] = [
  { nome: "pyodide.asm.wasm", aproximado: 9_600_000 },
  { nome: "python_stdlib.zip", aproximado: 2_550_000 },
  { nome: "pyodide.asm.mjs", aproximado: 1_250_000 },
];

const PROIBIDOS_DEPOIS = ["fetch", "XMLHttpRequest", "WebSocket", "WebSocketStream", "EventSource", "WebTransport", "importScripts", "Worker", "SharedWorker", "indexedDB", "caches", "BroadcastChannel"];

/**
 * Tira um nome do global do worker. Muitos moram no protótipo (WorkerGlobalScope), onde o delete
 * não alcança: uma propriedade própria valendo undefined esconde o do protótipo.
 */
function apagar(nome: string): void {
  try {
    Object.defineProperty(globalThis, nome, { value: undefined, configurable: true, writable: false });
  } catch {
    // Propriedade que não sai: fica sem uso.
  }
}

let python: PythonCarregado | null = null;
let carregando: Promise<void> | null = null;

async function baixarContando(base: string): Promise<void> {
  const total = ARQUIVOS_GRANDES.reduce((soma, arquivo) => soma + arquivo.aproximado, 0);
  let baixados = 0;
  avisar({ etapa: "baixando", baixados, total });
  for (const arquivo of ARQUIVOS_GRANDES) {
    const resposta = await fetch(`${base}${arquivo.nome}`, { cache: "force-cache" });
    if (!resposta.ok || !resposta.body) throw new Error(`não deu para baixar ${arquivo.nome} (${resposta.status})`);
    const leitor = resposta.body.getReader();
    let doArquivo = 0;
    for (;;) {
      const { done, value } = await leitor.read();
      if (done) break;
      doArquivo += value.byteLength;
      // Sem passar do aproximado de cada arquivo: a barra nunca anda para trás nem passa do fim.
      avisar({ etapa: "baixando", baixados: baixados + Math.min(doArquivo, arquivo.aproximado), total });
    }
    baixados += arquivo.aproximado;
  }
}

async function carregar(endereco: string): Promise<void> {
  const base = new URL(endereco, escopo.location.origin).href;
  await baixarContando(base);
  avisar({ etapa: "acordando" });
  // O bundler pode entregar este worker como clássico (com importScripts), e o Pyodide recusa worker
  // clássico. O código do worker já está carregado: sem importScripts, ele roda como worker de módulo.
  apagar("importScripts");
  const modulo = (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `${base}pyodide.mjs`)) as {
    loadPyodide(opcoes: { indexURL: string; packages?: string[] }): Promise<PythonCarregado>;
  };
  const carregado = await modulo.loadPyodide({ indexURL: base });
  prepararPython(carregado);
  for (const nome of PROIBIDOS_DEPOIS) apagar(nome);
  python = carregado;
  avisar({ etapa: "pronto" });
}

escopo.addEventListener("message", (evento) => {
  const pedido = evento.data;
  if (pedido.tipo === "carregar") {
    carregando ??= carregar(pedido.endereco);
    carregando.then(
      () => enviar({ id: pedido.id, tipo: "pronto" }),
      (falha: unknown) => {
        const mensagem = falha instanceof Error ? falha.message : String(falha);
        avisar({ etapa: "falhou", mensagem });
        enviar({ id: pedido.id, tipo: "falha", mensagem });
      },
    );
    return;
  }
  if (!python) {
    enviar({ id: pedido.id, tipo: "falha", mensagem: "O Python ainda não acordou." });
    return;
  }
  enviar({ id: pedido.id, tipo: "executar", resultado: executarPython(python, pedido.codigo) });
});
