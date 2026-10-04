"use client";

import { useState } from "react";
import { Carinha } from "@/componentes/mascote/Carinha";
import { Mascote } from "@/componentes/mascote/Mascote";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import { tocarEfeito } from "@/audio/motor";
import {
  type CartaoRequisito,
  type ConferenciaRequisitos,
  type DadosContrato,
  type EscolhaRequisitos,
  falaDaConferencia,
  pedacosDoCartao,
  type SituacaoCartao,
  TENTATIVAS_ANTES_DE_MOSTRAR,
} from "@/motor/contrato/modelo";
import { FolhaDocumento } from "./DocumentoCliente";

type Props = {
  aberta: boolean;
  contrato: DadosContrato;
  /** A escolha da última conferência (para voltar como estava). */
  escolhaSalva: EscolhaRequisitos | null;
  tentativas: number;
  /** Confere a lista (o motor decide se segue para o trabalho). */
  aoConferir: (escolha: EscolhaRequisitos) => ConferenciaRequisitos | null;
};

const ROTULO_SITUACAO: Partial<Record<SituacaoCartao, string>> = {
  faltou: "Ficou de fora",
  sobrou: "Ele só comentou",
  lacuna: "A lacuna não bate",
};

/** Um cartão: tocar põe ou tira da lista; as lacunas viram botões com as opções. */
function Cartao({
  cartao,
  escolhido,
  respostas,
  situacao,
  aoAlternar,
  aoResponder,
}: {
  cartao: CartaoRequisito;
  escolhido: boolean;
  respostas: readonly number[];
  situacao: SituacaoCartao | null;
  aoAlternar: () => void;
  aoResponder: (lacuna: number, opcao: number) => void;
}) {
  const pedacos = pedacosDoCartao(cartao);
  const errado = situacao === "faltou" || situacao === "sobrou" || situacao === "lacuna";
  return (
    <li
      className={`rounded-2xl border-2 px-3 py-2 transition ${escolhido ? "border-primaria bg-painel" : "border-borda bg-superficie"} ${errado ? "ring-2 ring-alerta" : ""}`}
      data-cartao-requisito={cartao.id}
      data-escolhido={escolhido ? "sim" : "nao"}
      data-situacao={situacao ?? ""}
    >
      <button type="button" onClick={aoAlternar} aria-pressed={escolhido} className="flex min-h-11 w-full items-start gap-2 text-left">
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center">
          {escolhido ? <Carinha variante="feliz" tom="primaria" tamanho={22} rotulo="Na lista" /> : <span className="h-5 w-5 rounded-md border-2 border-borda bg-superficie" />}
        </span>
        <span className="text-[15px] font-bold leading-snug text-texto">
          {pedacos.map((pedaco, indice) =>
            pedaco.tipo === "texto" ? (
              <span key={indice}>{pedaco.texto}</span>
            ) : (
              <span key={indice} className="mx-0.5 inline-block min-w-8 rounded-md border-b-2 border-dashed border-primaria px-1 text-center text-primaria">
                {respostas[pedaco.indice] !== undefined ? cartao.lacunas?.[pedaco.indice]?.opcoes[respostas[pedaco.indice]] : "___"}
              </span>
            ),
          )}
        </span>
      </button>
      {escolhido && (cartao.lacunas?.length ?? 0) > 0 && (
        <div className="mt-1 flex flex-col gap-1 pl-8">
          {(cartao.lacunas ?? []).map((lacuna, indiceLacuna) => (
            <div key={indiceLacuna} className="flex flex-wrap items-center gap-1.5" role="group" aria-label={`Complete a lacuna ${indiceLacuna + 1}`}>
              <span className="text-xs font-black uppercase tracking-wide text-texto-suave">Complete:</span>
              {lacuna.opcoes.map((opcao, indiceOpcao) => {
                const marcada = respostas[indiceLacuna] === indiceOpcao;
                return (
                  <button
                    key={opcao}
                    type="button"
                    onClick={() => aoResponder(indiceLacuna, indiceOpcao)}
                    aria-pressed={marcada}
                    data-lacuna={indiceLacuna}
                    data-opcao={opcao}
                    className={`min-h-11 min-w-11 rounded-full border-2 px-3 text-sm font-black transition ${marcada ? "border-primaria bg-primaria text-sobre-primaria" : "border-borda bg-superficie text-texto hover:border-primaria"}`}
                  >
                    {opcao}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {errado && (
        <p className="mt-1 pl-8 text-sm text-texto" data-porque>
          <span className="font-black text-alerta">{ROTULO_SITUACAO[situacao]}:</span> {cartao.porque}
        </p>
      )}
    </li>
  );
}

/**
 * A etapa de requisitos do contrato: "o que ele pediu de verdade?". O aluno
 * monta a lista entre cartões com distrações, completa as lacunas lendo o
 * documento e confere. Errou: o colega diz o que falta (sem dizer qual); a
 * partir da segunda vez, mostra os cartões errados e o porquê.
 */
export function TelaRequisitos({ aberta, contrato, escolhaSalva, tentativas, aoConferir }: Props) {
  const [escolha, setEscolha] = useState<EscolhaRequisitos>(() => escolhaSalva ?? { cartoes: [], lacunas: {} });
  const [conferencia, setConferencia] = useState<ConferenciaRequisitos | null>(null);
  const [lendo, setLendo] = useState(false);
  const mostrarErros = conferencia !== null && !conferencia.certo && tentativas >= TENTATIVAS_ANTES_DE_MOSTRAR;

  const alternar = (id: string) => {
    tocarEfeito("clique");
    setConferencia(null);
    setEscolha((atual) => ({ ...atual, cartoes: atual.cartoes.includes(id) ? atual.cartoes.filter((item) => item !== id) : [...atual.cartoes, id] }));
  };
  const responder = (id: string, lacuna: number, opcao: number) => {
    tocarEfeito("clique");
    setConferencia(null);
    setEscolha((atual) => {
      const respostas = [...(atual.lacunas[id] ?? [])];
      respostas[lacuna] = opcao;
      return { ...atual, lacunas: { ...atual.lacunas, [id]: respostas } };
    });
  };
  const conferir = () => {
    const resultado = aoConferir(escolha);
    if (!resultado) return;
    tocarEfeito(resultado.certo ? "acerto" : "erro");
    setConferencia(resultado);
  };

  return (
    <Modal aberto={aberta} titulo="Requisitos do trabalho" aoFechar={() => setLendo(false)} className="max-w-2xl">
      <div className="flex flex-col gap-3" data-requisitos>
        <div className="flex items-start gap-2">
          <Mascote expressao={conferencia ? (conferencia.certo ? "comemorando" : "pensativo") : "curioso"} tamanho={56} className="shrink-0" />
          <div className="min-w-0">
            <p className="text-xl font-black text-primaria">{contrato.requisitos.pergunta ?? "O que o cliente pediu de verdade?"}</p>
            <p className="text-sm font-bold text-texto" aria-live="polite" data-fala-requisitos>
              {conferencia
                ? falaDaConferencia(conferencia)
                : "Toque nos cartões que viram trabalho. Cliente fala de tudo um pouco: nem tudo o que ele disse é pedido. Complete as lacunas com o que está no documento."}
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Botao variante="secundario" tamanho="p" className="min-h-9" onClick={() => setLendo(!lendo)} aria-expanded={lendo} data-reler-documento>
            {lendo ? "Esconder o pedido" : "Reler o pedido"}
          </Botao>
        </div>
        {lendo && <FolhaDocumento contrato={contrato} mudou={false} />}
        <ul className="flex flex-col gap-2">
          {contrato.requisitos.cartoes.map((cartao) => (
            <Cartao
              key={cartao.id}
              cartao={cartao}
              escolhido={escolha.cartoes.includes(cartao.id)}
              respostas={escolha.lacunas[cartao.id] ?? []}
              situacao={mostrarErros ? (conferencia?.cartoes.find((item) => item.id === cartao.id)?.situacao ?? null) : null}
              aoAlternar={() => alternar(cartao.id)}
              aoResponder={(lacuna, opcao) => responder(cartao.id, lacuna, opcao)}
            />
          ))}
        </ul>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-texto-suave">{escolha.cartoes.length} na lista</span>
          <Botao onClick={conferir} disabled={escolha.cartoes.length === 0} data-conferir-requisitos>
            Conferir a lista
          </Botao>
        </div>
      </div>
    </Modal>
  );
}
