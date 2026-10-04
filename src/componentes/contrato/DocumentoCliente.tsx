"use client";

import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import { clienteDe, type IdCliente } from "@/motor/contrato/clientes";
import type { DadosContrato } from "@/motor/contrato/modelo";
import { Cliente } from "./Cliente";

type FolhaProps = {
  contrato: DadosContrato;
  /** A mudança de pedido já chegou: o adendo aparece no fim, destacado. */
  mudou: boolean;
};

/** O pedido por escrito: uma folha de papel com o que o cliente quer (e a mensagem da mudança, quando chega). */
export function FolhaDocumento({ contrato, mudou }: FolhaProps) {
  const cliente = clienteDe(contrato.cliente);
  return (
    <article className="rounded-2xl border-2 border-borda bg-superficie px-4 py-3 shadow-[0_3px_0_var(--cor-borda)]" data-documento-cliente data-com-adendo={mudou ? "sim" : "nao"}>
      <header className="mb-2 flex items-center gap-2 border-b-2 border-dashed border-borda pb-2">
        <Cliente id={contrato.cliente} expressao="feliz" tamanho={40} className="shrink-0" />
        <div className="min-w-0">
          <h3 className="text-base font-black text-primaria">{contrato.documento.titulo}</h3>
          <p className="text-xs font-bold text-texto-suave">
            {cliente.nome} · {cliente.negocio}
          </p>
        </div>
      </header>
      <div className="space-y-2 text-[15px] leading-relaxed text-texto">
        {contrato.documento.paragrafos.map((paragrafo) => (
          <p key={paragrafo}>{paragrafo}</p>
        ))}
        {mudou && (
          <p className="rounded-xl border-2 border-secundaria bg-painel px-3 py-2 font-bold" data-adendo>
            {contrato.mudanca.adendo}
          </p>
        )}
      </div>
    </article>
  );
}

type JanelaProps = FolhaProps & {
  aberta: boolean;
  aoFechar: () => void;
};

/** O documento do cliente numa janela: dá para reler a qualquer momento do trabalho. */
export function JanelaDocumento({ aberta, contrato, mudou, aoFechar }: JanelaProps) {
  return (
    <Modal aberto={aberta} titulo="Pedido do cliente" aoFechar={aoFechar} className="max-w-xl">
      <FolhaDocumento contrato={contrato} mudou={mudou} />
      <div className="mt-3 flex justify-end">
        <Botao onClick={aoFechar}>Voltar ao trabalho</Botao>
      </div>
    </Modal>
  );
}

/** O botão que abre o documento (no cabeçalho do checklist e na conversa). */
export function BotaoDocumento({ cliente, aoAbrir, compacto = false }: { cliente: IdCliente; aoAbrir: () => void; compacto?: boolean }) {
  return (
    <Botao variante="secundario" tamanho="p" onClick={aoAbrir} className={compacto ? "min-h-9" : "min-h-9"} data-abrir-documento>
      Pedido {compacto ? "" : `de ${clienteDe(cliente).nome}`}
    </Botao>
  );
}
