"use client";

import { useState } from "react";
import { IconeAviso } from "@/componentes/icones/IconeAviso";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { IconeLighthouse } from "@/componentes/icones/IconeLighthouse";
import {
  CATEGORIAS_AUDITORIA,
  type CategoriaAuditoria,
  type IdRegraAuditoria,
  type ProblemaAuditoria,
  REGRAS_AUDITORIA,
  type ResultadoAuditoria,
} from "@/motor/auditoria";
import { AnelNota } from "./AnelNota";

type Props = {
  resultado: ResultadoAuditoria | null;
  /** A página mudou depois da última análise. */
  desatualizado: boolean;
  aoAnalisar: () => void;
  /** Clique numa peça do problema: mostra na árvore e explica. */
  aoIrParaPeca: (elemento: Element | null, regra: IdRegraAuditoria) => void;
};

/** "<img.foto>" ou "<p#aviso>": a peça como o Lighthouse mostra (o seletor curtinho). */
function rotuloDaPeca(elemento: Element): string {
  const tag = elemento.tagName.toLowerCase();
  const id = elemento.id ? `#${elemento.id}` : "";
  const classe = elemento.classList.length > 0 ? `.${Array.from(elemento.classList).filter((nome) => !nome.startsWith("__web-inspector"))[0] ?? ""}` : "";
  const texto = (elemento.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 24);
  return `<${tag}${id}${classe === "." ? "" : classe}>${texto && tag !== "html" && tag !== "body" ? ` ${texto}` : ""}`;
}

/**
 * A aba Lighthouse, versão simplificada: o botão Analisar (o "Analyze page
 * state" do Chrome, que confere a página como ela está agora), as notas
 * de 0 a 100 no anel de cada categoria e a lista de problemas. Cada
 * problema diz por que importa, em linguagem de leigo, e leva até a peça.
 */
export function PainelLighthouse({ resultado, desatualizado, aoAnalisar, aoIrParaPeca }: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-superficie" data-painel-lighthouse>
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b-2 border-borda bg-painel px-3 py-2">
        <IconeLighthouse className="text-primaria" tamanho={20} />
        <p className="min-w-0 flex-1 text-xs font-bold leading-snug text-texto-suave">
          Versão simplificada do Lighthouse: confere Acessibilidade, Boas práticas e SEO básico com {Object.keys(REGRAS_AUDITORIA).length} verificações. O
          de verdade confere bem mais (e o desempenho).
        </p>
        <button
          type="button"
          data-analisar-auditoria
          onClick={aoAnalisar}
          className="inline-flex h-8 shrink-0 items-center rounded-full border-2 border-primaria bg-primaria px-4 text-sm font-black text-sobre-primaria hover:brightness-110 pointer-coarse:h-11"
        >
          {resultado ? "Analisar de novo" : "Analisar"}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {!resultado ? (
          <p className="text-sm text-texto-suave">Clique em Analisar para conferir a página como ela está agora.</p>
        ) : (
          <>
            {desatualizado && (
              <p role="status" className="mb-3 flex items-center gap-1.5 rounded-lg bg-painel px-2 py-1 text-xs font-bold text-texto" data-auditoria-desatualizada>
                <IconeAviso className="shrink-0 text-alerta" />A página mudou depois da análise: analise de novo para ver as notas novas.
              </p>
            )}
            <div className="flex flex-wrap justify-around gap-3" data-notas-auditoria>
              {CATEGORIAS_AUDITORIA.map((categoria) => (
                <AnelNota key={categoria.id} nota={resultado.notas[categoria.id]} rotulo={categoria.nome} categoria={categoria.id} />
              ))}
            </div>
            {CATEGORIAS_AUDITORIA.map((categoria) => (
              <SecaoCategoria key={categoria.id} categoria={categoria.id} nome={categoria.nome} resultado={resultado} aoIrParaPeca={aoIrParaPeca} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function SecaoCategoria({
  categoria,
  nome,
  resultado,
  aoIrParaPeca,
}: {
  categoria: CategoriaAuditoria;
  nome: string;
  resultado: ResultadoAuditoria;
  aoIrParaPeca: Props["aoIrParaPeca"];
}) {
  const [verAprovadas, setVerAprovadas] = useState(false);
  const daCategoria = (regra: IdRegraAuditoria) => REGRAS_AUDITORIA[regra].pesos[categoria] !== undefined;
  const problemas = resultado.problemas.filter((problema) => daCategoria(problema.regra));
  const aprovadas = resultado.aprovadas.filter(daCategoria);
  return (
    <section className="mt-4" data-categoria-auditoria={categoria} aria-label={nome}>
      <h3 className="border-b-2 border-borda pb-1 text-sm font-black text-texto">
        {nome} <span className="font-codigo text-xs text-texto-suave">{resultado.notas[categoria]}</span>
      </h3>
      {problemas.length === 0 ? (
        <p className="mt-2 text-sm text-sucesso">Nenhum problema aqui.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {problemas.map((problema) => (
            <ItemProblema key={problema.regra} problema={problema} aoIrParaPeca={aoIrParaPeca} />
          ))}
        </ul>
      )}
      {aprovadas.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            aria-expanded={verAprovadas}
            onClick={() => setVerAprovadas((valor) => !valor)}
            className="flex min-h-7 items-center gap-1 text-xs font-bold text-texto-suave hover:text-texto pointer-coarse:min-h-11"
          >
            <IconeChevron direcao={verAprovadas ? "baixo" : "direita"} tamanho={10} />
            Aprovadas ({aprovadas.length})
          </button>
          {verAprovadas && (
            <ul className="ml-4 list-disc text-xs text-texto-suave">
              {aprovadas.map((regra) => (
                <li key={regra} data-aprovada={regra}>
                  {REGRAS_AUDITORIA[regra].tituloOk}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function ItemProblema({ problema, aoIrParaPeca }: { problema: ProblemaAuditoria; aoIrParaPeca: Props["aoIrParaPeca"] }) {
  const [aberto, setAberto] = useState(false);
  const regra = REGRAS_AUDITORIA[problema.regra];
  const pecas = problema.elementos;
  return (
    <li className="rounded-xl border-2 border-borda bg-painel" data-problema-auditoria={problema.regra}>
      <button
        type="button"
        aria-expanded={aberto}
        onClick={() => setAberto((valor) => !valor)}
        className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm font-bold text-texto pointer-coarse:min-h-11"
      >
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-erro" aria-hidden="true" />
        <span className="min-w-0 flex-1">{regra.titulo}</span>
        {pecas.length > 1 && <span className="shrink-0 font-codigo text-xs text-texto-suave">{pecas.length} peças</span>}
        <IconeChevron direcao={aberto ? "baixo" : "direita"} tamanho={10} />
      </button>
      {aberto && (
        <div className="border-t-2 border-borda px-2 py-2 text-sm">
          <p className="text-texto">{regra.porQue}</p>
          <p className="mt-1 text-texto-suave">
            <span className="font-bold text-texto">Como consertar:</span> {regra.comoConsertar}
          </p>
          <ul className="mt-2 space-y-1">
            {pecas.map((peca, indice) => (
              <li key={indice}>
                <button
                  type="button"
                  data-peca-auditoria
                  onClick={() => aoIrParaPeca(peca, problema.regra)}
                  className="flex w-full min-w-0 items-center gap-2 rounded-lg bg-superficie px-2 py-1 text-left font-codigo text-xs text-codigo-tag hover:bg-hover pointer-coarse:min-h-11"
                >
                  <span className="min-w-0 flex-1 truncate">{rotuloDaPeca(peca)}</span>
                  {problema.detalhes[indice] && <span className="shrink-0 font-ui text-texto-suave">{problema.detalhes[indice]}</span>}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-texto-suave">No Lighthouse de verdade: {regra.noLighthouse}</p>
        </div>
      )}
    </li>
  );
}
