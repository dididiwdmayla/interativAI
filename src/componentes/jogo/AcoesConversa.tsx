"use client";

import type { ReactNode } from "react";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { BotaoAjuda } from "@/componentes/mascote/BotaoAjuda";
import { BotaoRever } from "@/componentes/mascote/BotaoRever";
import { CartaoPrevisao } from "@/componentes/mascote/CartaoPrevisao";
import { Botao } from "@/componentes/ui/Botao";
import type { Previsao } from "@/conteudo/tipos";
import type { IdFerramenta } from "@/ferramentas/ids";
import type { EstadoMotor } from "@/motor/estadoMotor";
import type { DegrauAjuda } from "@/motor/tipos";

type Props = {
  estado: EstadoMotor;
  totalIntroducao: number;
  /** A pausa atual leva para a conclusão ("Ver resultado"). */
  ultimaPausa: boolean;
  /** Objetivo de previsão: a pergunta e as opções. */
  previsao: Previsao | null;
  degrauMaximo: DegrauAjuda;
  desafio: boolean;
  /** Lista do "Rever", montada por quem chama. */
  listaRever: ReactNode;
  aoAvancar: () => void;
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
  previsao,
  degrauMaximo,
  desafio,
  listaRever,
  aoAvancar,
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
  if (estado.pausa !== null) {
    return (
      <Botao onClick={aoSeguir} className="ml-auto">
        {ultimaPausa ? "Ver resultado" : "Próximo objetivo"}
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
