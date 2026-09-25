"use client";

import { type MouseEvent as EventoMouse, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { sinalizarUso } from "@/ferramentas/uso";
import { type CamadaCaixa, formatarMedida, type Lados, medirModeloCaixa, valorDoLado } from "@/lib/modeloCaixa";
import { calcularCascata, NOME_FOLHA_DO_JOGO } from "@/motor/css/cascata";

export type CamadaRealcada = CamadaCaixa | "todas" | null;

type Props = {
  elemento: Element | null;
  /** Sobe quando o documento ou o CSS muda. */
  versao: number;
  toque: boolean;
  /** A camada acesa na prévia agora (quem guarda é o jogo: trocar de aba ou de segmento apaga). */
  camada: CamadaRealcada;
  /** Passar o mouse (ou tocar) numa camada do diagrama: a prévia acende só ela; no diagrama todo, todas. */
  aoRealcarCamada: (camada: CamadaRealcada) => void;
  /** Link da fonte de uma declaração no rastro: abre o editor CSS na regra. */
  aoIrParaFonte: (inicio: number) => void;
};

const COR_DA_CAMADA: Record<CamadaCaixa, string> = {
  margin: "bg-caixa-margem",
  border: "bg-caixa-borda",
  padding: "bg-caixa-preenchimento",
  content: "bg-caixa-conteudo",
};

/** Sem "Mostrar todas", o Chrome mostra estas mesmo sem declaração (alwaysShownComputedProperties). */
const SEMPRE_VISIVEIS = new Set(["display", "height", "width"]);

/** Uma declaração que o elemento recebe para uma propriedade (o "rastro" do Chrome). */
type Rastro = {
  valor: string;
  seletor: string;
  /** "estilo.css:12", "element.style", "folha do navegador"... */
  fonte: string;
  /** Início da regra na folha editável (para o link), ou null. */
  inicio: number | null;
  riscada: boolean;
};

/** Ordem do Chrome: as normais em ordem alfabética, depois as -webkit-, depois as variáveis. */
function ordemDoChrome(a: string, b: string): number {
  const grupo = (nome: string) => (nome.startsWith("--") ? 2 : nome.startsWith("-webkit") ? 1 : 0);
  return grupo(a) - grupo(b) || a.localeCompare(b);
}

/**
 * A aba Calculado (Computed do Chrome): o diagrama do modelo de caixa com
 * as medidas REAIS do elemento na prévia e a lista das propriedades
 * calculadas, com filtro e "Mostrar todas". Aqui vale getComputedStyle (é
 * só para ver); o rastro de cada propriedade (as declarações que o
 * elemento recebe, a que vence primeiro) vem do motor de cascata.
 * Conferido no devtools-frontend (MetricsSidebarPane e
 * ComputedStyleWidget).
 */
export function PainelCalculado({ elemento, versao, toque, camada, aoRealcarCamada, aoIrParaFonte }: Props) {
  const [filtro, setFiltro] = useState("");
  const [todas, setTodas] = useState(false);
  const [abertas, setAbertas] = useState<ReadonlySet<string>>(new Set());

  // Saiu da tela (outra sub-aba, outro segmento no celular): apaga a camada acesa.
  const avisar = useRef(aoRealcarCamada);
  useEffect(() => {
    avisar.current = aoRealcarCamada;
  }, [aoRealcarCamada]);
  useEffect(() => () => avisar.current(null), []);

  const dados = useMemo(() => {
    if (!elemento) return null;
    const modelo = medirModeloCaixa(elemento);
    const janela = elemento.ownerDocument.defaultView;
    const calculado = janela ? janela.getComputedStyle(elemento) : null;
    const valores = new Map<string, string>();
    if (calculado) {
      for (let indice = 0; indice < calculado.length; indice++) {
        const nome = calculado.item(indice);
        valores.set(nome, calculado.getPropertyValue(nome));
      }
    }
    // O rastro: só as declarações das regras do PRÓPRIO elemento (como o
    // Chrome), na ordem do painel Estilos (a que vence primeiro).
    const rastros = new Map<string, Rastro[]>();
    for (const bloco of calcularCascata(elemento).proprios) {
      for (const item of bloco.declaracoes) {
        if (item.situacao === "desligada" || item.situacao === "invalida") continue;
        for (const longa of item.longas) {
          if (longa.situacao === "desligada" || longa.situacao === "invalida") continue;
          const lista = rastros.get(longa.propriedade) ?? [];
          lista.push({
            valor: longa.valor ?? item.declaracao.valorBruto,
            seletor: bloco.seletorExibido,
            fonte:
              bloco.tipo === "inline"
                ? "element.style"
                : bloco.folha?.origem === "folha"
                  ? `${NOME_FOLHA_DO_JOGO}:${bloco.regra?.linha ?? 1}`
                  : bloco.folha?.origem === "navegador"
                    ? "folha do navegador"
                    : (bloco.folha?.nome ?? ""),
            inicio: bloco.folha?.origem === "folha" && bloco.regra ? bloco.regra.inicio : null,
            riscada: longa.situacao === "perdeu",
          });
          rastros.set(longa.propriedade, lista);
        }
      }
    }
    return { versao, modelo, valores, rastros, nomes: [...valores.keys()].sort(ordemDoChrome) };
  }, [elemento, versao]);

  if (!elemento || !dados) {
    return <p className="p-3 text-sm text-texto-suave">Selecione uma peça para ver as medidas dela.</p>;
  }

  const termo = filtro.trim().toLowerCase();
  const visiveis = dados.nomes.filter((nome) => {
    if (!todas && !dados.rastros.has(nome) && !SEMPRE_VISIVEIS.has(nome)) return false;
    if (termo.length === 0) return true;
    return nome.includes(termo) || (dados.valores.get(nome) ?? "").toLowerCase().includes(termo);
  });

  const realcar = (nova: CamadaRealcada) => {
    if (nova === camada) return;
    aoRealcarCamada(nova);
    if (nova && nova !== "todas") sinalizarUso("modelo-de-caixa");
  };

  const eventosDaCamada = (qual: CamadaCaixa) => ({
    onMouseOver: (evento: EventoMouse) => {
      evento.stopPropagation();
      if (!toque) realcar(qual);
    },
    onClick: (evento: EventoMouse) => {
      evento.stopPropagation();
      realcar(camada === qual ? null : qual);
    },
  });

  const moldura = (qual: CamadaCaixa | "position", valores: Record<keyof Lados, string>, dentro: ReactNode) => (
    <div
      data-camada={qual}
      {...(qual === "position" ? {} : eventosDaCamada(qual))}
      className={`grid grid-cols-[minmax(1.75rem,auto)_1fr_minmax(1.75rem,auto)] items-center rounded-[2px] text-center ${
        qual === "position" ? "border border-dotted border-texto-suave bg-superficie" : COR_DA_CAMADA[qual]
      } ${qual === "border" ? "border border-texto" : qual !== "position" ? "border border-dashed border-texto" : ""} ${
        camada === qual ? "outline outline-2 outline-offset-1 outline-primaria" : ""
      }`}
    >
      <span className="col-span-3 grid grid-cols-[1fr_auto_1fr] items-center px-1 pt-0.5">
        <span className="justify-self-start font-ui text-[10px] font-bold text-texto">{qual}</span>
        <span data-lado="cima">{valores.cima}</span>
      </span>
      <span data-lado="esquerda" className="px-1">
        {valores.esquerda}
      </span>
      <div className="py-0.5">{dentro}</div>
      <span data-lado="direita" className="px-1">
        {valores.direita}
      </span>
      <span data-lado="baixo" className="col-span-3 pb-0.5">
        {valores.baixo}
      </span>
    </div>
  );

  const medidas = (lados: Lados): Record<keyof Lados, string> => ({
    cima: formatarMedida(lados.cima),
    direita: formatarMedida(lados.direita),
    baixo: formatarMedida(lados.baixo),
    esquerda: formatarMedida(lados.esquerda),
  });

  const modelo = dados.modelo;
  let diagrama: ReactNode = null;
  if (modelo) {
    const conteudo = (
      <div
        data-camada="content"
        {...eventosDaCamada("content")}
        className={`mx-auto w-fit rounded-[2px] border border-texto px-2 py-1 ${COR_DA_CAMADA.content} ${
          camada === "content" ? "outline outline-2 outline-offset-1 outline-primaria" : ""
        }`}
      >
        <span data-largura>{formatarMedida(modelo.conteudo.largura)}</span> × <span data-altura>{formatarMedida(modelo.conteudo.altura)}</span>
      </div>
    );
    const caixa = moldura(
      "margin",
      medidas(modelo.margem),
      moldura("border", medidas(modelo.borda), moldura("padding", medidas(modelo.preenchimento), conteudo)),
    );
    const deslocamento = modelo.deslocamento;
    diagrama = deslocamento
      ? moldura(
          "position",
          {
            cima: valorDoLado(deslocamento.cima),
            direita: valorDoLado(deslocamento.direita),
            baixo: valorDoLado(deslocamento.baixo),
            esquerda: valorDoLado(deslocamento.esquerda),
          },
          caixa,
        )
      : caixa;
  }

  const alternarRastro = (nome: string) =>
    setAbertas((atual) => {
      const nova = new Set(atual);
      if (nova.has(nome)) nova.delete(nome);
      else nova.add(nome);
      return nova;
    });

  return (
    <div className="flex h-full min-h-0 flex-col font-codigo text-[12px] text-texto" data-painel-calculado>
      <div className="min-h-0 flex-1 overflow-auto">
        {diagrama && (
          <div
            className="border-b border-borda p-2 text-[11px] leading-4"
            data-modelo-caixa
            onMouseOver={() => {
              if (!toque) realcar("todas");
            }}
            onMouseLeave={() => {
              // No toque, o navegador inventa um mouseleave depois do toque: a camada só apaga com outro toque.
              if (!toque) realcar(null);
            }}
          >
            {diagrama}
          </div>
        )}
        <div className="sticky top-0 z-[1] flex items-center gap-2 border-b border-borda bg-painel px-2 py-1 font-ui">
          <input
            type="search"
            value={filtro}
            onChange={(evento) => setFiltro(evento.target.value)}
            placeholder="Filtrar"
            aria-label="Filtrar as propriedades calculadas"
            className="h-6 min-w-0 flex-1 rounded-md border-2 border-borda bg-superficie px-1.5 text-xs text-texto pointer-coarse:h-11"
          />
          <label className="flex shrink-0 items-center gap-1 text-xs font-bold text-texto-suave pointer-coarse:min-h-11">
            <input
              type="checkbox"
              checked={todas}
              onChange={(evento) => setTodas(evento.target.checked)}
              data-mostrar-todas
              className="accent-[var(--cor-primaria)] pointer-coarse:h-5 pointer-coarse:w-5"
            />
            Mostrar todas
          </label>
        </div>
        <ul className="px-1 py-1" data-lista-calculado>
          {visiveis.map((nome) => {
            const rastro = dados.rastros.get(nome);
            const aberta = abertas.has(nome);
            return (
              <li key={nome} data-calculada={nome} className="border-b border-borda/50">
                <button
                  type="button"
                  disabled={!rastro}
                  aria-expanded={rastro ? aberta : undefined}
                  onClick={() => alternarRastro(nome)}
                  className={`flex w-full items-start gap-1 rounded px-1 py-0.5 text-left enabled:hover:bg-hover pointer-coarse:min-h-11 pointer-coarse:items-center ${
                    rastro ? "" : "text-texto-suave"
                  }`}
                >
                  <span className="mt-0.5 w-3 shrink-0" aria-hidden="true">
                    {rastro && <IconeChevron direcao={aberta ? "baixo" : "direita"} tamanho={10} />}
                  </span>
                  <span className="min-w-0 break-words">
                    <span className={rastro ? "text-codigo-atributo" : ""}>{nome}</span>
                    <span>: </span>
                    <span className={rastro ? "text-codigo-valor" : ""}>{dados.valores.get(nome)}</span>
                  </span>
                </button>
                {rastro && aberta && (
                  <ul className="pb-1 pl-5" data-rastro={nome}>
                    {rastro.map((item, indice) => (
                      <li
                        key={`${indice}-${item.fonte}`}
                        data-rastro-riscado={item.riscada || undefined}
                        className="flex flex-wrap items-center gap-x-2 text-[11px]"
                      >
                        <span className={item.riscada ? "text-texto-suave line-through" : "text-codigo-valor"}>{item.valor}</span>
                        <span className="text-codigo-tag">{item.seletor}</span>
                        {item.inicio !== null ? (
                          <button
                            type="button"
                            onClick={() => aoIrParaFonte(item.inicio ?? 0)}
                            className="ml-auto rounded px-0.5 text-texto-suave underline hover:bg-hover pointer-coarse:min-h-11"
                          >
                            {item.fonte}
                          </button>
                        ) : (
                          <span className="ml-auto text-texto-suave">{item.fonte}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          {visiveis.length === 0 && <li className="px-1 py-2 font-ui text-xs text-texto-suave">Nenhuma propriedade com esse filtro.</li>}
        </ul>
      </div>
    </div>
  );
}
