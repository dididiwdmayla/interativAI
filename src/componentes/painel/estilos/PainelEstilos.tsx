"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AlvoFerramenta } from "@/componentes/ferramentas/AlvoFerramenta";
import { IconeNovaRegra } from "@/componentes/icones/IconeNovaRegra";
import type { IdFerramenta } from "@/ferramentas/ids";
import { sinalizarUso } from "@/ferramentas/uso";
import { elementosDaRegra } from "@/lib/elementosDaRegra";
import type { PainelElementos } from "@/conteudo/tipos";
import { type Bloco, calcularCascata, folhasDoDocumento, normalizarSeletor } from "@/motor/css/cascata";
import {
  adicionarDeclaracaoNoTexto,
  alternarDeclaracaoNoTexto,
  editarEstiloInlineNoTexto,
  type RefDeclaracao,
  removerDeclaracao,
  seletorSimples,
  trocarNome,
  trocarValor,
} from "@/motor/css/editarCss";
import { ESPECIFICIDADE_ZERO } from "@/motor/css/especificidade";
import { BlocoEstilo } from "./BlocoEstilo";
import type { Saida } from "./CampoEstilo";
import type { AcoesEstilos, DestaqueEstilos, EdicaoEstilos } from "./tipos";

type Props = {
  /** O elemento selecionado (o dono, se a seleção é um texto), ou null. */
  elemento: Element | null;
  /** Sobe quando o documento ou o CSS muda: o painel recalcula a cascata. */
  versao: number;
  /** Sub-painéis liberados na fase ("estilos", "calculado"). */
  paineis: readonly PainelElementos[];
  /** A fase tem a folha editável (estilo.css). */
  temFolha: boolean;
  toque: boolean;
  destaque: DestaqueEstilos | null;
  /** Texto da folha editável agora (para a prévia provisória). */
  lerCss: () => string | null;
  acoes: AcoesEstilos;
  /** Sub-aba aberta (quem controla é o jogo: a apresentação e a linha de ajuda trocam). */
  aba: PainelElementos;
  aoTrocarAba: (aba: PainelElementos) => void;
  /** O conteúdo da aba Calculado. */
  calculado?: ReactNode;
  aoAbrirCard?: (id: IdFerramenta) => void;
};

/** "tag#id.classe" para o "Herdado de". */
function rotuloDoElemento(elemento: Element): string {
  const tag = elemento.tagName.toLowerCase();
  const id = elemento.id ? `#${elemento.id}` : "";
  const classes = Array.from(elemento.classList)
    .filter((classe) => !classe.startsWith("__web-inspector"))
    .map((classe) => `.${classe}`)
    .join("");
  return `${tag}${id}${classes}`;
}

/** O element.style vazio, que o Chrome mostra sempre (é onde se acrescenta estilo inline). */
function blocoInlineVazio(elemento: Element): Bloco {
  return {
    id: "inline",
    tipo: "inline",
    elemento,
    folha: null,
    regra: null,
    indiceRegra: -1,
    seletorExibido: "element.style",
    seletores: [],
    especificidade: ESPECIFICIDADE_ZERO,
    condicoes: [],
    declaracoes: [],
  };
}

/** A próxima edição depois de confirmar um campo (como o Tab do Chrome). */
function proximaEdicao(
  bloco: Bloco,
  alvo: number,
  campo: "nome" | "valor",
  saida: Saida,
): Omit<EdicaoEstilos, "bloco"> | null {
  if (saida === "fora") return null;
  if (saida === "enter") return campo === "nome" ? { alvo, campo: "valor" } : null;
  if (saida === "tab") {
    if (campo === "nome") return { alvo, campo: "valor" };
    return alvo + 1 < bloco.declaracoes.length ? { alvo: alvo + 1, campo: "nome" } : { alvo: "nova", campo: "nome" };
  }
  if (campo === "valor") return { alvo, campo: "nome" };
  return alvo > 0 ? { alvo: alvo - 1, campo: "valor" } : null;
}

/**
 * O painel Estilos (Styles do Chrome), dentro da aba Elementos: as regras
 * do elemento selecionado na ordem da cascata, com as riscadas, a caixinha
 * de ligar e desligar, a edição de nome e valor, as setas nos números, a
 * amostra de cor, a regra nova e as seções "Herdado de".
 *
 * Tudo sai do motor de cascata (src/motor/css/cascata.ts), o mesmo dos
 * validadores. Toda edição passa pelo núcleo do painel: escreve no CSS (a
 * fonte de verdade), atualiza o editor e a prévia na hora e entra no
 * desfazer.
 */
export function PainelEstilos({
  elemento,
  versao,
  paineis,
  temFolha,
  toque,
  destaque,
  lerCss,
  acoes,
  aba,
  aoTrocarAba,
  calculado,
  aoAbrirCard,
}: Props) {
  const [filtro, setFiltro] = useState("");
  const [edicao, setEdicao] = useState<EdicaoEstilos | null>(null);
  const recipiente = useRef<HTMLDivElement>(null);

  const cascata = useMemo(() => (elemento ? { versao, resultado: calcularCascata(elemento) } : null), [elemento, versao]);
  const resultado = cascata?.resultado ?? null;
  const proprios = useMemo(() => {
    if (!resultado) return [];
    const temInline = resultado.proprios.some((bloco) => bloco.tipo === "inline");
    return temInline ? resultado.proprios : [blocoInlineVazio(resultado.elemento), ...resultado.proprios];
  }, [resultado]);

  // Outra peça selecionada: a edição aberta fecha.
  const [elementoDaEdicao, setElementoDaEdicao] = useState(elemento);
  if (elementoDaEdicao !== elemento) {
    setElementoDaEdicao(elemento);
    setEdicao(null);
  }

  // A edição nova (regra nova, Tab) fica à vista.
  useEffect(() => {
    if (!edicao) return;
    recipiente.current
      ?.querySelector(`[data-bloco-estilo="${edicao.bloco}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [edicao]);

  const editavel = (bloco: Bloco) => bloco.tipo === "inline" || (temFolha && bloco.folha?.origem === "folha");
  const refDe = (bloco: Bloco, indice: number): RefDeclaracao => ({ indiceRegra: bloco.indiceRegra, indiceDeclaracao: indice });

  /** Mexe no style de um elemento com as funções da folha (o inline vira uma regra de mentirinha). */
  const mexerNoInline = (bloco: Bloco, calcular: (css: string) => string | null, detalhe: { propriedade: string; valor: string }) => {
    const novo = editarEstiloInlineNoTexto(bloco.elemento.getAttribute("style") ?? "", calcular);
    return novo !== null && acoes.editarInline(bloco.elemento, novo, detalhe);
  };

  const cancelar = () => {
    acoes.previsualizarCss(null);
    setEdicao(null);
  };

  /** Enquanto digita o valor: a prévia mostra (só na folha editável). */
  const previsualizar = (bloco: Bloco, alvo: number | "nova", texto: string) => {
    if (bloco.tipo !== "regra" || !temFolha) return;
    const css = lerCss();
    if (css === null || texto.trim().length === 0) {
      acoes.previsualizarCss(null);
      return;
    }
    const novo =
      alvo === "nova"
        ? edicao?.nomeNovo
          ? (adicionarDeclaracaoNoTexto(css, bloco.indiceRegra, edicao.nomeNovo, texto)?.texto ?? null)
          : null
        : trocarValor(css, refDe(bloco, alvo), texto);
    acoes.previsualizarCss(novo);
  };

  const confirmar = (bloco: Bloco, alvo: number | "nova", campo: "nome" | "valor", texto: string, saida: Saida) => {
    acoes.previsualizarCss(null);
    const limpo = texto.trim();
    if (alvo === "nova") {
      if (campo === "nome") {
        setEdicao(limpo.length === 0 || saida === "fora" ? null : { bloco: bloco.id, alvo: "nova", campo: "valor", nomeNovo: limpo });
        return;
      }
      const nome = edicao?.nomeNovo ?? "";
      if (limpo.length === 0 || nome.length === 0) {
        setEdicao(null);
        return;
      }
      const certo =
        bloco.tipo === "inline"
          ? mexerNoInline(bloco, (css) => adicionarDeclaracaoNoTexto(css, 0, nome, limpo)?.texto ?? null, { propriedade: nome, valor: limpo })
          : acoes.adicionarDeclaracao(bloco.indiceRegra, nome, limpo) !== null;
      if (certo) sinalizarUso("editar-valor-css");
      setEdicao(certo && saida === "tab" ? { bloco: bloco.id, alvo: "nova", campo: "nome" } : null);
      return;
    }
    const item = bloco.declaracoes[alvo];
    if (!item) {
      setEdicao(null);
      return;
    }
    const original = campo === "nome" ? item.declaracao.propriedade : item.declaracao.valorBruto;
    let mudou = false;
    if (limpo !== original) {
      if (bloco.tipo === "inline") {
        const ref = { indiceRegra: 0, indiceDeclaracao: alvo };
        mudou = mexerNoInline(
          bloco,
          (css) => (limpo.length === 0 ? removerDeclaracao(css, ref) : campo === "nome" ? trocarNome(css, ref, limpo) : trocarValor(css, ref, limpo)),
          { propriedade: campo === "nome" ? limpo : item.declaracao.propriedade, valor: campo === "valor" ? limpo : item.declaracao.valor },
        );
      } else {
        mudou = acoes.editarDeclaracao(refDe(bloco, alvo), campo, limpo);
      }
      if (mudou) sinalizarUso("editar-valor-css");
    }
    if (limpo.length === 0) {
      setEdicao(null);
      return;
    }
    const proxima = proximaEdicao(bloco, alvo, campo, saida);
    setEdicao(proxima ? { bloco: bloco.id, ...proxima } : null);
  };

  const alternar = (bloco: Bloco, indice: number) => {
    const item = bloco.declaracoes[indice];
    if (!item) return;
    if (bloco.tipo === "inline") {
      mexerNoInline(bloco, (css) => alternarDeclaracaoNoTexto(css, { indiceRegra: 0, indiceDeclaracao: indice }), {
        propriedade: item.declaracao.propriedade,
        valor: item.declaracao.valor,
      });
    } else {
      acoes.alternarDeclaracao(refDe(bloco, indice));
    }
  };

  const escolherCor = (bloco: Bloco, indice: number, valor: string, final: boolean) => {
    if (!final) {
      previsualizar(bloco, indice, valor);
      return;
    }
    sinalizarUso("seletor-de-cor");
    confirmar(bloco, indice, "valor", valor, "fora");
  };

  const novaRegra = () => {
    if (!elemento || !temFolha) return;
    const indice = acoes.adicionarRegra(seletorSimples(elemento));
    const folha = folhasDoDocumento(elemento.ownerDocument).find((item) => item.origem === "folha");
    if (indice !== null && folha) setEdicao({ bloco: `${folha.indice}:${indice}`, alvo: "nova", campo: "nome" });
  };

  const destaqueDo = (bloco: Bloco) => {
    if (!destaque || bloco.tipo !== "regra" || bloco.folha?.origem === "navegador") return null;
    return normalizarSeletor(bloco.regra?.seletor ?? "") === normalizarSeletor(destaque.seletorRegra)
      ? { propriedade: destaque.propriedade }
      : null;
  };

  const passarSeletor = (bloco: Bloco, entrando: boolean) => {
    if (!entrando || !bloco.regra) {
      acoes.realcar([]);
      return;
    }
    acoes.realcar(elementosDaRegra(bloco.elemento.ownerDocument, bloco.regra.seletor));
  };

  const desenharBloco = (bloco: Bloco) => (
    <BlocoEstilo
      key={`${bloco.elemento === elemento ? "proprio" : "herdado"}-${bloco.id}`}
      bloco={bloco}
      editavel={editavel(bloco)}
      toque={toque}
      edicao={edicao?.bloco === bloco.id && bloco.elemento === elemento ? edicao : null}
      filtro={filtro.trim().toLowerCase()}
      destaque={destaqueDo(bloco)}
      aoPassarSeletor={(entrando) => passarSeletor(bloco, entrando)}
      aoIrParaFonte={() => bloco.regra && acoes.irParaFonte(bloco.regra.inicio)}
      aoComecar={(alvo, campo) => {
        if (bloco.elemento !== elemento) return;
        acoes.previsualizarCss(null);
        setEdicao({ bloco: bloco.id, alvo, campo });
      }}
      aoConfirmar={(alvo, campo, texto, saida) => confirmar(bloco, alvo, campo, texto, saida)}
      aoCancelar={cancelar}
      aoMudarValor={(alvo, texto) => previsualizar(bloco, alvo, texto)}
      aoAlternar={(indice) => alternar(bloco, indice)}
      aoEscolherCor={(indice, valor, final) => escolherCor(bloco, indice, valor, final)}
      aoUsarSetas={() => sinalizarUso("setas-numericas")}
    />
  );

  const conteudoEstilos = !elemento ? (
    <p className="p-3 text-sm text-texto-suave">Selecione uma peça na árvore (ou com a setinha) para ver as regras de CSS dela.</p>
  ) : (
    <div ref={recipiente} className="min-h-0 flex-1 overflow-auto" data-lista-estilos>
      {resultado?.incerta && (
        <p className="border-b border-borda bg-painel px-2 py-1 text-[11px] font-bold text-texto-suave">
          Esta página usa algo que o jogo ainda não sabe ordenar ({resultado.incerta}): nada fica riscado.
        </p>
      )}
      {proprios.map(desenharBloco)}
      {resultado?.herdados.map((grupo, indice) => (
        <div key={`${indice}-${rotuloDoElemento(grupo.elemento)}`} data-herdado-de={rotuloDoElemento(grupo.elemento)}>
          <p className="flex items-center gap-1 bg-painel px-2 py-1 text-[11px] font-bold text-texto-suave">
            Herdado de
            <button
              type="button"
              onClick={() => acoes.selecionarElemento(grupo.elemento)}
              className="rounded px-1 font-codigo text-codigo-tag hover:bg-hover pointer-coarse:min-h-11"
            >
              {rotuloDoElemento(grupo.elemento)}
            </button>
          </p>
          {grupo.blocos.map(desenharBloco)}
        </div>
      ))}
    </div>
  );

  const abas = paineis.filter((painel) => painel !== "calculado" || calculado !== undefined);

  return (
    <div className="flex h-full min-h-0 flex-col bg-superficie" data-painel-estilos>
      <div className="flex shrink-0 items-center gap-1 border-b-2 border-borda bg-painel px-2 py-1 pointer-fine:pr-8">
        <div role="tablist" aria-label="Painéis de estilo" className="flex items-center gap-0.5">
          {abas.map((painel) => (
            <button
              key={painel}
              type="button"
              role="tab"
              aria-selected={aba === painel}
              data-sub-aba={painel}
              onClick={() => aoTrocarAba(painel)}
              className={`rounded-lg px-2 py-0.5 text-xs font-black transition-colors pointer-coarse:min-h-11 pointer-coarse:px-3 ${
                aba === painel ? "bg-superficie text-primaria shadow-[0_2px_0_var(--cor-sombra)]" : "text-texto-suave hover:bg-hover"
              }`}
            >
              {painel === "estilos" ? "Estilos" : "Calculado"}
            </button>
          ))}
        </div>
        {aba !== "calculado" && (
          <>
            <input
              type="search"
              value={filtro}
              onChange={(evento) => setFiltro(evento.target.value)}
              placeholder="Filtrar"
              aria-label="Filtrar as declarações"
              className="ml-auto h-6 w-24 min-w-0 rounded-md border-2 border-borda bg-superficie px-1.5 text-xs text-texto pointer-coarse:h-11 pointer-coarse:w-28"
            />
            <AlvoFerramenta ids={["nova-regra"]} marcador="nova-regra" aoAbrirCard={aoAbrirCard} classeMarcador="-right-2 -top-1.5" as="span" className="inline-flex">
              <button
                type="button"
                onClick={novaRegra}
                disabled={!elemento || !temFolha}
                aria-label="Nova regra para o elemento selecionado"
                title="Nova regra para o elemento selecionado"
                data-nova-regra
                className="grid h-7 w-7 place-items-center rounded-lg text-texto hover:bg-hover disabled:opacity-40 pointer-coarse:h-11 pointer-coarse:w-11"
              >
                <IconeNovaRegra tamanho={18} />
              </button>
            </AlvoFerramenta>
          </>
        )}
      </div>
      {aba === "calculado" && calculado !== undefined ? <div className="min-h-0 flex-1">{calculado}</div> : conteudoEstilos}
    </div>
  );
}
