/*
 * O Python no navegador: um Web Worker com o Pyodide, criado só quando
 * alguém pede (o Rodar do Python no comparador) e guardado para a página
 * inteira (sair de uma fase e voltar não baixa nem acorda de novo).
 *
 * A carga avisa o andamento (baixando, acordando, pronto) para a tela
 * mostrar um estado amigável. Um programa que passa do tempo limite
 * derruba o worker (o Python não tem como ser parado no meio sem
 * isolamento de origem cruzada); o próximo Rodar acorda um novo, já com os
 * arquivos no cache.
 */
import type { PedidoPython, RespostaPython } from "./mensagens";
import { type CargaPython, ENDERECO_PYODIDE, LIMITES_PYTHON, type ResultadoLinguagem } from "../tipos";

type PedidoSemId = PedidoPython extends infer P ? (P extends { id: number } ? Omit<P, "id"> : never) : never;
type Espera = { resolver: (resposta: RespostaPython | null) => void; relogio: ReturnType<typeof setTimeout> };

export class SessaoPython {
  private worker: Worker | null = null;
  private proximo = 1;
  private readonly esperas = new Map<number, Espera>();
  private readonly ouvintes = new Set<(carga: CargaPython | null) => void>();
  private carregado: Promise<boolean> | null = null;
  private fila: Promise<unknown> = Promise.resolve();
  /** O andamento da carga agora (null: ninguém pediu ainda). */
  carga: CargaPython | null = null;

  /** Acompanha o andamento da carga. Devolve a função que para de acompanhar. */
  ouvir(ouvinte: (carga: CargaPython | null) => void): () => void {
    this.ouvintes.add(ouvinte);
    return () => this.ouvintes.delete(ouvinte);
  }

  private avisar(carga: CargaPython | null) {
    this.carga = carga;
    for (const ouvinte of this.ouvintes) ouvinte(carga);
  }

  private garantirWorker(): Worker {
    if (this.worker) return this.worker;
    const worker = new Worker(new URL("./python.worker.ts", import.meta.url), { type: "module" });
    worker.addEventListener("message", (evento: MessageEvent<RespostaPython>) => {
      const resposta = evento.data;
      if (resposta.tipo === "carga") {
        this.avisar(resposta.carga);
        return;
      }
      const espera = this.esperas.get(resposta.id);
      if (!espera) return;
      clearTimeout(espera.relogio);
      this.esperas.delete(resposta.id);
      espera.resolver(resposta);
    });
    worker.addEventListener("error", () => this.derrubar("O Python não conseguiu acordar neste navegador."));
    this.worker = worker;
    return worker;
  }

  private derrubar(motivo: string | null) {
    this.worker?.terminate();
    this.worker = null;
    this.carregado = null;
    for (const espera of this.esperas.values()) {
      clearTimeout(espera.relogio);
      espera.resolver(null);
    }
    this.esperas.clear();
    this.avisar(motivo ? { etapa: "falhou", mensagem: motivo } : null);
  }

  private enviar(pedido: PedidoSemId, limiteMs: number): Promise<RespostaPython | null> {
    const id = this.proximo++;
    const worker = this.garantirWorker();
    return new Promise((resolver) => {
      const relogio = setTimeout(() => {
        this.esperas.delete(id);
        this.derrubar(null);
        resolver(null);
      }, limiteMs);
      this.esperas.set(id, { resolver, relogio });
      worker.postMessage({ ...pedido, id } as PedidoPython);
    });
  }

  /** Baixa (ou pega do cache) e acorda o Python. Devolve se deu certo. */
  carregar(): Promise<boolean> {
    if (!this.carregado) {
      this.avisar({ etapa: "baixando", baixados: 0, total: 1 });
      this.carregado = this.enviar({ tipo: "carregar", endereco: ENDERECO_PYODIDE }, LIMITES_PYTHON.cargaMs).then((resposta) => {
        if (resposta?.tipo === "pronto") return true;
        this.derrubar(resposta?.tipo === "falha" ? resposta.mensagem : "O Python demorou demais para acordar. Confira a internet e tente de novo.");
        return false;
      });
    }
    return this.carregado;
  }

  /** Roda um programa (um de cada vez), com a memória vazia. */
  executar(codigo: string): Promise<ResultadoLinguagem> {
    const tarefa = async (): Promise<ResultadoLinguagem> => {
      if (!(await this.carregar())) {
        const mensagem = this.carga?.etapa === "falhou" ? this.carga.mensagem : "O Python não acordou.";
        return { linguagem: "python", codigo, saidas: [], erro: { tipo: "nao-suportado", nome: "Python indisponível", mensagem, linha: null, coluna: null }, simulado: false };
      }
      const resposta = await this.enviar({ tipo: "executar", codigo }, LIMITES_PYTHON.tempoMs);
      if (resposta?.tipo === "executar") return resposta.resultado;
      return {
        linguagem: "python",
        codigo,
        saidas: [],
        erro: {
          tipo: resposta?.tipo === "falha" ? "execucao" : "limite-tempo",
          nome: resposta?.tipo === "falha" ? "Error" : "Parada do jogo",
          mensagem: resposta?.tipo === "falha" ? resposta.mensagem : `O programa rodou por mais de ${LIMITES_PYTHON.tempoMs / 1000} segundos e o jogo parou ele.`,
          linha: null,
          coluna: null,
        },
        simulado: false,
      };
    };
    const proxima = this.fila.then(tarefa, tarefa);
    this.fila = proxima.catch(() => undefined);
    return proxima;
  }
}

let unica: SessaoPython | null = null;

/** A sessão do Python da página (uma só: o Pyodide é grande). */
export function sessaoPython(): SessaoPython {
  unica ??= new SessaoPython();
  return unica;
}
