"use client";

/*
 * A mesa de cores: a cor em hexadecimal, dois dígitos de vermelho, dois de
 * verde e dois de azul. Cada dígito sobe e desce de 0 a f (dando a volta);
 * a cor e o pedacinho de CSS mudam na hora, e um botão de exemplo usa a cor
 * (a ponte com a Ilha Sites). A cor montada pelo aluno é dado do conteúdo,
 * não do tema: é a exceção das cores, como os sites-alvo fictícios.
 */
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { canaisDaCor, type EstacaoCor as DadosCor, type EstadoCor, hexComDigito } from "@/motor/exposicao/modelo";
import type { PropsEstacao } from "./tipos";

const CANAIS = [
  { id: "r", nome: "vermelho" },
  { id: "g", nome: "verde" },
  { id: "b", nome: "azul" },
] as const;

/** Texto escuro ou claro em cima da cor (luminância simples). */
function textoSobre(hex: string): string {
  const { r, g, b } = canaisDaCor(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "var(--cor-ante-rosto)" : "var(--cor-ante-branco)";
}

export function EstacaoCor({ estacao, estado, mexer, destaque }: PropsEstacao<DadosCor, EstadoCor>) {
  const canais = canaisDaCor(estado.hex);
  const digitos = estado.hex.slice(1).split("");
  const trocar = (posicao: number, delta: 1 | -1) => mexer({ tipo: "definirCor", estacao: estacao.id, valor: hexComDigito(estado.hex, posicao, delta) });
  return (
    <div className="flex flex-col items-center gap-3" data-estacao-cor={estacao.id} data-cor={estado.hex}>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="h-24 w-24 rounded-2xl border-4 border-borda shadow-[0_6px_0_var(--cor-sombra)]" style={{ background: estado.hex }} aria-label={`A cor montada: ${estado.hex}`} role="img" />
        {estacao.amostra && (
          <figure className="flex flex-col items-center gap-1">
            <div className="h-12 w-12 rounded-xl border-2 border-borda" style={{ background: estacao.amostra.valor }} aria-hidden="true" />
            <figcaption className="text-center text-[11px] font-black text-texto-suave">
              pedida: {estacao.amostra.nome}
            </figcaption>
          </figure>
        )}
      </div>
      <div className="flex items-end gap-1 font-codigo" aria-label="Os seis dígitos da cor">
        <span className="pb-9 text-2xl font-black text-texto-suave">#</span>
        {CANAIS.map((canal, c) => (
          <div key={canal.id} className={`flex flex-col items-center rounded-xl border-2 px-1 pb-1 ${destaque?.peca === canal.id ? "animate-pulse border-destaque ring-4 ring-destaque" : "border-borda"}`} data-canal={canal.id}>
            <div className="flex gap-0.5">
              {[0, 1].map((d) => {
                const posicao = c * 2 + d;
                return (
                  <div key={d} className="flex flex-col items-center">
                    <button type="button" onClick={() => trocar(posicao, 1)} aria-label={`Subir o dígito ${posicao + 1}`} className="grid h-8 w-9 place-items-center rounded-lg text-texto-suave hover:bg-hover pointer-coarse:h-10" data-subir-digito={posicao}>
                      <IconeChevron direcao="cima" />
                    </button>
                    <span className="text-2xl font-black uppercase text-texto" data-digito={posicao}>
                      {digitos[posicao]}
                    </span>
                    <button type="button" onClick={() => trocar(posicao, -1)} aria-label={`Descer o dígito ${posicao + 1}`} className="grid h-8 w-9 place-items-center rounded-lg text-texto-suave hover:bg-hover pointer-coarse:h-10" data-descer-digito={posicao}>
                      <IconeChevron direcao="baixo" />
                    </button>
                  </div>
                );
              })}
            </div>
            <span className="font-ui text-[11px] font-black text-texto-suave">{canal.nome}</span>
            <span className="font-ui text-xs font-black text-texto">{canais[canal.id]}</span>
          </div>
        ))}
      </div>
      <div className="flex w-full max-w-md flex-wrap items-center gap-3 rounded-2xl border-2 border-borda bg-codigo-fundo p-3">
        <pre className="min-w-0 flex-1 font-codigo text-sm leading-snug text-codigo-texto" aria-label="O CSS que usa a cor">
          <span className="text-codigo-tag">{estacao.css.seletor}</span> {"{"}
          {"\n  "}
          <span className="text-codigo-atributo">{estacao.css.propriedade}</span>: <span className="text-codigo-valor">{estado.hex}</span>;{"\n"}
          {"}"}
        </pre>
        <span
          className="rounded-xl border-2 border-borda px-4 py-2 text-sm font-black"
          style={estacao.css.propriedade === "background" ? { background: estado.hex, color: textoSobre(estado.hex) } : { color: estado.hex }}
          aria-hidden="true"
        >
          Exemplo
        </span>
      </div>
    </div>
  );
}
