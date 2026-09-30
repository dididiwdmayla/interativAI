/*
 * Hospedeiro do executor no Node (testar:conteudo e testes unitários): um
 * contexto `vm` novo por sessão, com o limite de tempo do próprio vm como
 * reserva. Síncrono, como os validadores do jogo. Não é barreira de
 * segurança (no Node só roda conteúdo do próprio projeto); no navegador o
 * código do jogador roda no Web Worker (executor.worker.ts).
 */
import vm from "node:vm";
import { NucleoExecutor } from "./nucleo";
import { LIMITES } from "./tipos";

export function criarNucleoNode(): NucleoExecutor {
  const contexto = vm.createContext({});
  return new NucleoExecutor({
    global: contexto as Record<string, unknown>,
    avaliar: (codigo) => vm.runInContext(codigo, contexto, { filename: "codigo.js", timeout: LIMITES.reservaMs }),
    mensagemDeSintaxe: (fonte) => {
      try {
        new vm.Script(fonte);
        return null;
      } catch (erro) {
        return erro instanceof Error ? erro.message : String(erro);
      }
    },
    agora: () => performance.now(),
    ehEstouroDeTempo: (erro) => typeof erro === "object" && erro !== null && (erro as { code?: unknown }).code === "ERR_SCRIPT_EXECUTION_TIMEOUT",
  });
}
