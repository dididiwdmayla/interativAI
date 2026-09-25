"use client";

import type { NoArvore } from "@/lib/arvore";
import { TAGS_SEM_RENOMEAR } from "@/motor/nucleoPainel";
import { TextoEditavel } from "./TextoEditavel";
import type { EdicaoArvore } from "./tipos";

type Props = {
  no: NoArvore;
  edicao: EdicaoArvore | null;
  aoIniciarAtributo: (nome: string) => void;
  aoConfirmarAtributo: (nome: string, valor: string) => void;
  /** O texto escrito no espaço do atributo novo (ex.: target="_blank"). */
  aoConfirmarNovoAtributo: (texto: string) => void;
  /** Dois cliques no nome da tag (como no F12). */
  aoIniciarTag: () => void;
  aoConfirmarTag: (novaTag: string) => void;
  /** Enquanto digita o nome novo: o fechamento da tag acompanha. */
  aoDigitarTag: (rascunho: string) => void;
  aoCancelar: () => void;
};

/** <tag atributo="valor"> com as cores de sintaxe do tema. */
export function TagAbertura({
  no,
  edicao,
  aoIniciarAtributo,
  aoConfirmarAtributo,
  aoConfirmarNovoAtributo,
  aoIniciarTag,
  aoConfirmarTag,
  aoDigitarTag,
  aoCancelar,
}: Props) {
  const podeRenomear = no.caminho.length > 0 && !TAGS_SEM_RENOMEAR.has(no.tag);
  const editandoTag = edicao?.alvo === "tag" && edicao.chave === no.chave;
  const novoAtributo = edicao?.alvo === "novoAtributo" && edicao.chave === no.chave;
  return (
    <span className="text-codigo-tag">
      &lt;
      {podeRenomear ? (
        <TextoEditavel
          valor={no.tag}
          editando={editandoTag}
          rotulo={`Nome da tag ${no.tag}`}
          titulo="Dois cliques para renomear a tag"
          className="text-codigo-tag"
          confirmarComEspaco
          aoDigitar={aoDigitarTag}
          aoIniciar={aoIniciarTag}
          aoConfirmar={aoConfirmarTag}
          aoCancelar={aoCancelar}
        />
      ) : (
        no.tag
      )}
      {no.atributos.map((atributo) => {
        const editando =
          edicao?.alvo === "atributo" && edicao.chave === no.chave && edicao.nome === atributo.nome;
        return (
          <span key={atributo.nome}>
            {" "}
            <span className="text-codigo-atributo">{atributo.nome}</span>
            <span className="text-codigo-texto">=</span>
            <span className="text-codigo-valor">
              &quot;
              <TextoEditavel
                valor={atributo.valor}
                editando={editando}
                rotulo={`Valor do atributo ${atributo.nome} de ${no.tag}`}
                className="text-codigo-valor"
                aoIniciar={() => aoIniciarAtributo(atributo.nome)}
                aoConfirmar={(valor) => aoConfirmarAtributo(atributo.nome, valor)}
                aoCancelar={aoCancelar}
              />
              &quot;
            </span>
          </span>
        );
      })}
      {novoAtributo && (
        <span data-atributo-novo>
          {" "}
          <TextoEditavel
            valor=""
            editando
            rotulo={`Atributo novo de ${no.tag} (nome="valor")`}
            className="text-codigo-atributo"
            crescerDesde={16}
            aoIniciar={() => {}}
            aoConfirmar={aoConfirmarNovoAtributo}
            aoCancelar={aoCancelar}
          />
        </span>
      )}
      &gt;
    </span>
  );
}
