"use client";

/*
 * A bancada de uma fase circuito-logico (ou de um desafio com circuito): o circuito (fonte única de
 * verdade, como o body do site nas fases de página), a corrente simulada,
 * as linhas da tabela verdade já testadas e o "ver como código". As
 * mudanças passam pelo modelo (src/motor/circuito/modelo.ts), as mesmas
 * funções que as ações das soluções e a simulação dos testes usam.
 */
import { useCallback, useMemo, useRef, useState } from "react";
import type { Fase } from "@/conteudo/tipos";
import { circuitoDaFase } from "@/motor/tiposDeFase";
import type { Barramento } from "@/motor/barramento";
import * as bancada from "@/motor/circuito/modelo";
import type { EventoFase } from "@/motor/eventos";

type Estado = { circuito: bancada.Circuito; valores: bancada.Valores; testadas: number[] };

type Opcoes = { fase: Fase; barramento: Barramento; salvo: bancada.Circuito | null; aoUsar?: (ferramenta: "circuito" | "tabela-verdade") => void };

function comecar(circuito: bancada.Circuito): Estado {
  return { circuito, valores: bancada.simular(circuito).valores, testadas: [bancada.linhaAtual(circuito)] };
}

export function useCircuito({ fase, barramento, salvo, aoUsar }: Opcoes) {
  const dados = circuitoDaFase(fase);
  const [estado, setEstado] = useState<Estado | null>(() => (dados ? comecar(salvo ?? dados.inicial) : null));
  /** O mesmo estado, lido na hora (as soluções fazem várias ações seguidas). */
  const atual = useRef(estado);
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [destaque, setDestaque] = useState<string | null>(null);

  const trocar = useCallback(
    (novo: bancada.Circuito, eventos: EventoFase[]) => {
      const anterior = atual.current;
      if (!anterior) return;
      const valores = bancada.simular(novo, anterior.valores).valores;
      const linha = bancada.linhaAtual(novo);
      const proximo: Estado = { circuito: novo, valores, testadas: anterior.testadas.includes(linha) ? anterior.testadas : [...anterior.testadas, linha] };
      atual.current = proximo;
      setEstado(proximo);
      for (const evento of eventos) barramento.emitir(evento);
    },
    [barramento],
  );

  const adicionarPortao = useCallback(
    (portao: bancada.TipoPortao, id?: string, lugar?: { x: number; y: number }) => {
      const agora = atual.current;
      if (!agora || (id && agora.circuito.pecas.some((p) => p.id === id))) return false;
      aoUsar?.("circuito");
      trocar(bancada.adicionarPortao(agora.circuito, portao, id, lugar), [{ tipo: "mudouCircuito" }]);
      return true;
    },
    [aoUsar, trocar],
  );

  const ligarFio = useCallback(
    (de: string, para: string, porta: number) => {
      const agora = atual.current;
      const novo = agora ? bancada.ligarFio(agora.circuito, { de, para, porta }) : null;
      if (!novo) return false;
      aoUsar?.("circuito");
      trocar(novo, [{ tipo: "mudouCircuito" }]);
      return true;
    },
    [aoUsar, trocar],
  );

  const alternarEntrada = useCallback(
    (entrada: string, ligada?: boolean) => {
      const agora = atual.current;
      const peca = agora?.circuito.pecas.find((p) => p.id === entrada && p.tipo === "entrada");
      if (!agora || !peca) return false;
      aoUsar?.("circuito");
      const nova = ligada ?? !peca.ligada;
      trocar(bancada.alternarEntrada(agora.circuito, entrada, nova), [{ tipo: "alternouEntrada", entrada, ligada: nova }]);
      return true;
    },
    [aoUsar, trocar],
  );

  const apagarPeca = useCallback(
    (id: string) => {
      const agora = atual.current;
      const peca = agora?.circuito.pecas.find((p) => p.id === id);
      if (!agora || !peca || peca.fixa) return false;
      trocar(bancada.apagarPeca(agora.circuito, id), [{ tipo: "mudouCircuito" }]);
      return true;
    },
    [trocar],
  );

  const apagarFio = useCallback(
    (para: string, porta: number) => {
      const agora = atual.current;
      if (!agora) return;
      trocar(bancada.apagarFio(agora.circuito, para, porta), [{ tipo: "mudouCircuito" }]);
    },
    [trocar],
  );

  /** Arrastar muda só o lugar: não é evento (o circuito é o mesmo). */
  const moverPeca = useCallback((id: string, x: number, y: number) => {
    const agora = atual.current;
    if (!agora) return;
    const proximo = { ...agora, circuito: bancada.moverPeca(agora.circuito, id, x, y) };
    atual.current = proximo;
    setEstado(proximo);
  }, []);

  const verComoCodigo = useCallback(() => {
    aoUsar?.("tabela-verdade");
    setMostrarCodigo(true);
    barramento.emitir({ tipo: "viuCodigoDoCircuito" });
  }, [aoUsar, barramento]);

  const alternarCodigo = useCallback(() => {
    if (mostrarCodigo) setMostrarCodigo(false);
    else verComoCodigo();
  }, [mostrarCodigo, verComoCodigo]);

  const circuitoAgora = useCallback(() => atual.current?.circuito ?? null, []);
  const tabela = useMemo(() => (estado ? bancada.tabelaVerdade(estado.circuito) : []), [estado]);
  const fios = useMemo(() => (estado ? bancada.simular(estado.circuito, estado.valores).fios : {}), [estado]);

  return {
    ativo: dados !== null,
    paleta: dados?.paleta ?? [],
    circuito: estado?.circuito ?? null,
    valores: estado?.valores ?? {},
    fios,
    testadas: estado?.testadas ?? [],
    tabela,
    mostrarCodigo,
    destaque,
    setDestaque,
    adicionarPortao,
    ligarFio,
    alternarEntrada,
    apagarPeca,
    apagarFio,
    moverPeca,
    verComoCodigo,
    alternarCodigo,
    circuitoAgora,
  };
}

export type BancadaDoCircuito = ReturnType<typeof useCircuito>;
