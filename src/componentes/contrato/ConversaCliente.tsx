"use client";

import { type ReactNode, useState } from "react";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import type { IdCliente } from "@/motor/contrato/clientes";
import type { FalaCliente } from "@/motor/contrato/modelo";
import { FalaDoCliente } from "./FalaDoCliente";
import { useTextoDigitado } from "./useTextoDigitado";

type Props = {
  aberta: boolean;
  titulo: string;
  cliente: IdCliente;
  falas: readonly FalaCliente[];
  /** O botão da última fala (ou do que vem depois das falas). */
  rotuloFim: string;
  aoTerminar: () => void;
  /** Mostrado depois da última fala, no lugar dela (o documento do pedido, no briefing). */
  depois?: ReactNode;
  /** Etiqueta pequena em cima (ex.: "Mensagem nova"). */
  etiqueta?: string;
};

/**
 * O cliente falando, uma fala de cada vez (o texto aparece como alguém
 * falando; "Continuar" no meio completa a fala). Usado no briefing (as falas
 * e depois o documento) e na mensagem de mudança de pedido.
 */
export function ConversaCliente({ aberta, titulo, cliente, falas, rotuloFim, aoTerminar, depois, etiqueta }: Props) {
  const [indice, setIndice] = useState(0);
  const noDepois = depois !== undefined && indice >= falas.length;
  const fala = falas[Math.min(indice, falas.length - 1)];
  const { mostrado, completo, completar } = useTextoDigitado(noDepois ? "" : fala.texto);
  const ultima = indice >= falas.length - 1;

  const avancar = () => {
    if (!completo) {
      completar();
      return;
    }
    if (!ultima || (depois !== undefined && indice < falas.length)) setIndice(indice + 1);
    else aoTerminar();
  };

  return (
    <Modal aberto={aberta} titulo={titulo} aoFechar={() => undefined} className="max-w-2xl">
      <div className="flex flex-col gap-3" data-conversa-cliente data-fala-indice={noDepois ? "depois" : indice} data-fala-completa={completo ? "sim" : "nao"}>
        {etiqueta && <p className="self-start rounded-full bg-secundaria px-3 py-0.5 text-xs font-black uppercase tracking-wide text-sobre-secundaria">{etiqueta}</p>}
        {noDepois ? (
          <>
            {depois}
            <div className="flex justify-end">
              <Botao onClick={aoTerminar} data-conversa-fim>
                {rotuloFim}
              </Botao>
            </div>
          </>
        ) : (
          <FalaDoCliente cliente={cliente} fala={fala} mostrado={mostrado} falando={!completo}>
            <span className="mr-auto text-xs text-texto-suave">
              {indice + 1} de {falas.length}
            </span>
            <Botao onClick={avancar} data-conversa-continuar>
              {!completo ? "Continuar" : ultima && depois === undefined ? rotuloFim : "Continuar"}
            </Botao>
          </FalaDoCliente>
        )}
      </div>
    </Modal>
  );
}
