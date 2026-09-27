"use client";

import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import { useProgresso } from "@/lib/armazemProgresso";
import { trilhaDaFonte } from "@/lib/mapa";
import { fracao, MARCOS, marcoAtingido, progressoDoTema } from "@/lib/temas";
import { Insignia } from "./Insignia";
import { TEMAS_COM_ICONE } from "./temas";

type Props = { aberto: boolean; aoFechar: () => void };

/**
 * O painel Insígnias: uma medalha por tema, com o anel do progresso na
 * trilha (contando as unidades planejadas) e os marcos de 25, 50, 75 e 100%.
 */
export function PainelInsignias({ aberto, aoFechar }: Props) {
  const progresso = useProgresso();
  const trilha = trilhaDaFonte({ progresso });
  return (
    <Modal aberto={aberto} titulo="Insígnias" aoFechar={aoFechar} className="max-w-3xl">
      <div data-painel-insignias>
        <h2 className="text-xl font-black text-primaria">Insígnias</h2>
        <p className="mt-1 text-sm font-bold text-texto-suave">
          Uma por tema, na trilha {trilha.nome}. O anel enche com as unidades concluídas, contando as que ainda vão chegar, e cada marco
          (25, 50, 75 e 100%) acende uma luz.
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {TEMAS_COM_ICONE.map((tema) => {
            const conta = progressoDoTema(tema.id, trilha, progresso);
            const marco = marcoAtingido(conta);
            const proximo = MARCOS.find((item) => item > marco);
            return (
              <li
                key={tema.id}
                className="flex flex-col items-center gap-1 rounded-2xl border-2 border-borda p-2.5 text-center"
                data-insignia-tema={tema.id}
                data-marco={marco}
              >
                <Insignia tema={tema.id} fracao={fracao(conta)} tamanho={72} />
                <p className="text-sm font-black text-texto">{tema.nome}</p>
                <p className="text-xs font-bold text-texto-suave">
                  {conta.total === 0 ? "Nenhuma unidade nesta trilha" : `${conta.concluidas} de ${conta.total} unidades`}
                </p>
                {conta.total > 0 && (
                  <p className="text-[11px] font-bold text-texto-suave">{proximo ? `Próximo marco: ${proximo}%` : "Completa!"}</p>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-end">
          <Botao variante="secundario" onClick={aoFechar}>
            Fechar
          </Botao>
        </div>
      </div>
    </Modal>
  );
}
