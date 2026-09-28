"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMusicaDaTela } from "@/audio/ganchos";
import { tocarEfeito } from "@/audio/motor";
import { IconeCadeado } from "@/componentes/icones/IconeCadeado";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { BarraMapa } from "@/componentes/mapa/BarraMapa";
import { Mascote } from "@/componentes/mascote/Mascote";
import { MiniPrevia } from "@/componentes/preview/MiniPrevia";
import { Botao } from "@/componentes/ui/Botao";
import { FASES, localDaFase } from "@/conteudo";
import type { FaseProjetoPonte } from "@/conteudo/tipos";
import { useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import { documentoInteiroInicial } from "@/lib/documentoSiteAlvo";
import { baixarZip, ligaOCss, montarArquivos } from "@/lib/exportarProjeto";
import { faseLiberada } from "@/lib/liberacao";
import { PROJETO_VAZIO } from "@/lib/progresso";
import { marcarPassoDoGuia, salvarLinkPublicado } from "@/lib/projetos";
import { ROTA_MUNDO, rotaDaFase } from "@/lib/rotas";
import { DialogoLevarProMundo } from "./DialogoLevarProMundo";
import { GuiaPublicacao } from "./GuiaPublicacao";

function BotaoVoltar() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => (window.history.length > 1 ? router.back() : router.push(ROTA_MUNDO))}
      className="flex h-11 shrink-0 items-center gap-1 rounded-full border-2 border-borda bg-superficie pl-2 pr-3 text-sm font-black text-texto hover:border-primaria hover:text-primaria"
    >
      <IconeChevron direcao="esquerda" tamanho={14} />
      Voltar
    </button>
  );
}

const PROJETOS: readonly FaseProjetoPonte[] = FASES.filter((fase): fase is FaseProjetoPonte => fase.tipo === "projeto-ponte");

/**
 * Meus projetos (/projetos): os sites que o jogador fez nos projetos-ponte,
 * a semente do portfólio. Cada cartão mostra o site em miniatura, abre a
 * fase para editar, baixa o .zip e guarda o guia e o link publicado.
 */
export function TelaProjetos() {
  const carregado = useProgressoCarregado();
  useMusicaDaTela({ tipo: "mundo" });
  if (!carregado) return <TelaCarregando />;
  return (
    <div className="flex h-dvh flex-col bg-fundo" data-tela="projetos">
      <BarraMapa caminho={["Meus projetos"]} voltar={<BotaoVoltar />} />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-start gap-3 pt-4">
            <Mascote expressao="feliz" tamanho={64} className="shrink-0" />
            <div className="min-w-0">
              <h1 className="text-2xl font-black text-texto">Meus projetos</h1>
              <p className="text-sm font-bold text-texto-suave">
                Os sites que você fez do zero. Dá pra abrir de novo, mexer, baixar os arquivos e publicar na internet.
              </p>
            </div>
          </div>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {PROJETOS.map((fase) => (
              <CartaoProjeto key={fase.id} fase={fase} />
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

function CartaoProjeto({ fase }: { fase: FaseProjetoPonte }) {
  const progresso = useProgresso();
  const [janela, setJanela] = useState<"levar" | "guia" | null>(null);
  const projeto = progresso.projetos[fase.id] ?? PROJETO_VAZIO;
  const liberada = faseLiberada(fase, progresso);
  const pronto = progresso.fasesConcluidas.includes(fase.id);
  const comecado = projeto.html !== null;
  const { unidade } = localDaFase(fase);
  const html = projeto.html ?? documentoInteiroInicial(fase.siteAlvo.head, fase.siteAlvo.body);
  const css = projeto.html !== null ? projeto.css : (fase.siteAlvo.css ?? null);
  const situacao = pronto ? "Pronto" : comecado ? "Em andamento" : liberada ? "Ainda não começou" : "Trancado";

  return (
    <li
      className="flex min-w-0 flex-col rounded-2xl border-2 border-borda bg-superficie p-3"
      data-cartao-projeto={fase.id}
      data-situacao={pronto ? "pronto" : comecado ? "andamento" : liberada ? "novo" : "trancado"}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-black text-texto">{fase.nomeDoProjeto}</h2>
          <p className="text-xs font-bold text-texto-suave">
            {unidade.ilha} · {unidade.zona} · {unidade.titulo}
          </p>
        </div>
        <span className={`shrink-0 rounded-full bg-painel px-2 py-0.5 text-xs font-black ${pronto ? "text-sucesso" : "text-texto-suave"}`}>
          {situacao}
        </span>
      </div>
      {liberada ? (
        <>
          <div className="mt-2">
            <MiniPrevia head="" body={html} css={css} documentoInteiro legenda={comecado ? "Como você deixou" : "O ponto de partida"} rotulo={`Miniatura de ${fase.nomeDoProjeto}`} />
          </div>
          {projeto.link && (
            <p className="mt-2 truncate text-sm font-bold">
              No ar em{" "}
              <a href={projeto.link} target="_blank" rel="noopener noreferrer" className="font-codigo text-primaria underline" data-link-do-projeto>
                {projeto.link}
              </a>
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={rotaDaFase(fase.id)}
              onClick={() => tocarEfeito("clique")}
              data-abrir-projeto
              className="inline-flex min-h-11 items-center rounded-full border-2 border-primaria bg-primaria px-4 text-sm font-black text-sobre-primaria hover:brightness-110"
            >
              {comecado ? "Abrir e editar" : "Começar"}
            </Link>
            {comecado && (
              <Botao
                variante="secundario"
                data-levar-pro-mundo
                onClick={() => {
                  tocarEfeito("clique");
                  setJanela("levar");
                }}
              >
                Levar pro mundo
              </Botao>
            )}
            <Botao variante="fantasma" data-abrir-guia onClick={() => setJanela("guia")}>
              Guia de publicação
            </Botao>
          </div>
          <DialogoLevarProMundo
            aberto={janela === "levar"}
            arquivos={janela === "levar" ? montarArquivos(html, css) : null}
            nome={fase.nomeDoProjeto}
            linhaAcrescentada={!ligaOCss(html)}
            aoBaixar={() => {
              baixarZip(montarArquivos(html, css), fase.nomeDoProjeto);
              tocarEfeito("desbloqueio");
            }}
            aoVerGuia={() => setJanela("guia")}
            aoFechar={() => setJanela(null)}
          />
          <GuiaPublicacao
            aberto={janela === "guia"}
            marcados={projeto.guia}
            link={projeto.link}
            aoMarcar={(passo, marcado) => marcarPassoDoGuia(fase.id, passo, marcado)}
            aoSalvarLink={(link) => {
              salvarLinkPublicado(fase.id, link);
              tocarEfeito("acerto");
            }}
            aoFechar={() => setJanela(null)}
          />
        </>
      ) : (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-painel px-3 py-2 text-sm font-bold text-texto-suave">
          <IconeCadeado tamanho={14} />
          Abre no fim da zona {unidade.zona}, na {unidade.ilha}: é o site que você faz do zero.
        </p>
      )}
    </li>
  );
}
