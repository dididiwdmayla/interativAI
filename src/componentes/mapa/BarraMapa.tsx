"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";
import { BotaoFerramentas } from "@/componentes/ferramentas/BotaoFerramentas";
import { CaixaFerramentas } from "@/componentes/ferramentas/CaixaFerramentas";
import { IconeEstrela } from "@/componentes/icones/IconeEstrela";
import { useLayoutJogo } from "@/componentes/jogo/movel/useLayoutJogo";
import { BotaoSom } from "@/componentes/layout/BotaoSom";
import { MenuMovel } from "@/componentes/layout/MenuMovel";
import { OndeEstou } from "@/componentes/layout/OndeEstou";
import { SeletorTema } from "@/componentes/layout/SeletorTema";
import { Mascote } from "@/componentes/mascote/Mascote";
import { useProgresso } from "@/lib/armazemProgresso";
import { totalDeEstrelas } from "@/lib/mapa";
import { ROTA_MUNDO } from "@/lib/rotas";
import { useToque } from "@/lib/useConsultaMidia";

type Props = {
  /** Onde o jogador está no mapa (ex.: ["Mundo", "Ilha Sites"]). */
  caminho: readonly string[];
  /** Botão fixo à esquerda (ex.: voltar ao mundo). */
  voltar?: ReactNode;
};

/** Total de estrelas do jogo, com a estrela desenhada. */
function TotalEstrelas({ compacto }: { compacto: boolean }) {
  const progresso = useProgresso();
  const total = totalDeEstrelas(progresso);
  return (
    <span
      role="img"
      aria-label={`${total} estrelas no total`}
      data-total-estrelas={total}
      className="flex items-center gap-1 rounded-full border-2 border-borda bg-superficie px-2.5 py-0.5 text-sm font-black text-texto"
    >
      <IconeEstrela cheia tamanho={compacto ? 18 : 20} />
      {total}
    </span>
  );
}

/**
 * Barra de cima do mundo e das ilhas: onde estou, total de estrelas,
 * Ferramentas (a Caixa, só para ler os cards), tema e som. No celular,
 * Ferramentas, tema e som moram no menu.
 */
export function BarraMapa({ caminho, voltar }: Props) {
  const layout = useLayoutJogo();
  const toque = useToque();
  const progresso = useProgresso();
  const [caixaAberta, setCaixaAberta] = useState(false);
  const compacto = layout !== "desktop";

  return (
    <>
      <header
        className={`relative z-40 flex shrink-0 items-center gap-2 border-b-2 border-borda bg-superficie px-2 sm:gap-3 sm:px-4 ${
          layout === "paisagem" ? "h-11" : "h-14"
        }`}
      >
        {voltar}
        {/* No celular, com o botão de voltar, o logo sai para caber o nome do lugar. */}
        {!(compacto && voltar) && (
          <Link href={ROTA_MUNDO} aria-label="InterativAI: voltar ao mundo" className="flex shrink-0 items-center gap-2 rounded-full">
            <Mascote tamanho={compacto ? 30 : 34} />
            <span className="hidden text-lg font-black tracking-tight text-primaria lg:inline">InterativAI</span>
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <OndeEstou partes={compacto ? caminho.slice(-1) : caminho} />
        </div>
        <TotalEstrelas compacto={compacto} />
        {compacto ? (
          <MenuMovel>
            <BotaoFerramentas aoAbrir={() => setCaixaAberta(true)} />
            <div className="flex items-center justify-between gap-2">
              <SeletorTema />
              <BotaoSom />
            </div>
          </MenuMovel>
        ) : (
          <>
            <BotaoFerramentas aoAbrir={() => setCaixaAberta(true)} />
            <SeletorTema />
            <BotaoSom />
          </>
        )}
      </header>
      <CaixaFerramentas
        aberta={caixaAberta}
        foco={null}
        vistas={progresso.apresentacoesVistas}
        toque={toque}
        aoFechar={() => setCaixaAberta(false)}
      />
    </>
  );
}
