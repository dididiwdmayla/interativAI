"use client";

/*
 * A mesa de cores: a cor em hexadecimal, dois dígitos de vermelho, dois de
 * verde e dois de azul. Cada canal aparece sozinho, com a amostra dele (o
 * vermelho puro, o verde puro, o azul puro na força de agora), os dois
 * dígitos com setinhas (0 a f, dando a volta) e um controle deslizante.
 * Com uma cor pedida (o objetivo, a parte do desafio ou a amostra), cada
 * canal mostra a régua até o alvo e diz se está certo, abaixo ou acima:
 * quem errou o tom vê qual canal está longe. Embaixo, a cor combinada ao
 * lado do alvo, o pedacinho de CSS e um botão de exemplo (a ponte com a
 * Ilha Sites). A cor montada pelo aluno é dado do conteúdo, não do tema: é
 * a exceção das cores, como os sites-alvo fictícios.
 */
import { IconeCerto } from "@/componentes/icones/IconeCerto";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { canaisNoAlvo, type SituacaoDoCanal } from "@/motor/exposicao/alvoDaCor";
import { canaisDaCor, type EstacaoCor as DadosCor, type EstadoCor, hexComDigito } from "@/motor/exposicao/modelo";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

const CANAIS = [
  { id: "r", nome: "vermelho", Nome: "Vermelho" },
  { id: "g", nome: "verde", Nome: "Verde" },
  { id: "b", nome: "azul", Nome: "Azul" },
] as const;

type IdCanal = (typeof CANAIS)[number]["id"];

/** Dois dígitos hexadecimais de um número de 0 a 255. */
function doisDigitos(valor: number): string {
  return valor.toString(16).padStart(2, "0");
}

/** A cor só daquele canal, na força dada (o vermelho puro de agora, por exemplo). */
function corDoCanal(canal: IdCanal, valor: number): string {
  const par = doisDigitos(valor);
  return canal === "r" ? `#${par}0000` : canal === "g" ? `#00${par}00` : `#0000${par}`;
}

/** Texto escuro ou claro em cima da cor (luminância simples). */
function textoSobre(hex: string): string {
  const { r, g, b } = canaisDaCor(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "var(--cor-ante-rosto)" : "var(--cor-ante-branco)";
}

const RECADO: Record<SituacaoDoCanal, string> = { certo: "no alvo", abaixo: "falta subir", acima: "passou do alvo" };

type Props = PropsEstacao<DadosCor, EstadoCor> & {
  /** A cor pedida agora (do objetivo ou da parte do desafio); sem ela, vale a amostra da estação. */
  alvo?: string;
};

export function EstacaoCor({ estacao, estado, mexer, destaque, alvo: alvoPedido }: Props) {
  const canais = canaisDaCor(estado.hex);
  const digitos = estado.hex.slice(1).split("");
  const alvo = alvoPedido ?? estacao.amostra?.valor ?? null;
  const noAlvo = alvo ? canaisNoAlvo(estado.hex, alvo) : null;
  const igual = noAlvo !== null && CANAIS.every((canal) => noAlvo[canal.id].situacao === "certo");
  const trocar = (posicao: number, delta: 1 | -1) =>
    mexer({
      tipo: "definirCor",
      estacao: estacao.id,
      valor: hexComDigito(estado.hex, posicao, delta),
    });
  /** O controle deslizante de um canal: o par de dígitos dele vira o valor escolhido. */
  const deslizar = (canal: IdCanal, valor: number) => {
    const novo = { ...canais, [canal]: Math.max(0, Math.min(255, Math.round(valor))) };
    mexer({ tipo: "definirCor", estacao: estacao.id, valor: `#${doisDigitos(novo.r)}${doisDigitos(novo.g)}${doisDigitos(novo.b)}` });
  };
  return (
    <div className="flex flex-col items-center gap-3" data-estacao-cor={estacao.id} data-cor={estado.hex} data-alvo-cor={alvo ?? undefined}>
      <NucleoDaEstacao tipo="cor" className="w-full max-w-md">
        <div className="grid w-full grid-cols-3 gap-1.5 sm:gap-2" aria-label="Os três canais da cor">
          {CANAIS.map((canal, c) => {
            const valor = canais[canal.id];
            const situacao = noAlvo?.[canal.id];
            return (
              <div
                key={canal.id}
                className={`flex min-w-0 flex-col items-center gap-1 rounded-xl border-2 bg-superficie px-1 pb-2 pt-1.5 ${
                  destaque?.peca === canal.id
                    ? "animate-pulse border-destaque ring-4 ring-destaque"
                    : situacao?.situacao === "certo"
                      ? "border-sucesso"
                      : situacao
                        ? "border-alerta"
                        : "border-borda"
                }`}
                data-canal={canal.id}
                data-situacao-canal={situacao?.situacao}
              >
                <span className="text-[11px] font-black uppercase tracking-wide text-texto-suave">{canal.Nome}</span>
                {/* O canal sozinho: a cor dele na força de agora (e a do alvo, ao lado). */}
                <div className="flex w-full gap-1 px-1">
                  <div
                    className="h-9 flex-1 rounded-lg border-2 border-borda"
                    style={{ background: corDoCanal(canal.id, valor) }}
                    role="img"
                    aria-label={`O ${canal.nome} sozinho: ${valor} de 255`}
                    data-amostra-canal={canal.id}
                  />
                  {situacao && (
                    <div
                      className="h-9 w-4 shrink-0 rounded-md border-2 border-dashed border-borda"
                      style={{ background: corDoCanal(canal.id, situacao.alvo) }}
                      role="img"
                      aria-label={`O ${canal.nome} do alvo: ${situacao.alvo} de 255`}
                    />
                  )}
                </div>
                {/* Os dois dígitos do canal, com as setinhas. */}
                <div className="flex gap-0.5 font-codigo" aria-label={`Os dois dígitos do ${canal.nome}`}>
                  {[0, 1].map((d) => {
                    const posicao = c * 2 + d;
                    return (
                      <div key={d} className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => trocar(posicao, 1)}
                          aria-label={`Subir o dígito ${posicao + 1}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-texto-suave hover:bg-hover pointer-coarse:h-10 pointer-coarse:w-9"
                          data-subir-digito={posicao}
                        >
                          <IconeChevron direcao="cima" />
                        </button>
                        <span className="text-2xl font-black uppercase leading-none text-texto" data-digito={posicao}>
                          {digitos[posicao]}
                        </span>
                        <button
                          type="button"
                          onClick={() => trocar(posicao, -1)}
                          aria-label={`Descer o dígito ${posicao + 1}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-texto-suave hover:bg-hover pointer-coarse:h-10 pointer-coarse:w-9"
                          data-descer-digito={posicao}
                        >
                          <IconeChevron direcao="baixo" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <span className="text-xs font-black text-texto">{valor}</span>
                <input
                  type="range"
                  min={0}
                  max={255}
                  step={1}
                  value={valor}
                  onChange={(evento) => deslizar(canal.id, Number(evento.target.value))}
                  aria-label={`${canal.Nome}, de 0 a 255`}
                  aria-valuetext={`${valor}, ${doisDigitos(valor)} em hexadecimal`}
                  className="h-6 w-full min-w-0 accent-primaria pointer-coarse:h-9"
                  data-controle-canal={canal.id}
                />
                {situacao && (
                  <>
                    {/* A régua até o alvo: o risco é o alvo, a bolinha é a cor de agora. */}
                    <div className="relative mx-1 h-2 w-[calc(100%-0.5rem)] rounded-full bg-painel" aria-hidden="true">
                      <span className="absolute -top-1 h-4 w-1 -translate-x-1/2 rounded-full bg-texto" style={{ left: `${(situacao.alvo / 255) * 100}%` }} />
                      <span
                        className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-superficie ${situacao.situacao === "certo" ? "bg-sucesso" : "bg-alerta"}`}
                        style={{ left: `${(valor / 255) * 100}%` }}
                      />
                    </div>
                    <span
                      className={`flex items-center gap-1 text-center text-[11px] font-black leading-tight ${situacao.situacao === "certo" ? "text-sucesso" : "text-texto"}`}
                      data-recado-canal={canal.id}
                    >
                      {situacao.situacao === "certo" && <IconeCerto tamanho={11} />}
                      {RECADO[situacao.situacao]}
                      {situacao.situacao !== "certo" && <span className="font-codigo text-texto-suave">({doisDigitos(situacao.alvo)})</span>}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </NucleoDaEstacao>
      {/* A cor combinada (e o alvo, ao lado). */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <figure className="flex flex-col items-center gap-1">
          <div
            className="h-20 w-20 rounded-2xl border-4 border-borda shadow-[0_6px_0_var(--cor-sombra)]"
            style={{ background: estado.hex }}
            aria-label={`A cor montada: ${estado.hex}`}
            role="img"
            data-cor-combinada
          />
          <figcaption className="font-codigo text-sm font-black text-texto">{estado.hex}</figcaption>
        </figure>
        {alvo && (
          <figure className="flex flex-col items-center gap-1" data-cor-alvo>
            <div
              className={`h-14 w-14 rounded-xl border-2 ${igual ? "border-sucesso" : "border-dashed border-borda"}`}
              style={{ background: alvo }}
              aria-hidden="true"
            />
            <figcaption className="flex items-center gap-1 text-center text-[11px] font-black text-texto-suave">
              {igual && <IconeCerto tamanho={11} />}
              {alvoPedido ? "o alvo" : `pedida: ${estacao.amostra?.nome ?? ""}`} <span className="font-codigo">{alvo}</span>
            </figcaption>
          </figure>
        )}
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
