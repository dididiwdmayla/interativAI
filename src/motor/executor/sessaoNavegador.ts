/*
 * A sessão do executor no navegador: um Web Worker por fase (a sessão do
 * Console), com a proteção final contra travar a aba. Os ganchos já param
 * loop infinito por passos e por tempo (LIMITES); se o worker não responder
 * em LIMITES.reservaMs, ele é encerrado, um worker novo nasce e as entradas
 * que tinham dado certo rodam de novo em silêncio (a memória volta como
 * estava antes da entrada que travou).
 */
import type { PedidoExecutor, RespostaExecutor } from "./mensagens";
import { LIMITES, type CasoFuncao, type FotoMemoria, type OrigemCodigo, type ResultadoAvaliacao, type ResultadoExecucao, type ResultadoTesteFuncao } from "./tipos";

export interface SessaoExecutor {
  executar(codigo: string, origem: OrigemCodigo): Promise<ResultadoExecucao>;
  testarFuncao(nome: string, casos: CasoFuncao[]): Promise<ResultadoTesteFuncao>;
  /** O depurador pausado: avalia expressões na memória de um passo (sem mudar o programa). */
  avaliarNaFoto(expressoes: string[], foto: FotoMemoria, quadro: number): Promise<ResultadoAvaliacao[]>;
  /** Roda de novo, em silêncio, o que já tinha rodado (a memória volta como estava). */
  restaurar(entradas: { codigo: string; origem: OrigemCodigo }[]): Promise<void>;
  /** Começa do zero (memória vazia). */
  reiniciar(): void;
  encerrar(): void;
}

type Espera = { resolver: (resposta: RespostaExecutor) => void; relogio: ReturnType<typeof setTimeout> };

type PedidoSemId = PedidoExecutor extends infer P ? (P extends { id: number } ? Omit<P, "id"> : never) : never;

function criarWorker(): Worker {
  return new Worker(new URL("./executor.worker.ts", import.meta.url), { type: "module" });
}

export class SessaoNavegador implements SessaoExecutor {
  private worker: Worker | null = null;
  private proximo = 1;
  private readonly esperas = new Map<number, Espera>();
  private historico: { codigo: string; origem: OrigemCodigo }[] = [];
  private fila: Promise<unknown> = Promise.resolve();

  private garantirWorker(): Worker {
    if (this.worker) return this.worker;
    const worker = criarWorker();
    worker.addEventListener("message", (evento: MessageEvent<RespostaExecutor>) => {
      const espera = this.esperas.get(evento.data.id);
      if (!espera) return;
      clearTimeout(espera.relogio);
      this.esperas.delete(evento.data.id);
      espera.resolver(evento.data);
    });
    this.worker = worker;
    return worker;
  }

  private derrubarWorker() {
    this.worker?.terminate();
    this.worker = null;
  }

  private enviar(pedido: PedidoSemId, limiteMs: number): Promise<RespostaExecutor | null> {
    const id = this.proximo++;
    const worker = this.garantirWorker();
    return new Promise((resolver) => {
      const relogio = setTimeout(() => {
        this.esperas.delete(id);
        this.derrubarWorker();
        resolver(null);
      }, limiteMs);
      this.esperas.set(id, { resolver, relogio });
      worker.postMessage({ ...pedido, id } as PedidoExecutor);
    });
  }

  /** Um pedido de cada vez (a memória é uma só). */
  private emFila<T>(tarefa: () => Promise<T>): Promise<T> {
    const proxima = this.fila.then(tarefa, tarefa);
    this.fila = proxima.catch(() => undefined);
    return proxima;
  }

  private async recuperar() {
    if (!this.historico.length) return;
    await this.enviar({ tipo: "repetir", entradas: this.historico }, LIMITES.reservaMs * 2);
  }

  executar(codigo: string, origem: OrigemCodigo): Promise<ResultadoExecucao> {
    return this.emFila(async () => {
      const resposta = await this.enviar({ tipo: "executar", codigo, origem }, LIMITES.reservaMs);
      if (resposta?.tipo === "executar") {
        if (!resposta.resultado.erro || resposta.resultado.erro.tipo === "execucao") this.historico.push({ codigo, origem });
        return resposta.resultado;
      }
      await this.recuperar();
      return resultadoDeEstouro(codigo, origem, resposta?.tipo === "falha" ? resposta.mensagem : null);
    });
  }

  testarFuncao(nome: string, casos: CasoFuncao[]): Promise<ResultadoTesteFuncao> {
    return this.emFila(async () => {
      const resposta = await this.enviar({ tipo: "testarFuncao", nome, casos }, LIMITES.reservaMs);
      if (resposta?.tipo === "testarFuncao") return resposta.resultado;
      await this.recuperar();
      const erro = { tipo: "limite-tempo" as const, nome: "Parada do jogo", mensagem: "A função demorou demais e o jogo parou ela.", linha: null, coluna: null };
      return { nome, existe: true, passou: false, casos: casos.map((c) => ({ args: c.args, esperado: c.esperado, obtido: null, erro, passou: false })) };
    });
  }

  avaliarNaFoto(expressoes: string[], foto: FotoMemoria, quadro: number): Promise<ResultadoAvaliacao[]> {
    return this.emFila(async () => {
      if (!expressoes.length) return [];
      const resposta = await this.enviar({ tipo: "avaliarNaFoto", expressoes, foto, quadro }, LIMITES.reservaMs);
      if (resposta?.tipo === "avaliarNaFoto") return resposta.resultados;
      await this.recuperar();
      return expressoes.map((expressao) => ({ expressao, erro: "A expressão demorou demais e o jogo parou ela." }));
    });
  }

  restaurar(entradas: { codigo: string; origem: OrigemCodigo }[]): Promise<void> {
    return this.emFila(async () => {
      this.historico = [...entradas];
      await this.recuperar();
    });
  }

  reiniciar() {
    for (const espera of this.esperas.values()) clearTimeout(espera.relogio);
    this.esperas.clear();
    this.historico = [];
    this.derrubarWorker();
  }

  encerrar() {
    this.reiniciar();
  }
}

function resultadoDeEstouro(codigo: string, origem: OrigemCodigo, falha: string | null): ResultadoExecucao {
  return {
    origem,
    codigo,
    resultado: { t: "undefined" },
    saidas: [],
    erro: {
      tipo: falha ? "execucao" : "limite-tempo",
      nome: falha ? "Error" : "Parada do jogo",
      mensagem: falha ?? `O programa rodou por mais de ${LIMITES.reservaMs / 1000} segundos e o jogo parou ele.`,
      linha: null,
      coluna: null,
    },
    passos: [],
    rastroCortado: false,
    totalPassos: 0,
    memoriaFinal: { quadros: [{ nome: "Global", chamada: 0, escopos: [] }], monte: {} },
    globais: [],
    sintaxes: [],
  };
}
