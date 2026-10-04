"use client";

/*
 * O quadro de "ordenar passos": a pilha de cartões (no painel) e o plano
 * (na tela). Mouse e toque pelo mesmo caminho: arrastar o cartão pela alça
 * até o lugar do plano (uma linha mostra onde ele cai), ou tocar no
 * cartão e depois em "Pôr aqui". No plano, as setas sobem e descem e o x
 * devolve o cartão para a pilha. Com `rodar`, o botão Rodar executa o
 * plano como código e o resultado aparece embaixo.
 */
import type { PointerEvent as EventoPonteiro, ReactNode } from "react";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { IconeExecutar } from "@/componentes/icones/IconeExecutar";
import { IconeFechar } from "@/componentes/icones/IconeFechar";
import { LinhaDoConsole } from "@/componentes/painel/console/LinhaDoConsole";
import type { QuadroOrdenar } from "@/componentes/jogo/useOrdenar";
import type { LinhaConsole } from "@/componentes/jogo/usePrograma";
import { cartoesFora, type CartaoPasso, LISTA_DO_PLANO } from "@/motor/ordenar/modelo";

function IconeAlca() {
  return (
    <svg viewBox="0 0 12 20" width={10} height={18} aria-hidden="true" fill="currentColor">
      {[4, 10, 16].flatMap((y) => [<circle key={`a${y}`} cx="3.5" cy={y} r="1.5" />, <circle key={`b${y}`} cx="8.5" cy={y} r="1.5" />])}
    </svg>
  );
}

type PropsCartao = {
  quadro: QuadroOrdenar;
  cartao: CartaoPasso;
  /** No plano: a posição (para o número e as setas). */
  noPlano?: { posicao: number; total: number };
  codigo: boolean;
  /** (Fase composta) O passo já está no código como comentário: o selo "//" aparece. */
  noCodigo?: boolean;
};

const botaoPequeno =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-texto-suave hover:bg-hover hover:text-texto disabled:opacity-30 pointer-coarse:h-11 pointer-coarse:w-10";

function Cartao({ quadro, cartao, noPlano, codigo, noCodigo = false }: PropsCartao) {
  const escolhido = quadro.selecionado === cartao.id;
  const arrastando = quadro.arrasto?.passo === cartao.id;
  const destacado = quadro.destaque === cartao.id;
  const eventos = {
    onPointerDown: (evento: EventoPonteiro<HTMLElement>) => quadro.comecarArrasto(cartao.id, evento),
    onPointerMove: quadro.moverArrasto,
    onPointerUp: quadro.soltarArrasto,
    onPointerCancel: quadro.cancelarArrasto,
  };
  const corpo = (fantasma: boolean) => (
    <div
      className={`flex items-stretch gap-1 rounded-xl border-2 bg-superficie shadow-[0_3px_0_var(--cor-sombra)] ${
        escolhido ? "border-primaria ring-2 ring-primaria" : noPlano ? "border-secundaria" : "border-borda"
      } ${destacado ? "animate-pulse shadow-[0_0_0_4px_var(--cor-destaque)]" : ""} ${fantasma ? "" : arrastando ? "opacity-40" : ""}`}
    >
      <button
        type="button"
        aria-label={`Arrastar: ${cartao.texto}`}
        className="flex w-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-l-[10px] bg-painel text-texto-suave active:cursor-grabbing pointer-coarse:w-9"
        data-alca-passo={cartao.id}
        {...(fantasma ? {} : eventos)}
      >
        <IconeAlca />
      </button>
      <button
        type="button"
        onClick={() => quadro.escolher(cartao.id)}
        aria-pressed={escolhido}
        className={`min-h-10 min-w-0 flex-1 py-1.5 pr-1 text-left text-sm font-bold text-texto pointer-coarse:min-h-11 ${codigo ? "font-mono text-[13px]" : ""}`}
        data-escolher-passo={cartao.id}
      >
        {noPlano && <span className="mr-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secundaria px-1 font-sans text-[11px] text-sobre-secundaria">{noPlano.posicao + 1}</span>}
        <span className="break-words">{cartao.texto}</span>
        {noCodigo && (
          <span className="ml-1.5 inline-flex items-center rounded-md border border-borda bg-codigo-fundo px-1 align-middle font-mono text-[11px] font-black text-texto-suave" title="Este passo está no código como comentário" data-no-codigo>
            <span aria-hidden="true">{"//"}</span>
            <span className="sr-only">(está no código)</span>
          </span>
        )}
      </button>
      {noPlano && !fantasma && (
        <span className="flex shrink-0 items-center">
          <button type="button" className={botaoPequeno} onClick={() => quadro.moverPasso(cartao.id, -1)} disabled={noPlano.posicao === 0} aria-label={`Subir: ${cartao.texto}`} data-subir-passo={cartao.id}>
            <IconeChevron direcao="cima" />
          </button>
          <button type="button" className={botaoPequeno} onClick={() => quadro.moverPasso(cartao.id, 1)} disabled={noPlano.posicao === noPlano.total - 1} aria-label={`Descer: ${cartao.texto}`} data-descer-passo={cartao.id}>
            <IconeChevron direcao="baixo" />
          </button>
          <button type="button" className={botaoPequeno} onClick={() => quadro.tirarPasso(cartao.id)} aria-label={`Tirar do plano: ${cartao.texto}`} data-tirar-passo={cartao.id}>
            <IconeFechar tamanho={12} />
          </button>
        </span>
      )}
    </div>
  );
  return (
    <div data-cartao-passo={cartao.id} data-item-ordenar={noPlano ? cartao.id : undefined} data-sobra={cartao.sobra ? "sim" : undefined}>
      {corpo(false)}
      {arrastando && quadro.arrasto && (
        <div className="pointer-events-none fixed z-50 w-72 max-w-[80vw] rotate-1" style={{ left: quadro.arrasto.x - quadro.arrasto.dx, top: quadro.arrasto.y - quadro.arrasto.dy }} aria-hidden="true">
          {corpo(true)}
        </div>
      )}
    </div>
  );
}

const Indicador = () => <li className="h-1 rounded-full bg-primaria" aria-hidden="true" data-indicador-soltar />;

function PorAqui({ aoPor, rotulo, dados }: { aoPor: () => void; rotulo: string; dados: string }) {
  return (
    <li>
      <button
        type="button"
        onClick={aoPor}
        className="flex min-h-8 w-full items-center justify-center rounded-lg border-2 border-dashed border-primaria text-xs font-black text-primaria hover:bg-hover pointer-coarse:min-h-11"
        data-por-aqui={dados}
      >
        {rotulo}
      </button>
    </li>
  );
}

/** Uma lista do plano (o plano inteiro, ou um passo grande no agrupar). */
function ListaDoPlano({ quadro, destino, codigo, vazio, noCodigo }: { quadro: QuadroOrdenar; destino: string; codigo: boolean; vazio: string; noCodigo?: ReadonlySet<string> }) {
  const dados = quadro.dados;
  const ids = quadro.estado?.listas[destino] ?? [];
  const alvo = quadro.arrasto?.alvo;
  const caiAqui = alvo?.tipo === "lista" && alvo.destino === destino ? alvo.posicao : null;
  const escolhido = quadro.selecionado;
  const visiveis = ids.filter((id) => id !== quadro.arrasto?.passo);
  if (!dados) return null;
  const itens: ReactNode[] = [];
  ids.forEach((id, i) => {
    const cartao = dados.cartoes.find((c) => c.id === id);
    if (!cartao) return;
    const indiceVisivel = visiveis.indexOf(id);
    if (caiAqui !== null && indiceVisivel === caiAqui) itens.push(<Indicador key={`ind-${id}`} />);
    if (escolhido && escolhido !== id) itens.push(<PorAqui key={`aqui-${id}`} aoPor={() => quadro.porPasso(escolhido, i, destino)} rotulo="Pôr aqui" dados={`${destino}:${i}`} />);
    itens.push(
      <li key={id}>
        <Cartao quadro={quadro} cartao={cartao} noPlano={{ posicao: i, total: ids.length }} codigo={codigo} noCodigo={noCodigo?.has(id)} />
      </li>,
    );
  });
  if (caiAqui !== null && caiAqui >= visiveis.length) itens.push(<Indicador key="ind-fim" />);
  return (
    <ol className="flex min-h-14 flex-col gap-1.5" data-lista-ordenar={destino}>
      {itens}
      {escolhido ? (
        <PorAqui aoPor={() => quadro.porPasso(escolhido, ids.length, destino)} rotulo={ids.length ? "Pôr no fim" : "Pôr aqui"} dados={`${destino}:fim`} />
      ) : ids.length === 0 ? (
        <li className="flex min-h-12 items-center justify-center rounded-lg border-2 border-dashed border-borda px-2 text-center text-xs text-texto-suave">{vazio}</li>
      ) : null}
    </ol>
  );
}

/** A tela: o problema, o plano (ou os passos grandes) e, com `rodar`, o resultado. */
export function PlanoDePassos({
  quadro,
  linhas,
  ocupado,
  toque,
  acoes,
  noCodigo,
}: {
  quadro: QuadroOrdenar;
  linhas: readonly LinhaConsole[];
  ocupado: boolean;
  toque: boolean;
  /** (Fase composta) Botões no cabeçalho do plano, como o "Levar o plano pro código". */
  acoes?: ReactNode;
  /** (Fase composta) Os passos que já estão no código como comentário. */
  noCodigo?: ReadonlySet<string>;
}) {
  const dados = quadro.dados;
  if (!dados) return null;
  const codigo = dados.rodar === true;
  // O resultado da última vez que o plano rodou (as linhas depois do último "Rodou o plano").
  const inicio = linhas.map((l) => l.tipo === "info" && l.texto === "Rodou o plano").lastIndexOf(true);
  const resultado = inicio >= 0 ? linhas.slice(inicio + 1) : [];
  return (
    <div className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-borda bg-painel shadow-[0_8px_0_var(--cor-sombra)] ${quadro.destaque === "plano" ? "ring-4 ring-destaque" : ""}`} data-plano-ordenar>
      <div className={`flex shrink-0 items-center gap-2 border-b-2 border-borda bg-superficie px-3 py-2 ${acoes ? "flex-wrap" : ""}`}>
        <div className={`min-w-0 flex-1 ${acoes ? "basis-40" : ""}`}>
          <p className="text-[11px] font-black uppercase tracking-wide text-texto-suave">{dados.modo === "agrupar" ? "Os passos grandes" : "O plano"}</p>
          <p className={`text-sm font-black text-primaria ${acoes ? "" : "truncate"}`}>{dados.problema}</p>
        </div>
        {acoes}
        {codigo && (
          <button
            type="button"
            onClick={quadro.rodarPlano}
            disabled={ocupado}
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border-2 border-primaria bg-primaria px-3 text-xs font-black text-sobre-primaria hover:brightness-110 disabled:opacity-60 pointer-coarse:h-11"
            data-rodar-plano
          >
            <IconeExecutar tamanho={12} />
            Rodar
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
        {dados.modo === "agrupar" ? (
          <div className="flex flex-col gap-2.5">
            {(dados.grupos ?? []).map((grupo, i) => (
              <section key={grupo.id} className="rounded-xl border-2 border-borda bg-superficie p-2" data-grupo-ordenar={grupo.id}>
                <h3 className="mb-1.5 flex items-center gap-1.5 text-sm font-black text-texto">
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primaria px-1 text-xs text-sobre-primaria">{i + 1}</span>
                  {grupo.titulo}
                </h3>
                <ListaDoPlano quadro={quadro} destino={grupo.id} codigo={codigo} noCodigo={noCodigo} vazio={toque ? "Arraste ou toque num cartão e depois aqui." : "Arraste os subpassos para cá."} />
              </section>
            ))}
          </div>
        ) : (
          <ListaDoPlano quadro={quadro} destino={LISTA_DO_PLANO} codigo={codigo} noCodigo={noCodigo} vazio={toque ? "Arraste um cartão para cá, ou toque nele e depois aqui." : "Arraste os cartões para cá, na ordem."} />
        )}
      </div>
      {codigo && (
        <div className="max-h-[38%] shrink-0 overflow-y-auto border-t-2 border-borda bg-codigo-fundo font-mono text-[13px]" aria-live="polite" data-resultado-plano>
          <p className="sticky top-0 bg-painel px-2 py-0.5 font-sans text-[11px] font-black uppercase tracking-wide text-texto-suave">Resultado</p>
          {resultado.length ? resultado.map((linha) => <LinhaDoConsole key={linha.id} linha={linha} />) : <p className="px-2 py-1 font-sans text-xs text-texto-suave">Rode o plano para ver o que ele faz.</p>}
        </div>
      )}
    </div>
  );
}

/** O painel: os cartões fora do plano (a pilha). Soltar um cartão do plano aqui tira ele. */
export function PilhaDeCartoes({ quadro, toque }: { quadro: QuadroOrdenar; toque: boolean }) {
  const dados = quadro.dados;
  if (!dados || !quadro.estado) return null;
  const fora = cartoesFora(dados, quadro.estado);
  const soltandoAqui = quadro.arrasto?.alvo?.tipo === "fora";
  const codigo = dados.rodar === true;
  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-2 bg-superficie shadow-[0_8px_0_var(--cor-sombra)] ${soltandoAqui ? "border-primaria" : "border-borda"}`}
      data-pilha-ordenar
    >
      <div className="shrink-0 border-b-2 border-borda bg-painel px-3 py-2">
        <p className="text-sm font-black text-texto">Cartões</p>
        <p className="text-xs text-texto-suave">
          {dados.modo === "agrupar"
            ? `Separe cada subpasso no passo grande dele. ${toque ? "Toque num cartão e depois no lugar, ou arraste pela alça." : "Arraste pela alça, ou clique no cartão e depois no lugar."}`
            : `Ponha na ordem em que tudo acontece. ${toque ? "Toque num cartão e depois no lugar, ou arraste pela alça." : "Arraste pela alça, ou clique no cartão e depois no lugar."}`}{" "}
          Nem todo cartão precisa entrar.
        </p>
      </div>
      <ul className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-2.5">
        {fora.length === 0 ? (
          <li className="m-auto text-center text-xs text-texto-suave">Todos os cartões estão no plano. Arraste um para cá (ou use o x) para tirar.</li>
        ) : (
          fora.map((cartao) => (
            <li key={cartao.id}>
              <Cartao quadro={quadro} cartao={cartao} codigo={codigo} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
