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
import type { ErroExecucao, OrigemCodigo, ResultadoExecucao, SaidaConsole, ValorExibido } from "@/motor/executor/tipos";
import { chaveFuncaoPassa, type EstadoPrograma, memoriaParaExibido, resumirExecucao, testesDeFuncaoDaFase } from "@/motor/programa";

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

type Opcoes = {
  fase: Fase;
  barramento: Barramento;
  /** O que foi salvo da última vez (null: começa do zero). */
  salvo: ProgramaSalvo | null;
  /** Avisa a ferramenta usada (apresentações). */
  aoUsar?: (ferramenta: "console" | "snippet") => void;
};

export function usePrograma({ fase, barramento, salvo, aoUsar }: Opcoes) {
  const ativo = fase.programa !== undefined;
  const nomeSnippet = fase.programa?.snippet?.nome ?? "programa.js";
  const [sessao] = useState(() => (ativo ? new SessaoNavegador() : null));
  const [linhas, setLinhas] = useState<LinhaConsole[]>([]);
  const [historico, setHistorico] = useState<string[]>(() => (salvo?.entradas ?? []).filter((e) => e.origem === "console").map((e) => e.codigo));
  const [snippetInicial] = useState(() => salvo?.snippet ?? fase.programa?.snippet?.codigoInicial ?? "");
  const [entradas, setEntradas] = useState<ProgramaSalvo["entradas"]>(() => salvo?.entradas ?? []);
  const [snippetSalvo, setSnippetSalvo] = useState<string | null>(salvo?.snippet ?? null);
  const [ultimo, setUltimo] = useState<ResultadoExecucao | null>(null);
  const [ocupado, setOcupado] = useState(0);
  const [pronto, setPronto] = useState(!ativo);
  const editorSnippetRef = useRef<ApiEditor | null>(null) as RefObject<ApiEditor | null>;
  const snippetAtual = useRef(snippetInicial);
  const estado = useRef<EstadoPrograma>({ memoria: null, testes: {} });
  const proximoId = useRef(1);
  const testes = useMemo(() => (ativo ? testesDeFuncaoDaFase(fase) : []), [ativo, fase]);
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
      estado.current = { memoria: resultado.memoriaFinal, testes: novos };
    },
    [sessao, testes],
  );

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

  const rodar = useCallback(
    async (codigo: string, origem: OrigemCodigo) => {
      if (!sessao) return;
      if (origem === "console") {
        acrescentar([{ tipo: "entrada", codigo }]);
        setHistorico((atual) => (atual[atual.length - 1] === codigo ? atual : [...atual, codigo].slice(-100)));
      } else {
        acrescentar([{ tipo: "info", texto: `Rodou o snippet ${nomeSnippet}` }]);
      }
      setOcupado((n) => n + 1);
      // Os testes de navegador esperam o programa terminar (data-pronto).
      const encerrar = comecarPendencia();
      try {
        const resultado = await sessao.executar(codigo, origem);
        await atualizarEstado(resultado);
        // console.clear() apaga o que tinha antes, como no Chrome.
        const ultimoLimpar = resultado.saidas.map((s) => Boolean(s.limpar)).lastIndexOf(true);
        const saidas = ultimoLimpar >= 0 ? resultado.saidas.slice(ultimoLimpar) : resultado.saidas;
        const novas: LinhaSemId[] = saidas.map((saida) => (saida.limpar ? { tipo: "info", texto: "O console foi limpo" } : { tipo: "saida", saida }));
        if (resultado.erro) novas.push({ tipo: "erro", erro: resultado.erro, origem });
        else if (origem === "console") novas.push({ tipo: "resposta", valor: resultado.resultado });
        acrescentar(novas, ultimoLimpar >= 0);
        setUltimo(resultado);
        if (!resultado.erro || resultado.erro.tipo === "execucao") {
          setEntradas((atuais) => [...atuais, { codigo, origem: origem === "snippet" ? ("snippet" as const) : ("console" as const) }].slice(-MAXIMO_ENTRADAS_SALVAS));
        }
        barramento.emitir({ tipo: "executouCodigo", execucao: resumirExecucao(resultado) });
      } finally {
        setOcupado((n) => n - 1);
        encerrar();
      }
    },
    [acrescentar, atualizarEstado, barramento, nomeSnippet, sessao],
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
    programaSalvo,
    executarNoConsole,
    executarSnippet,
    definirSnippet,
    aoMudarSnippet,
    limparConsole,
    estadoValidacao,
    contextoTutor,
  };
}

export type Programa = ReturnType<typeof usePrograma>;
