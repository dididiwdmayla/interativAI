"use client";

import { type ReactNode, useState } from "react";
import { IconeAviso } from "@/componentes/icones/IconeAviso";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { chamadasVar, type DeclaracaoNaCascata, type VariavelNoValor } from "@/motor/css/cascata";
import { CampoEstilo, type Saida } from "./CampoEstilo";
import { acharCor, hexDoSeletor, trocarCor } from "./cores";

type Props = {
  item: DeclaracaoNaCascata;
  editavel: boolean;
  toque: boolean;
  /** Qual campo está em edição agora, se algum. */
  editando: "nome" | "valor" | null;
  destacada: boolean;
  aoComecar: (campo: "nome" | "valor") => void;
  aoConfirmar: (campo: "nome" | "valor", texto: string, saida: Saida) => void;
  aoCancelar: () => void;
  /** O valor enquanto digita (a prévia mostra na hora). */
  aoMudarValor: (texto: string) => void;
  aoAlternar: () => void;
  /** Seletor de cor: `final` false enquanto arrasta, true ao escolher. */
  aoEscolherCor: (valor: string, final: boolean) => void;
  aoUsarSetas: () => void;
  /** Clique no nome de uma variável dentro do var(): leva até a declaração dela. */
  aoIrParaVariavel?: (variavel: VariavelNoValor) => void;
};

/**
 * O valor com cada var() desenhado como no Chrome (VariableRenderer do
 * devtools-frontend): "var(" + o nome como link (sublinhado; apagado se a
 * variável não existe) + a reserva + ")". O valor da variável aparece ao
 * passar o mouse (title), e o clique no nome leva até a declaração.
 */
function ValorComVariaveis({
  texto,
  variaveis,
  aoIrParaVariavel,
}: {
  texto: string;
  variaveis: readonly VariavelNoValor[];
  aoIrParaVariavel?: (variavel: VariavelNoValor) => void;
}) {
  const pedacos: ReactNode[] = [];
  let depois = 0;
  chamadasVar(texto).forEach((chamada, indice) => {
    const variavel = variaveis[indice];
    pedacos.push(texto.slice(depois, chamada.inicio));
    depois = chamada.fim;
    if (!variavel) {
      pedacos.push(texto.slice(chamada.inicio, chamada.fim));
      return;
    }
    const definida = variavel.valor !== null;
    const dica = definida
      ? `${variavel.nome}: ${variavel.valor}`
      : `${variavel.nome} não foi definida${variavel.usouReserva ? ": vale a reserva" : ""}`;
    pedacos.push(
      <span key={indice} title={dica}>
        var(
        <button
          type="button"
          data-var-link={variavel.nome}
          data-definida={definida ? "sim" : "nao"}
          aria-label={definida ? `Ir até a declaração de ${variavel.nome}, que vale ${variavel.valor}` : dica}
          disabled={!variavel.origem}
          onClick={(evento) => {
            evento.stopPropagation();
            if (variavel.origem) aoIrParaVariavel?.(variavel);
          }}
          className={`rounded underline decoration-dotted underline-offset-2 disabled:cursor-default pointer-coarse:py-1 ${
            definida ? "text-codigo-atributo hover:bg-hover" : "text-texto-suave opacity-70"
          }`}
        >
          {variavel.nome}
        </button>
        {variavel.reserva !== null && `, ${variavel.reserva}`})
      </span>,
    );
  });
  pedacos.push(texto.slice(depois));
  return <>{pedacos}</>;
}

const RISCADAS = new Set(["perdeu", "desligada", "invalida"]);

const TITULO_SITUACAO: Record<DeclaracaoNaCascata["situacao"], string> = {
  vence: "Está valendo",
  perdeu: "Perdeu para outra declaração (riscada)",
  desligada: "Desligada pela caixinha",
  invalida: "Valor inválido: o navegador ignora esta declaração",
  incerta: "Valendo, mas o motor do jogo não tem certeza de quem ganha aqui",
};

/** Uma declaração no painel Estilos: caixinha, nome, cor, valor e o riscado. */
export function LinhaDeclaracao({
  item,
  editavel,
  toque,
  editando,
  destacada,
  aoComecar,
  aoConfirmar,
  aoCancelar,
  aoMudarValor,
  aoAlternar,
  aoEscolherCor,
  aoUsarSetas,
  aoIrParaVariavel,
}: Props) {
  const [aberto, setAberto] = useState(false);
  const { declaracao, situacao } = item;
  const riscada = RISCADAS.has(situacao);
  const atalho = item.longas.length > 1;
  const comVariaveis = item.variaveis !== undefined && item.variaveis.length > 0;
  // Com var(), a cor vem do valor resolvido e a amostra só mostra (o nome da variável não é uma cor).
  const cor = declaracao.ativa && !comVariaveis ? acharCor(declaracao.valorBruto) : null;
  const corResolvida = declaracao.ativa && comVariaveis && item.valorResolvido ? acharCor(item.valorResolvido) : null;

  const nome =
    editando === "nome" ? (
      <CampoEstilo
        valorInicial={declaracao.propriedade}
        campo="nome"
        rotulo={`Nome da propriedade ${declaracao.propriedade}`}
        toque={toque}
        aoConfirmar={(texto, saida) => aoConfirmar("nome", texto, saida)}
        aoCancelar={aoCancelar}
      />
    ) : (
      <span
        role={editavel ? "button" : undefined}
        tabIndex={editavel ? 0 : undefined}
        data-nome-propriedade
        onClick={editavel ? () => aoComecar("nome") : undefined}
        onKeyDown={(evento) => {
          if (editavel && (evento.key === "Enter" || evento.key === "F2")) {
            evento.preventDefault();
            aoComecar("nome");
          }
        }}
        className={`text-codigo-atributo ${editavel ? "cursor-text rounded hover:bg-hover pointer-coarse:py-1" : ""}`}
      >
        {declaracao.propriedade}
      </span>
    );

  const valor =
    editando === "valor" ? (
      <CampoEstilo
        valorInicial={declaracao.valorBruto}
        campo="valor"
        rotulo={`Valor de ${declaracao.propriedade}`}
        toque={toque}
        aoMudar={aoMudarValor}
        aoConfirmar={(texto, saida) => aoConfirmar("valor", texto, saida)}
        aoCancelar={aoCancelar}
        aoUsarSetas={aoUsarSetas}
      />
    ) : (
      <span
        role={editavel ? "button" : undefined}
        tabIndex={editavel ? 0 : undefined}
        data-valor-propriedade
        onClick={editavel ? () => aoComecar("valor") : undefined}
        onKeyDown={(evento) => {
          if (editavel && (evento.key === "Enter" || evento.key === "F2")) {
            evento.preventDefault();
            aoComecar("valor");
          }
        }}
        className={`text-codigo-valor ${editavel ? "cursor-text rounded hover:bg-hover pointer-coarse:py-1" : ""}`}
      >
        {comVariaveis ? (
          <ValorComVariaveis texto={declaracao.valorBruto} variaveis={item.variaveis ?? []} aoIrParaVariavel={aoIrParaVariavel} />
        ) : (
          declaracao.valorBruto
        )}
      </span>
    );

  return (
    <li
      data-declaracao={declaracao.propriedade}
      data-situacao={situacao}
      title={TITULO_SITUACAO[situacao]}
      className={`rounded ${destacada ? "animate-[pulsar-no_1.1s_ease-in-out_infinite] bg-[var(--cor-codigo-destaque-linha)]" : ""}`}
    >
      <div className="flex min-h-6 items-center gap-1 pointer-coarse:min-h-11">
        {editavel ? (
          // No toque, a área de toque da caixinha tem 44px (o label em volta).
          <label className="grid shrink-0 place-items-center pointer-coarse:-my-1 pointer-coarse:h-11 pointer-coarse:w-11">
            <input
              type="checkbox"
              checked={declaracao.ativa}
              onChange={aoAlternar}
              aria-label={`${declaracao.ativa ? "Desligar" : "Ligar"} ${declaracao.propriedade}: ${declaracao.valorBruto}`}
              data-alternar-declaracao
              className={`h-3.5 w-3.5 accent-[var(--cor-primaria)] pointer-coarse:h-5 pointer-coarse:w-5 ${
                declaracao.ativa && !toque ? "opacity-0 focus:opacity-100 group-hover/bloco:opacity-100" : ""
              }`}
            />
          </label>
        ) : (
          <span className="w-3.5 shrink-0 pointer-coarse:w-11" aria-hidden="true" />
        )}
        <span className={`min-w-0 break-words ${riscada ? "text-texto-suave line-through decoration-2" : ""}`}>
          {nome}
          <span className="text-texto">: </span>
          {cor && editando !== "valor" && (
            <label
              // No toque, um ::before invisível aumenta a área de toque para 44px.
              className="relative mr-1 inline-block h-3 w-3 cursor-pointer rounded-sm border border-borda align-[-1px] pointer-coarse:h-5 pointer-coarse:w-5 pointer-coarse:before:absolute pointer-coarse:before:-inset-3 pointer-coarse:before:content-['']"
              style={{ backgroundColor: declaracao.valorBruto.slice(cor.inicio, cor.fim) }}
              title="Abrir o seletor de cor"
            >
              <input
                type="color"
                data-seletor-cor
                aria-label={`Escolher a cor de ${declaracao.propriedade}`}
                disabled={!editavel}
                value={hexDoSeletor(cor.rgba)}
                onInput={(evento) => aoEscolherCor(trocarCor(declaracao.valorBruto, cor, evento.currentTarget.value), false)}
                onChange={(evento) => aoEscolherCor(trocarCor(declaracao.valorBruto, cor, evento.currentTarget.value), true)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
          )}
          {corResolvida && editando !== "valor" && item.valorResolvido && (
            <span
              data-amostra-variavel
              aria-hidden="true"
              className="mr-1 inline-block h-3 w-3 rounded-sm border border-borda align-[-1px]"
              style={{ backgroundColor: item.valorResolvido.slice(corResolvida.inicio, corResolvida.fim) }}
            />
          )}
          {valor}
          <span className="text-texto">;</span>
          {comVariaveis && editando !== "valor" && (
            <span
              data-valor-resolvido
              title="O valor com as variáveis trocadas"
              className="ml-1.5 rounded bg-painel px-1 font-codigo text-[11px] not-italic text-texto-suave"
            >
              {item.valorResolvido ?? "inválido: vale o herdado ou o inicial"}
            </span>
          )}
        </span>
        {situacao === "invalida" && <IconeAviso className="shrink-0 text-alerta" />}
        {atalho && (
          <button
            type="button"
            aria-expanded={aberto}
            aria-label={aberto ? `Esconder as partes de ${declaracao.propriedade}` : `Mostrar as partes de ${declaracao.propriedade}`}
            onClick={() => setAberto((valorAtual) => !valorAtual)}
            className="grid h-4 w-4 shrink-0 place-items-center rounded text-texto-suave hover:bg-hover pointer-coarse:h-11 pointer-coarse:w-11"
          >
            <IconeChevron direcao={aberto ? "baixo" : "direita"} tamanho={10} />
          </button>
        )}
      </div>
      {atalho && aberto && (
        <ul className="ml-6 border-l-2 border-borda pl-2" data-longas>
          {item.longas.map((longa) => (
            <li
              key={longa.propriedade}
              data-longa={longa.propriedade}
              data-situacao={longa.situacao}
              className={longa.situacao === "perdeu" ? "text-texto-suave line-through" : ""}
            >
              <span className="text-codigo-atributo">{longa.propriedade}</span>
              <span className="text-texto">: </span>
              <span className="text-codigo-valor">{longa.valor ?? "?"}</span>
              <span className="text-texto">;</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
