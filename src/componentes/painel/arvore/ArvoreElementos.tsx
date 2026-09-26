"use client";

import { type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { achatarArvore, type NoArvore } from "@/lib/arvore";
import { chaveDoCaminho } from "@/lib/dom";
import { CLASSE_ESCONDER } from "@/lib/esconder";
import { TAGS_SEM_RENOMEAR } from "@/motor/nucleoPainel";
import { BarraAcoesNo } from "./BarraAcoesNo";
import { LinhaFechamento } from "./LinhaFechamento";
import { LinhaNo } from "./LinhaNo";
import { MenuNo } from "./MenuNo";
import { type AcoesNo, type DestaqueArvore, type EdicaoArvore, TAGS_VAZIAS } from "./tipos";

type Props = {
  raiz: NoArvore | null;
  recolhidos: ReadonlySet<string>;
  caminhoSelecionado: readonly number[] | null;
  destaque: DestaqueArvore | null;
  /** Tela de toque: linhas mais altas e a barra de ações no selecionado. */
  toque?: boolean;
  aoSelecionar: (caminho: number[], origem: "arvore" | "teclado") => void;
  aoAlternar: (chave: string, recolher: boolean) => void;
  aoPassarMouse: (no: Node | null) => void;
  aoEditarTexto: (caminho: number[], texto: string) => void;
  aoEditarAtributo: (caminho: number[], nome: string, valor: string) => void;
  aoEsconder: (caminho: number[]) => void;
  aoApagar: (caminho: number[]) => void;
  aoDuplicar: (caminho: number[]) => void;
  /** Troca o nome da tag; devolve false se o nome não serve (a edição só fecha). */
  aoRenomearTag: (caminho: number[], novaTag: string) => boolean;
  aoDesfazer: () => void;
  aoRefazer: () => void;
  podeDesfazer: boolean;
  podeRefazer: boolean;
  /** Avisado quando uma edição começa (dois cliques, Enter, F2 ou "Editar"). */
  aoComecarEdicao?: () => void;
  /**
   * "Adicionar atributo" no menu do nó (só nas fases com a ferramenta
   * adicionar-atributo). Recebe o texto escrito, como target="_blank".
   */
  aoAdicionarAtributos?: (caminho: number[], texto: string) => void;
  /** Modo documento: a linha do <!DOCTYPE> em cima do <html>, como no Chrome. */
  doctype?: string | null;
};

type MenuAberto = { x: number; y: number; chave: string };

function podeEditarTexto(no: NoArvore): boolean {
  return no.tipo === "texto" || (no.tipo === "elemento" && no.filhos.length === 0 && !TAGS_VAZIAS.has(no.tag));
}

function rotuloDo(no: NoArvore): string {
  if (no.tipo === "texto") return "texto";
  if (no.tipo === "comentario") return "comentário";
  return `<${no.tag}>`;
}

/** Árvore de Elementos no estilo do F12, construída do body do iframe. */
export function ArvoreElementos({
  raiz,
  recolhidos,
  caminhoSelecionado,
  destaque,
  toque = false,
  aoSelecionar,
  aoAlternar,
  aoPassarMouse,
  aoEditarTexto,
  aoEditarAtributo,
  aoEsconder,
  aoApagar,
  aoDuplicar,
  aoRenomearTag,
  aoDesfazer,
  aoRefazer,
  podeDesfazer,
  podeRefazer,
  aoComecarEdicao,
  aoAdicionarAtributos,
  doctype = null,
}: Props) {
  const recipiente = useRef<HTMLDivElement>(null);
  const [edicao, setEdicao] = useState<EdicaoArvore | null>(null);
  const [rascunhoTag, setRascunhoTag] = useState<string | null>(null);
  const [menu, setMenu] = useState<MenuAberto | null>(null);
  const fecharMenu = useCallback(() => setMenu(null), []);

  const linhas = useMemo(() => (raiz ? achatarArvore(raiz, recolhidos) : []), [raiz, recolhidos]);
  const nos = useMemo(() => linhas.filter((linha) => linha.tipo === "abertura"), [linhas]);
  const chaveSelecionada = caminhoSelecionado ? chaveDoCaminho(caminhoSelecionado) : null;
  const chaveDestaque = destaque ? chaveDoCaminho(destaque.caminho) : null;
  const indiceSelecionado = nos.findIndex((linha) => linha.no.chave === chaveSelecionada);
  const noDoMenu = menu ? nos.find((linha) => linha.no.chave === menu.chave)?.no : undefined;

  useEffect(() => {
    if (chaveSelecionada === null) return;
    const linha = recipiente.current?.querySelector(`[data-chave="${chaveSelecionada}"]`);
    linha?.scrollIntoView({ block: "nearest" });
  }, [chaveSelecionada, raiz]);

  useEffect(() => {
    if (chaveDestaque === null) return;
    recipiente.current
      ?.querySelector(`[data-chave="${chaveDestaque}"]`)
      ?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [chaveDestaque, raiz]);

  const terminarEdicao = () => {
    setEdicao(null);
    setRascunhoTag(null);
    recipiente.current?.focus();
  };

  const comecarEdicao = (nova: EdicaoArvore) => {
    setEdicao(nova);
    setRascunhoTag(null);
    // Renomear é outra ferramenta: não conta como "editar pela árvore".
    if (nova.alvo !== "tag") aoComecarEdicao?.();
  };

  /** Nó que pode ter a tag renomeada (o F12 não deixa no html, head e body). */
  const podeRenomear = (no: NoArvore) => no.tipo === "elemento" && no.caminho.length > 0 && !TAGS_SEM_RENOMEAR.has(no.tag);

  /** Ações do nó para o menu e a barra. Mexer num nó seleciona ele antes, como no F12. */
  const acoesDo = (no: NoArvore): AcoesNo => {
    const elemento = no.tipo === "elemento";
    const escondido = no.atributos.some(
      (atributo) => atributo.nome === "class" && atributo.valor.split(/\s+/).includes(CLASSE_ESCONDER),
    );
    const antes = () => aoSelecionar(no.caminho, "arvore");
    return {
      podeEditar: podeEditarTexto(no),
      podeEsconder: elemento,
      podeApagar: no.caminho.length > 0,
      podeDuplicar: elemento && no.caminho.length > 0,
      podeRenomear: podeRenomear(no),
      escondido,
      editar: () => {
        antes();
        comecarEdicao({ chave: no.chave, alvo: "texto" });
      },
      esconder: () => {
        antes();
        aoEsconder(no.caminho);
        recipiente.current?.focus();
      },
      apagar: () => {
        antes();
        aoApagar(no.caminho);
        recipiente.current?.focus();
      },
      duplicar: () => {
        antes();
        aoDuplicar(no.caminho);
        recipiente.current?.focus();
      },
      renomear: () => {
        antes();
        comecarEdicao({ chave: no.chave, alvo: "tag" });
      },
      podeAdicionarAtributo: elemento,
      adicionarAtributo: aoAdicionarAtributos
        ? () => {
            antes();
            comecarEdicao({ chave: no.chave, alvo: "novoAtributo" });
          }
        : undefined,
    };
  };

  const selecionarPorTeclado = (no: NoArvore) => {
    aoSelecionar(no.caminho, "teclado");
    aoPassarMouse(no.no);
  };

  const abrirMenuNoSelecionado = (no: NoArvore) => {
    const linha = recipiente.current?.querySelector(`[data-chave="${no.chave}"]`)?.getBoundingClientRect();
    if (linha) setMenu({ x: linha.left + 24, y: linha.bottom, chave: no.chave });
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (edicao || nos.length === 0) return;
    if (evento.target instanceof HTMLElement && evento.target.closest("[data-barra-acoes], input")) return;
    const atual = indiceSelecionado >= 0 ? nos[indiceSelecionado].no : null;
    const semModificador = !evento.ctrlKey && !evento.metaKey && !evento.altKey;

    // Atalhos do F12: H esconde, Delete apaga, Shift+Alt+seta para baixo duplica.
    if (atual && (evento.key === "h" || evento.key === "H") && semModificador && !evento.shiftKey) {
      if (atual.tipo === "elemento") aoEsconder(atual.caminho);
      evento.preventDefault();
      return;
    }
    if (atual && (evento.key === "Delete" || evento.key === "Backspace") && semModificador) {
      if (atual.caminho.length > 0) aoApagar(atual.caminho);
      evento.preventDefault();
      return;
    }
    if (atual && evento.key === "ArrowDown" && evento.shiftKey && evento.altKey) {
      if (atual.tipo === "elemento" && atual.caminho.length > 0) aoDuplicar(atual.caminho);
      evento.preventDefault();
      return;
    }
    if (atual && (evento.key === "ContextMenu" || (evento.key === "F10" && evento.shiftKey))) {
      abrirMenuNoSelecionado(atual);
      evento.preventDefault();
      return;
    }

    switch (evento.key) {
      case "ArrowDown": {
        const proximo = nos[Math.min(indiceSelecionado + 1, nos.length - 1)];
        selecionarPorTeclado(proximo.no);
        break;
      }
      case "ArrowUp": {
        const anterior = nos[Math.max(indiceSelecionado - 1, 0)];
        selecionarPorTeclado(anterior.no);
        break;
      }
      case "Home":
        selecionarPorTeclado(nos[0].no);
        break;
      case "End":
        selecionarPorTeclado(nos[nos.length - 1].no);
        break;
      case "ArrowRight":
        if (!atual) selecionarPorTeclado(nos[0].no);
        else if (atual.filhos.length > 0 && recolhidos.has(atual.chave)) aoAlternar(atual.chave, false);
        else if (atual.filhos.length > 0) selecionarPorTeclado(atual.filhos[0]);
        break;
      case "ArrowLeft":
        if (!atual) selecionarPorTeclado(nos[0].no);
        else if (atual.filhos.length > 0 && !recolhidos.has(atual.chave)) aoAlternar(atual.chave, true);
        else if (atual.caminho.length > 0) {
          const pai = nos.find((linha) => linha.no.chave === chaveDoCaminho(atual.caminho.slice(0, -1)));
          if (pai) selecionarPorTeclado(pai.no);
        }
        break;
      case "Enter":
      case "F2":
        if (atual && podeEditarTexto(atual)) comecarEdicao({ chave: atual.chave, alvo: "texto" });
        break;
      default:
        return;
    }
    evento.preventDefault();
  };

  if (!raiz) {
    return <div className="p-4 text-sm text-texto-suave">Carregando a página...</div>;
  }

  return (
    <div
      ref={recipiente}
      role="tree"
      tabIndex={0}
      aria-label="Árvore de elementos da página. Setas navegam, Enter edita o texto, dois cliques no nome da tag renomeiam, H esconde, Delete apaga."
      aria-activedescendant={indiceSelecionado >= 0 ? nos[indiceSelecionado].id : undefined}
      onKeyDown={aoTeclar}
      onMouseLeave={() => aoPassarMouse(null)}
      onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget)) aoPassarMouse(null);
      }}
      className="h-full overflow-auto px-2 py-2 font-codigo text-[13px] leading-6 focus-visible:outline-offset-[-3px]"
    >
      {doctype && (
        <div data-doctype className="whitespace-nowrap text-texto-suave">
          &lt;!DOCTYPE {doctype}&gt;
        </div>
      )}
      {linhas.map((linha) => {
        if (linha.tipo === "fechamento") {
          return (
            <LinhaFechamento
              key={linha.id}
              linha={linha}
              selecionada={linha.no.chave === chaveSelecionada}
              rascunhoTag={edicao?.alvo === "tag" && edicao.chave === linha.no.chave ? rascunhoTag : null}
              aoClicar={() => {
                aoSelecionar(linha.no.caminho, "arvore");
                recipiente.current?.focus();
              }}
              aoPassarMouse={() => aoPassarMouse(linha.no.no)}
            />
          );
        }
        const chave = linha.no.chave;
        const selecionada = chave === chaveSelecionada;
        return (
          <LinhaNo
            key={linha.id}
            linha={linha}
            recolhido={recolhidos.has(chave)}
            selecionada={selecionada}
            destaque={chave === chaveDestaque && destaque ? destaque.parte : null}
            edicao={edicao}
            rascunhoTag={edicao?.alvo === "tag" && edicao.chave === chave ? rascunhoTag : null}
            barra={
              toque && selecionada && !edicao ? (
                <BarraAcoesNo
                  acoes={acoesDo(linha.no)}
                  podeDesfazer={podeDesfazer}
                  podeRefazer={podeRefazer}
                  aoDesfazer={aoDesfazer}
                  aoRefazer={aoRefazer}
                />
              ) : undefined
            }
            aoClicar={() => {
              aoSelecionar(linha.no.caminho, "arvore");
              if (!edicao) recipiente.current?.focus();
            }}
            aoPassarMouse={() => aoPassarMouse(linha.no.no)}
            aoAlternar={() => aoAlternar(chave, !recolhidos.has(chave))}
            aoPedirMenu={(x, y) => {
              aoSelecionar(linha.no.caminho, "arvore");
              setMenu({ x, y, chave });
            }}
            aoIniciarEdicao={(nova) => {
              aoSelecionar(linha.no.caminho, "arvore");
              comecarEdicao(nova);
            }}
            aoCancelarEdicao={terminarEdicao}
            aoConfirmarTexto={(alvo, texto) => {
              terminarEdicao();
              aoEditarTexto(alvo.caminho, texto);
            }}
            aoConfirmarAtributo={(alvo, nome, valor) => {
              terminarEdicao();
              aoEditarAtributo(alvo.caminho, nome, valor);
            }}
            aoConfirmarNovoAtributo={(alvo, texto) => {
              terminarEdicao();
              if (texto.trim().length > 0) aoAdicionarAtributos?.(alvo.caminho, texto);
            }}
            aoConfirmarTag={(alvo, novaTag) => {
              terminarEdicao();
              aoRenomearTag(alvo.caminho, novaTag);
            }}
            aoDigitarTag={setRascunhoTag}
          />
        );
      })}
      {menu && noDoMenu && (
        <MenuNo
          x={menu.x}
          y={menu.y}
          rotulo={rotuloDo(noDoMenu)}
          acoes={acoesDo(noDoMenu)}
          mostrarAtalhos={!toque}
          aoFechar={fecharMenu}
        />
      )}
    </div>
  );
}
