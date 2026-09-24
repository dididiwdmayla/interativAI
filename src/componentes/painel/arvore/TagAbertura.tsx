"use client";

import type { NoArvore } from "@/lib/arvore";
import { TextoEditavel } from "./TextoEditavel";
import type { EdicaoArvore } from "./tipos";

type Props = {
  no: NoArvore;
  edicao: EdicaoArvore | null;
  aoIniciarAtributo: (nome: string) => void;
  aoConfirmarAtributo: (nome: string, valor: string) => void;
  aoCancelar: () => void;
};

/** <tag atributo="valor"> com as cores de sintaxe do tema. */
export function TagAbertura({ no, edicao, aoIniciarAtributo, aoConfirmarAtributo, aoCancelar }: Props) {
  return (
    <span className="text-codigo-tag">
      &lt;{no.tag}
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
      &gt;
    </span>
  );
}
