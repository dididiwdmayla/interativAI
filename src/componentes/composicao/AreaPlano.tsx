"use client";

/*
 * A área "plano" de uma fase composta: o plano em cima e a pilha de cartões
 * embaixo, na mesma coluna (o mesmo quadro do ordenar-passos, com o mesmo
 * arrastar, tocar e "Pôr aqui"). O plano fica editável o tempo todo, mesmo
 * depois de o código começar.
 */
import type { ReactNode } from "react";
import type { QuadroOrdenar } from "@/componentes/jogo/useOrdenar";
import { PilhaDeCartoes, PlanoDePassos } from "@/componentes/ordenar/QuadroPassos";
import { PainelDividido } from "@/componentes/painel/PainelDividido";

type Props = {
  quadro: QuadroOrdenar;
  toque: boolean;
  /** Botões do cabeçalho do plano (o "Levar o plano pro código"). */
  acoes?: ReactNode;
  /** Os passos que já estão no código como comentário (o selo "//" no cartão). */
  noCodigo?: ReadonlySet<string>;
  /** Em cima do quadro: onde está, no código, o passo escolhido (embaixo, o computadorzinho do celular cobriria). */
  rodape?: ReactNode;
};

export function AreaPlano({ quadro, toque, acoes, noCodigo, rodape }: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col" data-area-plano>
      {rodape}
      <PainelDividido
        rotulo="Redimensionar o plano e os cartões"
        proporcaoInicial={0.6}
        cima={<PlanoDePassos quadro={quadro} linhas={[]} ocupado={false} toque={toque} acoes={acoes} noCodigo={noCodigo} />}
        baixo={<PilhaDeCartoes quadro={quadro} toque={toque} />}
      />
    </div>
  );
}
