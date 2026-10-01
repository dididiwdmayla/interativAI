"use client";

/*
 * A barra lateral do depurador na aba Fontes, como a do Chrome (Sources >
 * sidebar): os controles no alto (Retomar, Passar por cima, Entrar na
 * função, Sair da função), o aviso da pausa e os painéis Observar (Watch),
 * Pontos de parada (Breakpoints), Escopo (Scope) e Pilha de chamadas (Call
 * Stack). No celular os painéis viram abas e os controles descem para uma
 * barra embaixo (BarraControlesDepurador). Os valores batem com o palco:
 * os dois leem a mesma foto da memória.
 */
import { type FormEvent, type ReactNode, useState } from "react";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { IconeFechar } from "@/componentes/icones/IconeFechar";
import { ValorConsole } from "@/componentes/painel/console/ValorConsole";
import { SeletorSegmentado } from "@/componentes/ui/SeletorSegmentado";
import type { Depurador } from "@/componentes/jogo/useDepurador";
import type { IdFerramenta } from "@/ferramentas/ids";
import { type ControleDepurador, CONTROLES_DEPURADOR, DADOS_DO_CONTROLE, pilhaDeChamadas, secoesDoEscopo } from "@/motor/depurador";
import { memoriaParaExibido } from "@/motor/programa";

/* ------------------------------------------------------------------ */
/* Ícones dos controles (SVG, nas formas dos botões do Chrome)         */
/* ------------------------------------------------------------------ */

function IconeControle({ controle }: { controle: ControleDepurador }) {
  const comum = { viewBox: "0 0 20 20", width: 18, height: 18, "aria-hidden": true, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (controle) {
    case "retomar":
      return (
        <svg {...comum}>
          <path d="M4.5 4v12" />
          <path d="M8 4.5l8 5.5-8 5.5z" fill="currentColor" />
        </svg>
      );
    case "passar-por-cima":
      return (
        <svg {...comum}>
          <path d="M3.5 11a6.5 6.5 0 0 1 13 0" />
          <path d="M13.5 9l3 2 1.6-3.1" />
          <circle cx="10" cy="15.5" r="1.8" fill="currentColor" />
        </svg>
      );
    case "entrar":
      return (
        <svg {...comum}>
          <path d="M10 2.5v9" />
          <path d="M6.5 8.5l3.5 3.5 3.5-3.5" />
          <circle cx="10" cy="16" r="1.8" fill="currentColor" />
        </svg>
      );
    case "sair":
      return (
        <svg {...comum}>
          <path d="M10 12V3" />
          <path d="M6.5 6l3.5-3.5L13.5 6" />
          <circle cx="10" cy="16" r="1.8" fill="currentColor" />
        </svg>
      );
  }
}

const ROTULO_CURTO: Record<ControleDepurador, string> = {
  retomar: "Retomar",
  "passar-por-cima": "Por cima",
  entrar: "Entrar",
  sair: "Sair",
};

type PropsBarra = {
  pausado: boolean;
  aoControlar: (controle: ControleDepurador) => void;
  /** Celular: botões grandes com o nome embaixo. */
  grande?: boolean;
  aoAbrirCard: (id: IdFerramenta) => void;
};

/** Os quatro controles. No alto da barra lateral (computador) ou na barra de baixo (celular). */
export function BarraControlesDepurador({ pausado, aoControlar, grande = false, aoAbrirCard }: PropsBarra) {
  const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <AlvoFerramenta
      ids={["controles-depurador"]}
      marcador="controles-depurador"
      aoAbrirCard={aoAbrirCard}
      classeMarcador="-right-1 -top-1.5"
      // No celular, os cantos ficam livres (o computadorzinho flutuante mora no da direita).
      className={`flex shrink-0 items-center gap-1 ${grande ? "justify-around border-t-2 border-borda bg-painel px-14 py-1" : ""}`}
      rotulo="Controles do depurador"
    >
      {CONTROLES_DEPURADOR.map((controle) => {
        const dados = DADOS_DO_CONTROLE[controle];
        return (
          <button
            key={controle}
            type="button"
            disabled={!pausado}
            onClick={() => aoControlar(controle)}
            title={`${dados.nome} (${mac ? dados.atalhoMac : dados.atalho})`}
            aria-label={dados.nome}
            data-controle-depurador={controle}
            className={
              grande
                ? "flex min-h-11 min-w-16 flex-col items-center justify-center rounded-xl px-1 text-[11px] font-bold text-texto enabled:hover:bg-hover disabled:opacity-40"
                : "inline-flex h-8 w-8 items-center justify-center rounded-md text-texto enabled:hover:bg-hover enabled:hover:text-primaria disabled:opacity-40"
            }
          >
            <IconeControle controle={controle} />
            {grande && <span>{ROTULO_CURTO[controle]}</span>}
          </button>
        );
      })}
    </AlvoFerramenta>
  );
}

/* ------------------------------------------------------------------ */
/* O aviso da pausa                                                    */
/* ------------------------------------------------------------------ */

function textoDaPausa(depurador: Depurador, nomeSnippet: string): string {
  const sessao = depurador.sessao;
  if (!sessao) return "Sem pausa. Ponha um ponto de parada e clique em Executar.";
  const onde = `${nomeSnippet}:${sessao.pausa.linha}`;
  if (sessao.pausa.motivo === "ponto-de-parada") return `Pausado no ponto de parada (${onde})`;
  if (sessao.pausa.motivo === "debugger") return `Pausado na instrução debugger (${onde})`;
  return `Pausado (${onde})`;
}

/**
 * Por cima do palco, como o "Paused in debugger" que o Chrome põe na página:
 * o aviso com Retomar e Passar por cima.
 */
export function AvisoPausado({ depurador }: { depurador: Depurador }) {
  if (!depurador.sessao) return null;
  const botao = "inline-flex h-8 w-8 items-center justify-center rounded-full text-sobre-destaque hover:bg-superficie/40 pointer-coarse:h-11 pointer-coarse:w-11";
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center px-2">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border-2 border-borda bg-destaque py-0.5 pl-3 pr-1 text-sm font-black text-sobre-destaque shadow-[0_4px_0_var(--cor-sombra)]" data-aviso-pausado role="status">
        <span>Pausado no depurador</span>
        <button type="button" className={botao} onClick={() => depurador.controlar("retomar")} aria-label="Retomar" title="Retomar (F8)" data-aviso-retomar>
          <IconeControle controle="retomar" />
        </button>
        <button type="button" className={botao} onClick={() => depurador.controlar("passar-por-cima")} aria-label="Passar por cima" title="Passar por cima (F10)">
          <IconeControle controle="passar-por-cima" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Os painéis                                                          */
/* ------------------------------------------------------------------ */

function Secao({ titulo, children, dados }: { titulo: string; children: ReactNode; dados?: string }) {
  return (
    <section className="flex flex-col border-b-2 border-borda" data-secao-depurador={dados}>
      <h3 className="bg-painel px-2 py-1 text-xs font-black uppercase tracking-wide text-texto-suave">{titulo}</h3>
      <div className="px-2 py-1.5">{children}</div>
    </section>
  );
}

function Vazio({ children }: { children: ReactNode }) {
  return <p className="text-xs text-texto-suave">{children}</p>;
}

function PainelObservar({ depurador, toque }: { depurador: Depurador; toque: boolean }) {
  const [texto, setTexto] = useState("");
  const adicionar = (evento: FormEvent) => {
    evento.preventDefault();
    if (!texto.trim()) return;
    depurador.observar(texto);
    setTexto("");
  };
  return (
    <div className="flex flex-col gap-1.5" data-painel-observar>
      {depurador.observacoes.length === 0 && <Vazio>Nenhuma expressão. Escreva uma variável ou conta, como total * 2.</Vazio>}
      <ul className="flex flex-col gap-0.5 font-mono text-[13px]">
        {depurador.observacoes.map((expressao) => {
          const r = depurador.avaliacoes[expressao];
          return (
            <li key={expressao} className="flex items-start gap-1" data-observacao={expressao}>
              <span className="min-w-0 flex-1 break-words">
                <span className="font-bold text-codigo-atributo">{expressao}</span>
                <span className="text-texto-suave">: </span>
                {!depurador.sessao ? (
                  <span className="text-texto-suave" data-valor-observado="">
                    (pause para ver)
                  </span>
                ) : !r ? (
                  <span className="text-texto-suave">…</span>
                ) : "valor" in r ? (
                  <span data-valor-observado="valor">
                    <ValorConsole valor={r.valor} contexto="propriedade" />
                  </span>
                ) : (
                  <span className="italic text-texto-suave" title={r.erro} data-valor-observado="indisponivel">
                    {r.erro.startsWith("ReferenceError") ? "<não disponível>" : r.erro}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => depurador.removerObservacao(expressao)}
                aria-label={`Tirar ${expressao} do Observar`}
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-texto-suave hover:bg-hover hover:text-texto pointer-coarse:h-11 pointer-coarse:w-11"
              >
                <IconeFechar tamanho={12} />
              </button>
            </li>
          );
        })}
      </ul>
      <form onSubmit={adicionar} className="flex gap-1">
        <input
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          placeholder="Expressão para observar"
          aria-label="Expressão para observar"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 rounded-md border-2 border-borda bg-superficie px-2 py-1 font-mono text-[13px] text-texto pointer-coarse:min-h-11"
          data-campo-observar
        />
        <button type="submit" className="rounded-md border-2 border-primaria bg-primaria px-2 text-xs font-black text-sobre-primaria pointer-coarse:min-h-11" data-adicionar-observacao>
          {toque ? "Adicionar" : "+"}
        </button>
      </form>
    </div>
  );
}

function ListaPontos({ depurador, nomeSnippet, codigo }: { depurador: Depurador; nomeSnippet: string; codigo: string }) {
  const linhas = codigo.split("\n");
  if (!depurador.pontos.length) return <Vazio>Nenhum ponto de parada. Clique no número de uma linha.</Vazio>;
  return (
    <ul className="flex flex-col gap-0.5" data-lista-pontos>
      {depurador.pontos.map((linha) => (
        <li key={linha} className="flex items-center gap-1 text-xs" data-ponto-listado={linha}>
          <span className="rounded bg-secundaria px-1.5 font-mono font-bold text-sobre-secundaria">{linha}</span>
          <span className="min-w-0 flex-1 truncate font-mono text-texto">{(linhas[linha - 1] ?? "").trim()}</span>
          <span className="shrink-0 text-texto-suave">{nomeSnippet}</span>
          <button
            type="button"
            onClick={() => depurador.alternarPontoDeParada(linha)}
            aria-label={`Tirar o ponto de parada da linha ${linha}`}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-texto-suave hover:bg-hover hover:text-texto pointer-coarse:h-11 pointer-coarse:w-11"
          >
            <IconeFechar tamanho={12} />
          </button>
        </li>
      ))}
    </ul>
  );
}

function PainelEscopo({ depurador }: { depurador: Depurador }) {
  const sessao = depurador.sessao;
  if (!sessao) return <Vazio>Sem pausa: o Escopo aparece quando o programa para.</Vazio>;
  const passo = sessao.resultado.passos[sessao.pausa.indice];
  const foto = passo.memoria;
  const secoes = secoesDoEscopo(foto, sessao.quadro, passo.tipo === "retorno" ? passo.retorno?.valor : undefined);
  return (
    <div className="flex flex-col gap-1.5" data-painel-escopo>
      {secoes.map((secao) => (
        <div key={secao.id} data-secao-escopo={secao.titulo}>
          <p className="text-[11px] font-black uppercase tracking-wide text-secundaria">{secao.titulo}</p>
          {secao.variaveis.length === 0 ? (
            <Vazio>(vazio)</Vazio>
          ) : (
            <ul className="flex flex-col font-mono text-[13px]">
              {secao.variaveis.map((variavel) => (
                <li key={variavel.nome} className="break-words" data-variavel-escopo={variavel.nome}>
                  <span className={variavel.nome === "Valor devolvido" ? "font-sans font-bold text-sucesso" : "font-bold text-codigo-atributo"}>{variavel.nome}</span>
                  <span className="text-texto-suave">: </span>
                  <ValorConsole valor={memoriaParaExibido(variavel.valor, foto.monte)} contexto="propriedade" />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function PainelPilha({ depurador, nomeSnippet }: { depurador: Depurador; nomeSnippet: string }) {
  const sessao = depurador.sessao;
  if (!sessao) return <Vazio>Sem pausa: a pilha aparece quando o programa para.</Vazio>;
  const pilha = pilhaDeChamadas(sessao.resultado.passos[sessao.pausa.indice].memoria);
  return (
    <ul className="flex flex-col gap-0.5" data-painel-pilha>
      {pilha.map((quadro, posicao) => {
        const escolhido = quadro.indice === sessao.quadro;
        return (
          <li key={`${quadro.indice}-${quadro.nome}`}>
            <button
              type="button"
              onClick={() => depurador.escolherQuadro(quadro.indice)}
              aria-pressed={escolhido}
              className={`flex w-full items-center gap-2 rounded-md px-1.5 py-0.5 text-left text-xs pointer-coarse:min-h-11 ${escolhido ? "bg-selecao font-bold text-texto" : "text-texto hover:bg-hover"}`}
              data-quadro-pilha={quadro.nome}
            >
              <span className="w-3 shrink-0 text-sucesso">{posicao === 0 ? "›" : ""}</span>
              <span className="min-w-0 flex-1 truncate font-mono">{quadro.nome}</span>
              <span className="shrink-0 text-texto-suave">
                {nomeSnippet}:{quadro.linha ?? "?"}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* A barra lateral inteira                                             */
/* ------------------------------------------------------------------ */

export type AbaDepurador = "escopo" | "observar" | "pilha" | "pontos";

type Props = {
  depurador: Depurador;
  nomeSnippet: string;
  /** O texto do Snippet agora (a lista de pontos mostra a linha). */
  codigo: string;
  /** Celular: os painéis em abas (os controles vão para a barra de baixo). */
  emAbas: boolean;
  toque: boolean;
  aoAbrirCard: (id: IdFerramenta) => void;
  /** O jogo pede uma aba (a apresentação de um painel, no celular). `vez` muda a cada pedido. */
  abaPedida?: { aba: AbaDepurador; vez: number } | null;
};

export function PainelDepurador({ depurador, nomeSnippet, codigo, emAbas, toque, aoAbrirCard, abaPedida = null }: Props) {
  const [aba, setAba] = useState<AbaDepurador>("escopo");
  const [pedidoVisto, setPedidoVisto] = useState(abaPedida?.vez ?? 0);
  if (abaPedida && abaPedida.vez !== pedidoVisto) {
    setPedidoVisto(abaPedida.vez);
    setAba(abaPedida.aba);
  }
  const pausado = depurador.sessao !== null;
  const aviso = (
    <p
      className={`shrink-0 px-2 py-1 text-xs font-bold ${pausado ? "bg-destaque text-sobre-destaque" : "text-texto-suave"}`}
      role="status"
      data-estado-depurador={pausado ? "pausado" : "parado"}
    >
      {textoDaPausa(depurador, nomeSnippet)}
    </p>
  );
  const observar = <PainelObservar depurador={depurador} toque={toque} />;
  const escopo = <PainelEscopo depurador={depurador} />;
  const pilha = <PainelPilha depurador={depurador} nomeSnippet={nomeSnippet} />;
  const pontos = <ListaPontos depurador={depurador} nomeSnippet={nomeSnippet} codigo={codigo} />;
  /** O painel embrulhado para a apresentação (no computador, o "?" fica no título da seção). */
  const alvo = (id: IdFerramenta, conteudo: ReactNode) => (
    <AlvoFerramenta ids={[id]} marcador={id} aoAbrirCard={aoAbrirCard} classeMarcador="right-1.5 top-0.5">
      {conteudo}
    </AlvoFerramenta>
  );

  if (emAbas) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-superficie" data-depurador="abas">
        {aviso}
        <div className="shrink-0 border-b-2 border-borda bg-painel px-1.5 py-1">
          <SeletorSegmentado
            rotulo="Painéis do depurador"
            opcoes={[
              { id: "escopo", rotulo: "Escopo" },
              { id: "observar", rotulo: "Observar" },
              { id: "pilha", rotulo: "Pilha" },
              { id: "pontos", rotulo: "Pontos" },
            ]}
            valor={aba}
            aoTrocar={setAba}
            className="w-full"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-1.5" data-aba-depurador={aba}>
          {aba === "escopo" ? alvo("painel-escopo", escopo) : aba === "observar" ? alvo("painel-observar", observar) : aba === "pilha" ? alvo("pilha-de-chamadas", pilha) : pontos}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-superficie" data-depurador="lateral">
      <div className="flex shrink-0 items-center gap-1 border-b-2 border-borda bg-painel px-1.5 py-1">
        <BarraControlesDepurador pausado={pausado} aoControlar={depurador.controlar} aoAbrirCard={aoAbrirCard} />
      </div>
      {aviso}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {alvo(
          "painel-observar",
          <Secao titulo="Observar" dados="observar">
            {observar}
          </Secao>,
        )}
        <Secao titulo="Pontos de parada" dados="pontos">
          {pontos}
        </Secao>
        {alvo(
          "painel-escopo",
          <Secao titulo="Escopo" dados="escopo">
            {escopo}
          </Secao>,
        )}
        {alvo(
          "pilha-de-chamadas",
          <Secao titulo="Pilha de chamadas" dados="pilha">
            {pilha}
          </Secao>,
        )}
      </div>
    </div>
  );
}
