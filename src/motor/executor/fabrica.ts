/*
 * Núcleo SÍNCRONO do executor, para simular fases de programa fora da tela:
 * o testar:conteudo (Node, vm: testes/conteudo/preparar.ts registra), as
 * checagens do /lab/fases e o "depois" da meta de um desafio (navegador:
 * um iframe escondido da mesma origem, criado sob demanda).
 *
 * Só roda CONTEÚDO do projeto (soluções de teste): o código do jogador
 * roda sempre no Web Worker isolado (sessaoNavegador.ts).
 */
import { NucleoExecutor } from "./nucleo";

type Fabrica = () => NucleoExecutor;

let fabrica: Fabrica | null = null;

export function definirFabricaDeNucleo(nova: Fabrica | null) {
  fabrica = nova;
}

const IFRAMES_GUARDADOS = 6;
const iframes: HTMLIFrameElement[] = [];

function nucleoEmIframe(): NucleoExecutor {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.setAttribute("tabindex", "-1");
  iframe.setAttribute("data-executor-simulacao", "");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  iframes.push(iframe);
  while (iframes.length > IFRAMES_GUARDADOS) iframes.shift()?.remove();
  const janela = iframe.contentWindow as (Window & typeof globalThis) | null;
  if (!janela) throw new Error("não deu para criar o reino do executor");
  return new NucleoExecutor({
    global: janela as unknown as Record<string, unknown>,
    // janela.eval chamado como método é um eval indireto: roda no escopo global do iframe.
    avaliar: (codigo) => janela.eval(codigo),
    mensagemDeSintaxe: (fonte) => {
      try {
        new janela.Function(fonte);
        return null;
      } catch (erro) {
        return erro instanceof Error || (typeof erro === "object" && erro !== null && "message" in erro) ? String((erro as { message: unknown }).message) : String(erro);
      }
    },
    agora: () => performance.now(),
  });
}

/** Um núcleo novo (memória vazia), ou null se não há onde rodar. */
export function criarNucleoSincrono(): NucleoExecutor | null {
  if (fabrica) return fabrica();
  if (typeof document !== "undefined" && typeof navigator !== "undefined" && !/jsdom/i.test(navigator.userAgent)) return nucleoEmIframe();
  return null;
}
