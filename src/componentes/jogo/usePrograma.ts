"use client";

/*
 * A sessão de uma fase de programa (Ilha Lógica): o Web Worker do executor,
 * as linhas do Console, o Snippet e o que os validadores de código olham.
 * Cada execução, quando termina, vira o evento `executouCodigo` no
 * barramento (o motor da fase confere o objetivo na hora).
 */
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ApiEditor } from "@/componentes/painel/editor/EditorCodigo";
import type { Fase } from "@/conteudo/tipos";
import { comecarPendencia } from "@/lib/pendencias";
import { MAXIMO_ENTRADAS_SALVAS, type ProgramaSalvo } from "@/lib/progresso";
import type { ContextoProgramaTutor } from "@/lib/tutor/tipos";
import type { Barramento } from "@/motor/barramento";
import { textoDoErro } from "@/motor/executor/erros";
import { textoPrevia } from "@/motor/executor/formatar";
import { SessaoNavegador } from "@/motor/executor/sessaoNavegador";
import type { CasoFuncao, ErroExecucao, FotoMemoria, MedicaoPassos, OrigemCodigo, ResultadoAvaliacao, ResultadoExecucao, ResultadoTesteFuncao, SaidaConsole, ValorExibido } from "@/motor/executor/tipos";
import { chaveFuncaoPassa, type EstadoPrograma, medicoesDaFase, memoriaParaExibido, resumirExecucao, testesDeFuncaoDaFase } from "@/motor/programa";
import { chamadasDaMedicao } from "@/motor/desempenho";

export type LinhaConsole =
  | { id: number; tipo: "entrada"; codigo: string }
  | { id: number; tipo: "saida"; saida: SaidaConsole }
  | { id: number; tipo: "resposta"; valor: ValorExibido }
  | { id: number; tipo: "erro"; erro: ErroExecucao; origem: OrigemCodigo }
  | { id: number; tipo: "info"; texto: string };

type DistribuirLinha<T> = T extends { id: number } ? Omit<T, "id"> : never;
type LinhaSemId = DistribuirLinha<LinhaConsole>;

/** Linhas guardadas no Console (as mais antigas saem). */
const MAXIMO_LINHAS = 400;

/**
 * Os ganchos do depurador (useDepurador) na sessão: o Snippet que pausa
 * fica "segurado" (as saídas do console aparecem aos poucos e o
 * `executouCodigo` só sai quando o programa termina) e o Console, pausado,
 * responde no momento da pausa.
 */
export type GanchosDepuracao = {
  /** O Snippet rodou no Worker: true se o depurador pausou (o resultado fica segurado). */
  pausar: (resultado: ResultadoExecucao) => boolean;
  /** O Console com o depurador pausado: a resposta no momento da pausa (null: não está pausado). */
  responderNaPausa: (codigo: string) => Promise<ResultadoAvaliacao> | null;
  /** Antes de rodar algo novo, a pausa de agora termina (o programa segurado conclui). */
  encerrar: () => void;
};

type Opcoes = {
  fase: Fase;
  barramento: Barramento;
  /** O que foi salvo da última vez (null: começa do zero). */
  salvo: ProgramaSalvo | null;
  /** Avisa a ferramenta usada (apresentações). */
  aoUsar?: (ferramenta: "console" | "snippet") => void;
};

/** "ReferenceError: x is not defined" vira o erro do Console (nome e mensagem). */
function erroDeTexto(texto: string): ErroExecucao {
  const achado = /^([A-Za-z]*Error): ([\s\S]*)$/.exec(texto);
  return { tipo: "execucao", nome: achado?.[1] ?? "", mensagem: achado?.[2] ?? texto, linha: null, coluna: null };
}

export function usePrograma({ fase, barramento, salvo, aoUsar }: Opcoes) {
  /** (Depurador) Os ganchos, preenchidos pelo useDepurador (definirDepuracao). */
  const depuracao = useRef<GanchosDepuracao | null>(null);
  const definirDepuracao = useCallback((ganchos: GanchosDepuracao | null) => {
    depuracao.current = ganchos;
  }, []);
  const ativo = fase.programa !== undefined;
  const nomeSnippet = fase.programa?.snippet?.nome ?? "programa.js";
  const [sessao] = useState(() => (ativo ? new SessaoNavegador() : null));
  const [linhas, setLinhas] = useState<LinhaConsole[]>([]);
  const [historico, setHistorico] = useState<string[]>(() => (salvo?.entradas ?? []).filter((e) => e.origem === "console").map((e) => e.codigo));
  const [snippetInicial] = useState(() => salvo?.snippet ?? fase.programa?.snippet?.codigoInicial ?? "");
  const [entradas, setEntradas] = useState<ProgramaSalvo["entradas"]>(() => salvo?.entradas ?? []);
  const [snippetSalvo, setSnippetSalvo] = useState<string | null>(salvo?.snippet ?? null);
  const [ultimo, setUltimo] = useState<ResultadoExecucao | null>(null);
  /** A memória do fim da execução anterior (o palco pisca o que esta execução mudou). */
  const [memoriaAnterior, setMemoriaAnterior] = useState<ResultadoExecucao["memoriaFinal"] | null>(null);
  const ultimoAtual = useRef<ResultadoExecucao | null>(null);
  const mostrarResultado = useCallback((resultado: ResultadoExecucao) => {
    setMemoriaAnterior(ultimoAtual.current?.memoriaFinal ?? null);
    ultimoAtual.current = resultado;
    setUltimo(resultado);
  }, []);
  const [ocupado, setOcupado] = useState(0);
  const [pronto, setPronto] = useState(!ativo);
  const editorSnippetRef = useRef<ApiEditor | null>(null) as RefObject<ApiEditor | null>;
  const snippetAtual = useRef(snippetInicial);
  const estado = useRef<EstadoPrograma>({ memoria: null, testes: {} });
  const proximoId = useRef(1);
  const testes = useMemo(() => (ativo ? testesDeFuncaoDaFase(fase) : []), [ativo, fase]);
  const medicoesPedidas = useMemo(() => (ativo ? medicoesDaFase(fase) : []), [ativo, fase]);
  const aoUsarAtual = useRef(aoUsar);
  useEffect(() => {
    aoUsarAtual.current = aoUsar;
  }, [aoUsar]);

  const acrescentar = useCallback((novas: LinhaSemId[], limpar = false) => {
    setLinhas((atuais) => {
      const base = limpar ? [] : atuais;
      const comId = novas.map((linha) => ({ ...linha, id: proximoId.current++ }) as LinhaConsole);
      return [...base, ...comId].slice(-MAXIMO_LINHAS);
    });
  }, []);

  /** Roda os testes de função da fase e guarda a memória (o que os validadores olham). */
  const atualizarEstado = useCallback(
    async (resultado: ResultadoExecucao) => {
      if (!sessao) return;
      const novos: EstadoPrograma["testes"] = {};
      for (const teste of testes) novos[chaveFuncaoPassa(teste)] = await sessao.testarFuncao(teste.nome, teste.casos);
      // passosNoMaximo com tamanho: a função medida de novo a cada execução, como o funcaoPassa.
      const medicoes: Record<string, MedicaoPassos> = {};
      for (const pedida of medicoesPedidas) {
        const [medicao] = await sessao.medirPassos(pedida.funcao, [{ tamanho: pedida.tamanho, args: pedida.args }]);
        if (medicao) medicoes[pedida.chave] = medicao;
      }
      estado.current = { memoria: resultado.memoriaFinal, testes: novos, ...(medicoesPedidas.length ? { medicoes } : {}) };
    },
    [medicoesPedidas, sessao, testes],
  );

  /** (Desempenho) O gráfico: cada função da fase com as listas de cada tamanho. */
  const medirDesempenho = useCallback(async (): Promise<MedicaoPassos[]> => {
    const config = fase.programa?.desempenho;
    if (!sessao || !config) return [];
    const encerrar = comecarPendencia();
    setOcupado((n) => n + 1);
    try {
      const todas: MedicaoPassos[] = [];
      for (const funcao of config.funcoes) todas.push(...(await sessao.medirPassos(funcao.nome, chamadasDaMedicao(config, funcao))));
      return todas;
    } finally {
      setOcupado((n) => n - 1);
      encerrar();
    }
  }, [fase.programa?.desempenho, sessao]);

  // Abertura: o preparo da fase e o que já tinha rodado voltam em silêncio.
  useEffect(() => {
    if (!sessao) return;
    let cancelado = false;
    const encerrar = comecarPendencia();
    const restaurar = async () => {
      const lista = [...(fase.programa?.preparo ? [{ codigo: fase.programa.preparo, origem: "console" as const }] : []), ...(salvo?.entradas ?? [])];
      if (lista.length) await sessao.restaurar(lista);
      const agora = await sessao.executar("", "console");
      if (cancelado) return;
      await atualizarEstado(agora);
      if (cancelado) return;
      ultimoAtual.current = agora;
      setUltimo(agora);
      if (salvo?.entradas.length) acrescentar([{ tipo: "info", texto: "A memória de antes voltou: as variáveis continuam como estavam." }]);
      setPronto(true);
    };
    void restaurar().finally(encerrar);
    return () => {
      cancelado = true;
      encerrar();
    };
    // Só na abertura: o salvo e o preparo são os do começo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessao]);

  useEffect(() => () => sessao?.encerrar(), [sessao]);

  /** As saídas do console de `de` até `ate` (console.clear() apaga o que tinha antes, como no Chrome). */
  const mostrarSaidas = useCallback(
    (resultado: ResultadoExecucao, de: number, ate: number) => {
      const trecho = resultado.saidas.slice(de, ate);
      const ultimoLimpar = trecho.map((s) => Boolean(s.limpar)).lastIndexOf(true);
      const saidas = ultimoLimpar >= 0 ? trecho.slice(ultimoLimpar) : trecho;
      if (!saidas.length) return;
      acrescentar(
        saidas.map((saida) => (saida.limpar ? { tipo: "info", texto: "O console foi limpo" } : { tipo: "saida", saida })),
        ultimoLimpar >= 0,
      );
    },
    [acrescentar],
  );

  /** O fim de uma execução: o resto das saídas, o erro ou a resposta, a memória dos validadores e o evento. */
  const concluir = useCallback(
    async (resultado: ResultadoExecucao, jaMostradas = 0) => {
      await atualizarEstado(resultado);
      mostrarSaidas(resultado, jaMostradas, resultado.saidas.length);
      const novas: LinhaSemId[] = [];
      if (resultado.erro) novas.push({ tipo: "erro", erro: resultado.erro, origem: resultado.origem });
      else if (resultado.origem === "console") novas.push({ tipo: "resposta", valor: resultado.resultado });
      acrescentar(novas);
      mostrarResultado(resultado);
      barramento.emitir({ tipo: "executouCodigo", execucao: resumirExecucao(resultado) });
    },
    [acrescentar, atualizarEstado, barramento, mostrarResultado, mostrarSaidas],
  );

  /** Roda o código (Console ou Snippet) e devolve o resultado (null: não rodou, ou o Console respondeu na pausa). */
  const rodar = useCallback(
    async (codigo: string, origem: OrigemCodigo, rotulo?: string): Promise<ResultadoExecucao | null> => {
      if (!sessao) return null;
      if (origem === "console") {
        acrescentar([{ tipo: "entrada", codigo }]);
        setHistorico((atual) => (atual[atual.length - 1] === codigo ? atual : [...atual, codigo].slice(-100)));
        // Pausado no depurador: o Console responde no momento da pausa, como no Chrome.
        const naPausa = depuracao.current?.responderNaPausa(codigo) ?? null;
        if (naPausa) {
          const encerrar = comecarPendencia();
          try {
            const resposta = await naPausa;
            acrescentar(["valor" in resposta ? { tipo: "resposta", valor: resposta.valor } : { tipo: "erro", erro: erroDeTexto(resposta.erro), origem }]);
          } finally {
            encerrar();
          }
          return null;
        }
      } else {
        depuracao.current?.encerrar();
        acrescentar([{ tipo: "info", texto: rotulo ?? `Rodou o snippet ${nomeSnippet}` }]);
      }
      setOcupado((n) => n + 1);
      // Os testes de navegador esperam o programa terminar (data-pronto).
      const encerrar = comecarPendencia();
      try {
        const resultado = await sessao.executar(codigo, origem);
        if (!resultado.erro || resultado.erro.tipo === "execucao") {
          setEntradas((atuais) => [...atuais, { codigo, origem: origem === "snippet" ? ("snippet" as const) : ("console" as const) }].slice(-MAXIMO_ENTRADAS_SALVAS));
        }
        // O depurador pausou: o palco mostra o passo da pausa e o resto sai quando o programa terminar.
        if (origem === "snippet" && depuracao.current?.pausar(resultado)) {
          mostrarResultado(resultado);
          return resultado;
        }
        await concluir(resultado);
        return resultado;
      } finally {
        setOcupado((n) => n - 1);
        encerrar();
      }
    },
    [acrescentar, concluir, mostrarResultado, nomeSnippet, sessao],
  );

  /** (Depurador) As expressões do Observar numa foto da memória, no Worker. */
  const avaliarNaFoto = useCallback(
    async (expressoes: string[], foto: FotoMemoria, quadro: number): Promise<ResultadoAvaliacao[]> => (sessao ? sessao.avaliarNaFoto(expressoes, foto, quadro) : []),
    [sessao],
  );

  const executarNoConsole = useCallback(
    (codigo: string) => {
      if (!codigo.trim()) return;
      aoUsarAtual.current?.("console");
      void rodar(codigo, "console");
    },
    [rodar],
  );

  const executarSnippet = useCallback(() => {
    aoUsarAtual.current?.("snippet");
    void rodar(snippetAtual.current, "snippet");
  }, [rodar]);

  /** (Casos de teste) Roda o Snippet e espera o fim: os casos chamam a função do código de agora. */
  const executarSnippetEsperando = useCallback((rotulo: string) => rodar(snippetAtual.current, "snippet", rotulo), [rodar]);

  /** (Casos de teste) Chama a função global com cada caso, na sessão de agora (null: a fase não tem programa). */
  const testarFuncao = useCallback(
    async (nome: string, casos: CasoFuncao[]): Promise<ResultadoTesteFuncao | null> => (sessao ? sessao.testarFuncao(nome, casos) : null),
    [sessao],
  );

  /**
   * (Ordenar passos) Roda o código do plano, na ordem dos cartões, com a
   * memória zerada (cada ordem roda do começo, para ver o que quebra).
   */
  const executarPlano = useCallback(
    (codigo: string) => {
      if (!sessao) return;
      sessao.reiniciar();
      setEntradas([]);
      const preparo = fase.programa?.preparo;
      void (async () => {
        if (preparo) await sessao.restaurar([{ codigo: preparo, origem: "console" }]);
        await rodar(codigo, "snippet", "Rodou o plano");
      })();
    },
    [fase.programa?.preparo, rodar, sessao],
  );

  const aoMudarSnippet = useCallback((texto: string) => {
    snippetAtual.current = texto;
    setSnippetSalvo(texto);
  }, []);

  const definirSnippet = useCallback(
    (codigo: string) => {
      snippetAtual.current = codigo;
      setSnippetSalvo(codigo);
      editorSnippetRef.current?.definirTexto(codigo);
    },
    [editorSnippetRef],
  );

  const limparConsole = useCallback(() => {
    setLinhas([{ id: proximoId.current++, tipo: "info", texto: "O console foi limpo" }]);
  }, []);

  /** O texto do Snippet agora (lido na hora: o plano no código e o validador planoComentado). */
  const textoSnippet = useCallback(() => snippetAtual.current, []);

  /** O que os validadores de código olham agora (lido na hora). */
  const estadoValidacao = useCallback((): EstadoPrograma => estado.current, []);

  /** Código, último erro e variáveis, para o tutor. */
  const contextoTutor = useCallback((): ContextoProgramaTutor | null => {
    if (!ativo) return null;
    const console = entradas
      .filter((e) => e.origem === "console")
      .slice(-12)
      .map((e) => `> ${e.codigo}`)
      .join("\n");
    const codigo = [fase.programa?.snippet ? `// ${nomeSnippet}\n${snippetAtual.current}` : "", console ? `// Console\n${console}` : ""].filter(Boolean).join("\n\n");
    const erro = ultimo?.erro ? `${textoDoErro(ultimo.erro)}${ultimo.erro.linha ? ` (linha ${ultimo.erro.linha})` : ""}` : "";
    const memoria = ultimo?.memoriaFinal;
    const variaveis = memoria
      ? (memoria.quadros[0]?.escopos[0]?.variaveis ?? []).map((v) => `${v.nome} = ${textoPrevia(memoriaParaExibido(v.valor, memoria.monte))}`).join("; ")
      : "";
    return { codigo, erro, variaveis };
  }, [ativo, entradas, fase.programa?.snippet, nomeSnippet, ultimo]);

  const programaSalvo = useMemo<ProgramaSalvo | null>(() => (ativo ? { entradas, snippet: snippetSalvo } : null), [ativo, entradas, snippetSalvo]);

  return {
    ativo,
    pronto,
    ocupado: ocupado > 0,
    linhas,
    historico,
    nomeSnippet,
    snippetInicial,
    editorSnippetRef,
    ultimo,
    memoriaAnterior,
    programaSalvo,
    executarNoConsole,
    executarSnippet,
    executarSnippetEsperando,
    testarFuncao,
    executarPlano,
    definirSnippet,
    aoMudarSnippet,
    textoSnippet,
    limparConsole,
    estadoValidacao,
    contextoTutor,
    mostrarSaidas,
    concluir,
    avaliarNaFoto,
    definirDepuracao,
    medirDesempenho,
  };
}

export type Programa = ReturnType<typeof usePrograma>;
