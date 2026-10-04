"use client";

/*
 * O depurador da aba Fontes numa fase de programa (src/motor/depurador.ts):
 * os pontos de parada, a pausa sobre o rastro da execução, os controles do
 * Chrome (com os atalhos), o painel Observar e o quadro escolhido na Pilha
 * de chamadas. O Snippet que pausa fica segurado no usePrograma (ganchos
 * em `depuracao`): as saídas do console aparecem aos poucos, a cada passo,
 * e o `executouCodigo` só sai quando o programa termina.
 */
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ApiEditor } from "@/componentes/painel/editor/EditorCodigo";
import type { OpcoesDepuradorEditor } from "@/componentes/painel/editor/extensoesDepurador";
import type { Fase } from "@/conteudo/tipos";
import type { IdFerramenta } from "@/ferramentas/ids";
import { comecarPendencia } from "@/lib/pendencias";
import type { ProgramaSalvo } from "@/lib/progresso";
import type { Barramento } from "@/motor/barramento";
import {
  alternarPonto,
  type ControleDepurador,
  faseComDepurador,
  linhaDoPontoDeParada,
  normalizarExpressao,
  type PausaDepurador,
  primeiraPausa,
  proximaPausa,
  valorDoNome,
} from "@/motor/depurador";
import { textoPrevia } from "@/motor/executor/formatar";
import { instanteDoPasso, type ResultadoAvaliacao, type ResultadoExecucao } from "@/motor/executor/tipos";
import { memoriaParaExibido } from "@/motor/programa";
import type { GanchosDepuracao, Programa } from "./usePrograma";

export type SessaoDepuracao = {
  resultado: ResultadoExecucao;
  pausa: PausaDepurador;
  /** O quadro escolhido na Pilha de chamadas (o de cima, ao pausar). */
  quadro: number;
  /** Quantas saídas do console já apareceram. */
  mostradas: number;
};

type Opcoes = {
  fase: Fase;
  barramento: Barramento;
  programa: Programa;
  editorRef: RefObject<ApiEditor | null>;
  salvo: ProgramaSalvo | null;
  aoUsar?: (ferramenta: IdFerramenta) => void;
};

/** Atalhos do Chrome (Windows/Linux e Mac): F8, F10, F11, Shift+F11 ou Ctrl (Cmd) com \, ', ; e Shift+;. */
function controleDoAtalho(evento: KeyboardEvent): ControleDepurador | null {
  const mod = evento.ctrlKey || evento.metaKey;
  if (evento.key === "F8" || (mod && evento.code === "Backslash")) return "retomar";
  if (evento.key === "F10" || (mod && evento.code === "Quote")) return "passar-por-cima";
  if (evento.key === "F11" && evento.shiftKey) return "sair";
  if (evento.key === "F11") return "entrar";
  if (mod && evento.code === "Semicolon") return evento.shiftKey ? "sair" : "entrar";
  return null;
}

export function useDepurador({ fase, barramento, programa, editorRef, salvo, aoUsar }: Opcoes) {
  const ativo = faseComDepurador(fase);
  const [pontos, setPontos] = useState<number[]>(() => salvo?.pontos ?? []);
  const pontosAtual = useRef(pontos);
  const [observacoes, setObservacoes] = useState<string[]>(() => salvo?.observacoes ?? []);
  const observacoesAtual = useRef(observacoes);
  const [sessao, setSessao] = useState<SessaoDepuracao | null>(null);
  const sessaoAtual = useRef<SessaoDepuracao | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Record<string, ResultadoAvaliacao>>({});
  const aoUsarAtual = useRef(aoUsar);
  useEffect(() => {
    aoUsarAtual.current = aoUsar;
  }, [aoUsar]);
  const { mostrarSaidas, concluir, avaliarNaFoto, definirDepuracao } = programa;

  const trocarPontos = useCallback((novos: number[]) => {
    pontosAtual.current = novos;
    setPontos(novos);
  }, []);
  const trocarObservacoes = useCallback((novas: string[]) => {
    observacoesAtual.current = novas;
    setObservacoes(novas);
  }, []);
  const trocarSessao = useCallback((nova: SessaoDepuracao | null) => {
    sessaoAtual.current = nova;
    setSessao(nova);
  }, []);

  /** As expressões do Observar no momento pausado (no quadro escolhido), com os eventos. */
  const avaliarObservacoes = useCallback(
    (alvo: SessaoDepuracao, expressoes: readonly string[]) => {
      if (!expressoes.length) return;
      const foto = alvo.resultado.passos[alvo.pausa.indice].memoria;
      const encerrar = comecarPendencia();
      void avaliarNaFoto([...expressoes], foto, alvo.quadro, instanteDoPasso(alvo.resultado, alvo.pausa.indice))
        .then((resultados) => {
          if (sessaoAtual.current?.resultado !== alvo.resultado || sessaoAtual.current.pausa.indice !== alvo.pausa.indice) return;
          setAvaliacoes((atuais) => {
            const novas = { ...atuais };
            for (const r of resultados) novas[r.expressao] = r;
            return novas;
          });
          for (const r of resultados) barramento.emitir({ tipo: "observouValor", expressao: r.expressao, valor: "valor" in r ? r.valor : null });
        })
        .finally(encerrar);
    },
    [avaliarNaFoto, barramento],
  );

  /** Chegou numa pausa: o evento, as saídas do console até ali, a linha acesa e o Observar. */
  const anunciar = useCallback(
    (alvo: SessaoDepuracao): SessaoDepuracao => {
      const passo = alvo.resultado.passos[alvo.pausa.indice];
      mostrarSaidas(alvo.resultado, alvo.mostradas, passo.saidas);
      const comSaidas = { ...alvo, mostradas: Math.max(alvo.mostradas, passo.saidas) };
      trocarSessao(comSaidas);
      setAvaliacoes({});
      barramento.emitir({ tipo: "pausouNoDepurador", linha: alvo.pausa.linha, motivo: alvo.pausa.motivo });
      avaliarObservacoes(comSaidas, observacoesAtual.current);
      return comSaidas;
    },
    [avaliarObservacoes, barramento, mostrarSaidas, trocarSessao],
  );

  /** O programa termina: as saídas que faltam, o erro (se houver) e o evento da execução. */
  const terminar = useCallback(() => {
    const atual = sessaoAtual.current;
    if (!atual) return;
    trocarSessao(null);
    setAvaliacoes({});
    void concluir(atual.resultado, atual.mostradas);
  }, [concluir, trocarSessao]);

  const controlar = useCallback(
    (controle: ControleDepurador): boolean => {
      const atual = sessaoAtual.current;
      if (!atual) return false;
      aoUsarAtual.current?.("controles-depurador");
      barramento.emitir({ tipo: "usouControleDepurador", controle });
      const proxima = proximaPausa(atual.resultado.passos, atual.pausa.indice, controle, pontosAtual.current);
      if (!proxima) {
        terminar();
        return true;
      }
      const quadros = atual.resultado.passos[proxima.indice].memoria.quadros.length;
      anunciar({ ...atual, pausa: proxima, quadro: quadros - 1 });
      return true;
    },
    [anunciar, barramento, terminar],
  );

  // Os ganchos que o usePrograma chama.
  useEffect(() => {
    if (!ativo) return;
    const ganchos: GanchosDepuracao = {
      pausar: (resultado) => {
        const pausa = primeiraPausa(resultado.passos, pontosAtual.current);
        if (!pausa) return false;
        const quadros = resultado.passos[pausa.indice].memoria.quadros.length;
        anunciar({ resultado, pausa, quadro: quadros - 1, mostradas: 0 });
        return true;
      },
      responderNaPausa: (codigo) => {
        const atual = sessaoAtual.current;
        if (!atual) return null;
        const foto = atual.resultado.passos[atual.pausa.indice].memoria;
        return avaliarNaFoto([codigo], foto, atual.quadro, instanteDoPasso(atual.resultado, atual.pausa.indice)).then((r) => r[0] ?? { expressao: codigo, erro: "não deu para avaliar" });
      },
      encerrar: terminar,
    };
    definirDepuracao(ganchos);
    return () => definirDepuracao(null);
  }, [anunciar, ativo, avaliarNaFoto, definirDepuracao, terminar]);

  // Os pontos salvos aparecem no editor quando a fase abre.
  useEffect(() => {
    if (ativo) editorRef.current?.definirPontosDeParada(pontosAtual.current);
  }, [ativo, editorRef]);

  // A linha pausada (e a do quadro escolhido) acesa no editor.
  const linhaDoQuadro = sessao ? (sessao.resultado.passos[sessao.pausa.indice].memoria.quadros[sessao.quadro]?.linha ?? null) : null;
  useEffect(() => {
    if (!ativo) return;
    editorRef.current?.definirPausa(sessao?.pausa.linha ?? null, sessao && sessao.quadro !== sessao.resultado.passos[sessao.pausa.indice].memoria.quadros.length - 1 ? linhaDoQuadro : null);
  }, [ativo, editorRef, linhaDoQuadro, sessao]);

  /** Clique no número da linha (ou Ctrl+B na linha do cursor). */
  const alternarPontoDeParada = useCallback(
    (linha: number) => {
      const texto = editorRef.current?.obterTexto() ?? "";
      const alvo = linhaDoPontoDeParada(texto, linha);
      const novos = alternarPonto(pontosAtual.current, alvo);
      trocarPontos(novos);
      editorRef.current?.definirPontosDeParada(novos);
      aoUsarAtual.current?.("pontos-de-parada");
      barramento.emitir({ tipo: "alternouPontoDeParada", linha: alvo, ativo: novos.includes(alvo) });
    },
    [barramento, editorRef, trocarPontos],
  );

  const observar = useCallback(
    (expressao: string) => {
      const limpa = expressao.trim();
      if (!limpa) return;
      if (!observacoesAtual.current.some((e) => normalizarExpressao(e) === normalizarExpressao(limpa))) trocarObservacoes([...observacoesAtual.current, limpa]);
      aoUsarAtual.current?.("painel-observar");
      barramento.emitir({ tipo: "adicionouObservacao", expressao: limpa });
      const atual = sessaoAtual.current;
      if (atual) avaliarObservacoes(atual, [limpa]);
    },
    [avaliarObservacoes, barramento, trocarObservacoes],
  );

  const removerObservacao = useCallback(
    (expressao: string) => trocarObservacoes(observacoesAtual.current.filter((e) => e !== expressao)),
    [trocarObservacoes],
  );

  /** Clique numa linha da Pilha de chamadas: o Escopo e o Observar passam a ser daquela função. */
  const escolherQuadro = useCallback(
    (quadro: number) => {
      const atual = sessaoAtual.current;
      if (!atual) return;
      aoUsarAtual.current?.("pilha-de-chamadas");
      const nova = { ...atual, quadro };
      trocarSessao(nova);
      setAvaliacoes({});
      avaliarObservacoes(nova, observacoesAtual.current);
    },
    [avaliarObservacoes, trocarSessao],
  );

  // Atalhos do Chrome, com o programa pausado.
  useEffect(() => {
    if (!ativo) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (!sessaoAtual.current || evento.defaultPrevented) return;
      const controle = controleDoAtalho(evento);
      if (!controle) return;
      evento.preventDefault();
      controlar(controle);
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [ativo, controlar]);

  /** O valor de um nome no momento pausado, para o hover do código. */
  const valorNaPausa = useCallback((nome: string): string | null => {
    const atual = sessaoAtual.current;
    if (!atual) return null;
    const foto = atual.resultado.passos[atual.pausa.indice].memoria;
    const valor = valorDoNome(foto, atual.quadro, nome);
    return valor ? textoPrevia(memoriaParaExibido(valor, foto.monte), true) : null;
  }, []);

  const opcoesEditor = useMemo<OpcoesDepuradorEditor | undefined>(
    () => (ativo ? { aoClicarNumero: alternarPontoDeParada, aoMudarPontos: trocarPontos, valorNaPausa } : undefined),
    [alternarPontoDeParada, ativo, trocarPontos, valorNaPausa],
  );

  /** O que os validadores olham agora. */
  const estadoValidacao = useCallback(() => ({ pontos: pontosAtual.current, observacoes: observacoesAtual.current }), []);

  return {
    ativo,
    pontos,
    observacoes,
    sessao,
    avaliacoes,
    opcoesEditor,
    alternarPontoDeParada,
    observar,
    removerObservacao,
    escolherQuadro,
    controlar,
    estadoValidacao,
    /** Para salvar com a fase (os pontos e o Observar, como o Chrome guarda). */
    salvo: useMemo(() => (ativo ? { pontos, observacoes } : null), [ativo, observacoes, pontos]),
  };
}

export type Depurador = ReturnType<typeof useDepurador>;
