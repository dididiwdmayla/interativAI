import { montarIndice } from "@/conteudo/indice";

/** O índice de conceitos: onde cada um é ensinado, praticado, revisado e pedido. */
export function TabelaIndice() {
  const indice = montarIndice();
  const lista = (ids: string[]) => (ids.length > 0 ? ids.join(", ") : "-");
  return (
    <ul className="space-y-2">
      {indice.map(({ conceito, ensinam, praticam, revisam, pedem }) => (
        <li key={conceito.id} className="rounded-xl border-2 border-borda p-2 text-xs">
          <p className="font-black text-texto">
            {conceito.nome} <span className="font-codigo font-normal text-texto-suave">{conceito.id}</span>
          </p>
          <p className="text-texto-suave">{conceito.resumo}</p>
          <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 font-codigo">
            <dt className="font-bold">ensinam</dt>
            <dd>{lista(ensinam)}</dd>
            <dt className="font-bold">praticam</dt>
            <dd>{lista(praticam)}</dd>
            <dt className="font-bold">revisam</dt>
            <dd>{lista(revisam)}</dd>
            <dt className="font-bold">pedem</dt>
            <dd>{lista(pedem)}</dd>
          </dl>
        </li>
      ))}
    </ul>
  );
}
