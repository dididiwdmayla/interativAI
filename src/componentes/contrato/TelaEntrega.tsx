"use client";

import { type ReactNode, useState } from "react";
import { Carinha } from "@/componentes/mascote/Carinha";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import { clienteDe } from "@/motor/contrato/clientes";
import { type DadosContrato, type RelatorioEntrega, textoDoTempoDeTrabalho } from "@/motor/contrato/modelo";
import { FalaDoCliente } from "./FalaDoCliente";
import { useTextoDigitado } from "./useTextoDigitado";

function Marca({ ok }: { ok: boolean }) {
  return ok ? <Carinha variante="feliz" tom="sucesso" tamanho={18} rotulo="Atendido" /> : <Carinha variante="surpresa" tom="suave" tamanho={18} rotulo="Faltou" />;
}

/** O relatório automático: sai do checklist e dos testes, sem o aluno escrever nada. */
export function Relatorio({ relatorio, contrato }: { relatorio: RelatorioEntrega; contrato: DadosContrato }) {
  const cliente = clienteDe(contrato.cliente);
  const atendidos = relatorio.requisitos.filter((item) => item.atendido).length;
  return (
    <article className="rounded-2xl border-2 border-borda bg-superficie px-4 py-3 shadow-[0_3px_0_var(--cor-borda)]" data-relatorio>
      <header className="mb-2 border-b-2 border-dashed border-borda pb-2">
        <p className="text-xs font-black uppercase tracking-wide text-texto-suave">Relatório de entrega</p>
        <h3 className="text-lg font-black text-primaria">{relatorio.projeto}</h3>
        <p className="text-xs font-bold text-texto-suave">
          Para {cliente.nome} · {cliente.negocio}
        </p>
      </header>
      <section>
        <h4 className="text-sm font-black text-texto">
          Requisitos atendidos: {atendidos} de {relatorio.requisitos.length}
        </h4>
        <ul className="mt-1 space-y-1" data-relatorio-requisitos>
          {relatorio.requisitos.map((item) => (
            <li key={item.descricao} className="flex items-start gap-2 text-sm leading-5 text-texto">
              <span className="mt-0.5 shrink-0">
                <Marca ok={item.atendido} />
              </span>
              <span>
                {item.descricao}
                {item.mudou && <span className="ml-1 rounded-full bg-secundaria px-1.5 text-[10px] font-black uppercase text-sobre-secundaria">Pedido novo</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-3 grid gap-2 sm:grid-cols-3" data-relatorio-numeros>
        {relatorio.cenarios > 0 && (
          <div className="rounded-xl border-2 border-borda bg-painel px-3 py-2">
            <p className="text-2xl font-black text-primaria">{relatorio.cenarios}</p>
            <p className="text-xs font-bold text-texto-suave">{relatorio.cenarios === 1 ? "dia de teste na cena, passando" : "dias de teste na cena, todos passando"}</p>
          </div>
        )}
        {relatorio.casos && (
          <div className="rounded-xl border-2 border-borda bg-painel px-3 py-2" data-relatorio-casos>
            <p className="text-2xl font-black text-primaria">
              {relatorio.casos.passando} de {relatorio.casos.total}
            </p>
            <p className="text-xs font-bold text-texto-suave">casos de teste seus passando</p>
          </div>
        )}
        <div className="rounded-xl border-2 border-borda bg-painel px-3 py-2">
          <p className="text-2xl font-black text-primaria" data-relatorio-tempo>
            {textoDoTempoDeTrabalho(relatorio.tempoMs)}
          </p>
          <p className="text-xs font-bold text-texto-suave">de trabalho</p>
        </div>
      </section>
      {relatorio.processo.length > 0 && (
        <section className="mt-3">
          <h4 className="text-xs font-black uppercase tracking-wide text-texto-suave">Como foi feito</h4>
          <ul className="mt-1 space-y-1">
            {relatorio.processo.map((item) => (
              <li key={item.descricao} className="flex items-start gap-2 text-sm leading-5 text-texto-suave">
                <span className="mt-0.5 shrink-0">
                  <Marca ok={item.atendido} />
                </span>
                {item.descricao}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

type Props = {
  aberta: boolean;
  contrato: DadosContrato;
  relatorio: RelatorioEntrega;
  /** O cliente gostou: a fase conclui (a comemoração e o Levar pro mundo vêm depois). */
  aoEntregar: () => void;
  /** O que vem depois da reação do cliente (a comemoração), antes do fim. */
  comemoracao?: ReactNode;
};

/** A reação do cliente, fala por fala. */
function Reacao({ contrato, aoTerminar }: { contrato: DadosContrato; aoTerminar: () => void }) {
  const [indice, setIndice] = useState(0);
  const fala = contrato.entrega.reacao[indice];
  const { mostrado, completo, completar } = useTextoDigitado(fala.texto);
  const ultima = indice >= contrato.entrega.reacao.length - 1;
  return (
    <FalaDoCliente cliente={contrato.cliente} fala={fala} mostrado={mostrado} falando={!completo}>
      <Botao
        onClick={() => {
          if (!completo) completar();
          else if (!ultima) setIndice(indice + 1);
          else aoTerminar();
        }}
        data-reacao-continuar
      >
        Continuar
      </Botao>
    </FalaDoCliente>
  );
}

/**
 * A entrega: o relatório automático (requisitos atendidos, testes, tempo),
 * o botão de enviar ao cliente e a reação dele. Depois, a comemoração de fim
 * de ilha e o Levar pro mundo (na conclusão).
 */
export function TelaEntrega({ aberta, contrato, relatorio, aoEntregar, comemoracao }: Props) {
  const [momento, setMomento] = useState<"relatorio" | "reacao" | "comemoracao">("relatorio");
  return (
    <Modal aberto={aberta} titulo="Entrega do trabalho" aoFechar={() => undefined} className="max-w-2xl">
      <div className="flex flex-col gap-3" data-entrega={momento}>
        {momento === "relatorio" && (
          <>
            <Relatorio relatorio={relatorio} contrato={contrato} />
            <div className="flex flex-wrap justify-end gap-2">
              <Botao onClick={() => setMomento("reacao")} data-enviar-relatorio>
                Enviar para {clienteDe(contrato.cliente).nome}
              </Botao>
            </div>
          </>
        )}
        {momento === "reacao" && <Reacao contrato={contrato} aoTerminar={() => (comemoracao ? setMomento("comemoracao") : aoEntregar())} />}
        {momento === "comemoracao" && (
          <>
            {comemoracao}
            <div className="flex justify-end">
              <Botao onClick={aoEntregar} data-fim-entrega>
                Fechar o contrato
              </Botao>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
