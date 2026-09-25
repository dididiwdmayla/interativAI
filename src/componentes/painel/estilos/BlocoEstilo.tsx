"use client";

import { Fragment } from "react";
import { type Bloco, type DeclaracaoNaCascata, NOME_FOLHA_DO_JOGO } from "@/motor/css/cascata";
import { formatarEspecificidade } from "@/motor/css/especificidade";
import { CampoEstilo, type Saida } from "./CampoEstilo";
import { LinhaDeclaracao } from "./LinhaDeclaracao";
import type { EdicaoEstilos } from "./tipos";

type Props = {
  bloco: Bloco;
  editavel: boolean;
  toque: boolean;
  /** A edição aberta, se for neste bloco. */
  edicao: EdicaoEstilos | null;
  /** Filtro do painel (nome ou valor que contém o texto). */
  filtro: string;
  /** Degrau 3 da ajuda: o bloco inteiro ou só uma declaração dele. */
  destaque: { propriedade?: string } | null;
  aoPassarSeletor: (entrando: boolean) => void;
  aoIrParaFonte: () => void;
  aoComecar: (alvo: number | "nova", campo: "nome" | "valor") => void;
  aoConfirmar: (alvo: number | "nova", campo: "nome" | "valor", texto: string, saida: Saida) => void;
  aoCancelar: () => void;
  aoMudarValor: (alvo: number | "nova", texto: string) => void;
  aoAlternar: (indice: number) => void;
  aoEscolherCor: (indice: number, valor: string, final: boolean) => void;
  aoUsarSetas: () => void;
};

function passaNoFiltro(item: DeclaracaoNaCascata, filtro: string): boolean {
  if (filtro.length === 0) return true;
  const texto = `${item.declaracao.propriedade}: ${item.declaracao.valorBruto}`.toLowerCase();
  return texto.includes(filtro);
}

/** Uma regra (ou o element.style) no painel Estilos, como uma seção do Chrome. */
export function BlocoEstilo({
  bloco,
  editavel,
  toque,
  edicao,
  filtro,
  destaque,
  aoPassarSeletor,
  aoIrParaFonte,
  aoComecar,
  aoConfirmar,
  aoCancelar,
  aoMudarValor,
  aoAlternar,
  aoEscolherCor,
  aoUsarSetas,
}: Props) {
  const doNavegador = bloco.folha?.origem === "navegador";
  const visiveis = bloco.declaracoes.filter((item) => passaNoFiltro(item, filtro));
  const editandoNova = edicao?.alvo === "nova";

  const fonte =
    bloco.tipo === "inline" ? null : bloco.folha?.origem === "folha" ? (
      <button
        type="button"
        data-fonte-regra
        onClick={aoIrParaFonte}
        title="Abrir no editor CSS, nesta linha"
        className="ml-auto shrink-0 rounded px-1 font-codigo text-[11px] text-texto-suave underline decoration-dotted hover:bg-hover hover:text-primaria pointer-coarse:min-h-11"
      >
        {NOME_FOLHA_DO_JOGO}:{bloco.regra?.linha}
      </button>
    ) : doNavegador ? (
      <span className="ml-auto shrink-0 font-codigo text-[11px] italic text-texto-suave" title="A folha de estilo que o navegador já traz">
        folha do navegador
      </span>
    ) : (
      <span className="ml-auto shrink-0 font-codigo text-[11px] text-texto-suave" title="Um <style> fixo desta página (não dá para editar nesta fase)">
        (index)
      </span>
    );

  const seletor =
    bloco.tipo === "inline" ? (
      <span className="text-texto">element.style</span>
    ) : (
      <span
        data-seletor-regra
        onMouseEnter={() => aoPassarSeletor(true)}
        onMouseLeave={() => aoPassarSeletor(false)}
        title={`Especificidade: ${formatarEspecificidade(bloco.especificidade)}`}
        className="cursor-default"
      >
        {bloco.seletores.map((parte, indice) => (
          <Fragment key={`${parte.texto}-${indice}`}>
            {indice > 0 && <span className="text-texto-suave">, </span>}
            <span className={parte.casa ? "text-codigo-tag" : "text-texto-suave opacity-60"}>{parte.texto}</span>
          </Fragment>
        ))}
        {bloco.condicoes.length > 0 && (
          <span className="ml-1 text-[11px] text-texto-suave">
            ({bloco.condicoes.map((condicao) => `@${condicao.tipo} ${condicao.texto}`).join(" ")})
          </span>
        )}
      </span>
    );

  return (
    <section
      data-bloco-estilo={bloco.id}
      data-origem={bloco.tipo === "inline" ? "inline" : bloco.folha?.origem}
      aria-label={bloco.tipo === "inline" ? "element.style" : `Regra ${bloco.seletorExibido}`}
      className={`group/bloco border-b border-borda px-2 py-1.5 font-codigo text-[12px] leading-5 pointer-coarse:text-[13px] ${
        doNavegador ? "bg-painel/60 italic" : ""
      } ${destaque && !destaque.propriedade ? "animate-[pulsar-no_1.1s_ease-in-out_infinite] bg-[var(--cor-codigo-destaque-linha)]" : ""}`}
    >
      <div className="flex items-start gap-2">
        <span className="min-w-0 break-words">
          {seletor}
          <span className="text-texto"> {"{"}</span>
        </span>
        {fonte}
      </div>
      <ul className="pl-1">
        {visiveis.map((item) => {
          const campo = edicao?.alvo === item.indice ? edicao.campo : null;
          return (
            <LinhaDeclaracao
              key={`${item.indice}-${item.declaracao.inicio}`}
              item={item}
              editavel={editavel}
              toque={toque}
              editando={campo}
              destacada={destaque?.propriedade === item.declaracao.propriedade}
              aoComecar={(qual) => aoComecar(item.indice, qual)}
              aoConfirmar={(qual, texto, saida) => aoConfirmar(item.indice, qual, texto, saida)}
              aoCancelar={aoCancelar}
              aoMudarValor={(texto) => aoMudarValor(item.indice, texto)}
              aoAlternar={() => aoAlternar(item.indice)}
              aoEscolherCor={(valor, final) => aoEscolherCor(item.indice, valor, final)}
              aoUsarSetas={aoUsarSetas}
            />
          );
        })}
        {editandoNova && edicao && (
          <li data-declaracao-nova className="flex min-h-6 items-center gap-1 pl-[18px] pointer-coarse:min-h-11">
            {edicao.campo === "nome" ? (
              <CampoEstilo
                key="nome"
                valorInicial=""
                campo="nome"
                rotulo="Nome da propriedade nova"
                toque={toque}
                aoConfirmar={(texto, saida) => aoConfirmar("nova", "nome", texto, saida)}
                aoCancelar={aoCancelar}
              />
            ) : (
              <>
                <span className="text-codigo-atributo">{edicao.nomeNovo}</span>
                <span className="text-texto">: </span>
                <CampoEstilo
                  key="valor"
                  valorInicial=""
                  campo="valor"
                  rotulo={`Valor de ${edicao.nomeNovo ?? "a propriedade nova"}`}
                  toque={toque}
                  aoMudar={(texto) => aoMudarValor("nova", texto)}
                  aoConfirmar={(texto, saida) => aoConfirmar("nova", "valor", texto, saida)}
                  aoCancelar={aoCancelar}
                  aoUsarSetas={aoUsarSetas}
                />
                <span className="text-texto">;</span>
              </>
            )}
          </li>
        )}
      </ul>
      <div className="flex items-center">
        <span className="text-texto">{"}"}</span>
        {editavel && !editandoNova && (
          <button
            type="button"
            data-adicionar-declaracao
            onClick={() => aoComecar("nova", "nome")}
            aria-label={`Acrescentar uma declaração em ${bloco.seletorExibido}`}
            title="Acrescentar uma declaração"
            className="ml-2 min-h-5 flex-1 rounded text-left font-ui text-[11px] font-bold text-texto-suave opacity-0 hover:bg-hover hover:opacity-100 focus:opacity-100 group-hover/bloco:opacity-100 pointer-coarse:min-h-11 pointer-coarse:opacity-100"
          >
            + declaração
          </button>
        )}
      </div>
    </section>
  );
}
