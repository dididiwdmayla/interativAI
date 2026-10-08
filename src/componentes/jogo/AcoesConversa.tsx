"use client";

import type { ReactNode } from "react";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { BotaoAjuda } from "@/componentes/mascote/BotaoAjuda";
import { BotaoRever } from "@/componentes/mascote/BotaoRever";
import { CartaoPrevisao } from "@/componentes/mascote/CartaoPrevisao";
import { Botao } from "@/componentes/ui/Botao";
import type { Previsao } from "@/conteudo/tipos";
import type { IdFerramenta } from "@/ferramentas/ids";
import { type EstadoMotor, ofereceContinuar } from "@/motor/estadoMotor";
import type { DegrauAjuda } from "@/motor/tipos";

type Props = {
  estado: EstadoMotor;
  totalIntroducao: number;
  /** A pausa atual leva para a conclusão ("Ver resultado"). */
  ultimaPausa: boolean;
  /** O rótulo do botão da última pausa (padrão "Ver resultado"; na Revisão do dia, "Próximo"). */
  rotuloFim?: string;
  /** Objetivo de previsão: a pergunta e as opções. */
  previsao: Previsao | null;
  degrauMaximo: DegrauAjuda;
  desafio: boolean;
  /** Projeto-ponte: o "Me ajuda" só faz uma pergunta (sem dica, sem solução, sem Rever). */
  projeto: boolean;
  /** Contrato: o colega faz uma pergunta e o Rever continua ao lado. */
  contrato?: boolean;
  /** (Contrato) Abre e fecha a lista do Rever (o Me ajuda pergunta). */
  aoAlternarRever?: () => void;
  /** O rótulo do botão de uma pausa que não é fim de objetivo (ex.: "Voltar ao trabalho"). */
  rotuloPausa?: string;
  /** Lista do "Rever", montada por quem chama. */
  listaRever: ReactNode;
  aoAvancar: () => void;
  /** A fila de falas: a próxima entra (ou a importante de agora deixa de esperar). */
  aoContinuarFala: () => void;
  aoSeguir: () => void;
  aoAjudar: () => void;
  aoCancelarSolucao: () => void;
  aoConfirmarSolucao: () => void;
  aoResponderPrevisao: (opcao: number) => void;
  aoAbrirConclusao: () => void;
  aoAbrirCard: (id: IdFerramenta) => void;
};

/** Os botões dentro do balão, conforme o momento da fase. */
export function AcoesConversa({
  estado,
  totalIntroducao,
  ultimaPausa,
  rotuloFim = "Ver resultado",
  previsao,
  degrauMaximo,
  desafio,
  projeto,
  contrato = false,
  aoAlternarRever,
  rotuloPausa,
  listaRever,
  aoAvancar,
  aoContinuarFala,
  aoSeguir,
  aoAjudar,
  aoCancelarSolucao,
  aoConfirmarSolucao,
  aoResponderPrevisao,
  aoAbrirConclusao,
  aoAbrirCard,
}: Props) {
  const emObjetivo = estado.etapa === "objetivos" && estado.pausa === null;

  if (estado.etapa === "meta") {
    return (
      <Botao onClick={aoAvancar} className="ml-auto">
        Continuar
      </Botao>
    );
  }
  if (estado.etapa === "introducao") {
    const ultima = estado.indiceFala >= totalIntroducao - 1;
    return (
      <>
        <span className="text-xs text-texto-suave">
          {estado.indiceFala + 1} de {totalIntroducao}
        </span>
        <Botao onClick={aoAvancar} className="ml-auto">
          {ultima ? "Vamos lá!" : "Continuar"}
        </Botao>
      </>
    );
  }
  // A fala importante espera o jogador; com fila, o botão da pausa só vem depois dela.
  if (ofereceContinuar(estado)) {
    const faltam = estado.filaFalas.length;
    return (
      <>
        {faltam > 0 && (
          <span className="text-xs font-bold text-texto-suave" data-falas-na-fila={faltam}>
            {faltam === 1 ? "mais 1 recado" : `mais ${faltam} recados`}
          </span>
        )}
        <Botao onClick={aoContinuarFala} className="ml-auto" data-continuar-fala aria-keyshortcuts="Enter">
          Continuar
          <IconeChevron tamanho={12} className="animate-pulse motion-reduce:animate-none" />
        </Botao>
      </>
    );
  }
  if (estado.pausa !== null) {
    return (
      <Botao onClick={aoSeguir} className="ml-auto">
        {rotuloPausa ?? (ultimaPausa ? rotuloFim : "Próximo objetivo")}
      </Botao>
    );
  }
  if (emObjetivo && estado.roteiro !== null) return null;
  if (emObjetivo && previsao && estado.previsao === null) {
    return <CartaoPrevisao previsao={previsao} resposta={null} aoResponder={aoResponderPrevisao} />;
  }
  if (emObjetivo && estado.confirmandoSolucao) {
    return (
      <>
        <Botao variante="secundario" onClick={aoCancelarSolucao}>
          Não, vou tentar
        </Botao>
        <Botao onClick={aoConfirmarSolucao}>Sim, mostrar a solução</Botao>
      </>
    );
  }
  if (emObjetivo && contrato) {
    return (
      <>
        <AlvoFerramenta ids={["me-ajuda"]} marcador="me-ajuda" aoAbrirCard={aoAbrirCard} classeMarcador="-right-2 -top-2" as="span" className="inline-flex">
          <Botao variante="secundario" onClick={aoAjudar} data-pergunta-contrato>
            Me faz uma pergunta
          </Botao>
        </AlvoFerramenta>
        {aoAlternarRever && <BotaoRever aberto={estado.listaRever} aoAlternar={aoAlternarRever} />}
        {estado.listaRever && listaRever}
      </>
    );
  }
  if (emObjetivo && projeto) {
    return (
      <AlvoFerramenta
        ids={["me-ajuda"]}
        marcador="me-ajuda"
        aoAbrirCard={aoAbrirCard}
        classeMarcador="-right-2 -top-2"
        as="span"
        className="inline-flex"
      >
        <Botao variante="secundario" onClick={aoAjudar} data-pergunta-projeto>
          Me faz uma pergunta
        </Botao>
      </AlvoFerramenta>
    );
  }
  if (emObjetivo && desafio) {
    return (
      <>
        <AlvoFerramenta
          ids={["me-ajuda"]}
          marcador="me-ajuda"
          aoAbrirCard={aoAbrirCard}
          classeMarcador="-right-2 -top-2"
          as="span"
          className="inline-flex"
        >
          <BotaoRever aberto={estado.listaRever} aoAlternar={aoAjudar} />
        </AlvoFerramenta>
        {estado.listaRever && listaRever}
      </>
    );
  }
  if (emObjetivo) {
    return (
      <>
        {previsao && estado.previsao !== null && (
          <CartaoPrevisao previsao={previsao} resposta={estado.previsao} aoResponder={aoResponderPrevisao} />
        )}
        <AlvoFerramenta
          ids={["me-ajuda"]}
          marcador="me-ajuda"
          aoAbrirCard={aoAbrirCard}
          classeMarcador="-right-2 -top-2"
          as="span"
          className="inline-flex"
        >
          <BotaoAjuda degrau={estado.degrau} degrauMaximo={degrauMaximo} desativado={false} aoAjudar={aoAjudar} />
        </AlvoFerramenta>
      </>
    );
  }
  return (
    <Botao variante="secundario" onClick={aoAbrirConclusao} className="ml-auto">
      Ver conclusão
    </Botao>
  );
}
