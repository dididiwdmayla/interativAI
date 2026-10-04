"use client";

import { clienteDe } from "@/motor/contrato/clientes";
import type { DadosContrato } from "@/motor/contrato/modelo";
import { Cliente } from "./Cliente";
import { BotaoDocumento } from "./DocumentoCliente";

/** Em cima do checklist do contrato: quem contratou e o botão para reler o pedido. */
export function CabecalhoContrato({ contrato, aoAbrirDocumento }: { contrato: DadosContrato; aoAbrirDocumento: () => void }) {
  const cliente = clienteDe(contrato.cliente);
  return (
    <div className="mb-1 flex items-center gap-2 border-b-2 border-dashed border-borda pb-1.5" data-cabecalho-contrato>
      <Cliente id={contrato.cliente} expressao="feliz" tamanho={36} className="shrink-0" />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-black text-texto">{contrato.projeto}</p>
        <p className="truncate text-xs font-bold text-texto-suave">
          {cliente.nome} · {cliente.negocio}
        </p>
      </div>
      <BotaoDocumento cliente={contrato.cliente} aoAbrir={aoAbrirDocumento} compacto />
    </div>
  );
}
