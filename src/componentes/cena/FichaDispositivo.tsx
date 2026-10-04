"use client";

/*
 * A ficha de um dispositivo da cena: o manual que o aluno abre tocando nele.
 * O que ele faz, como ele está agora, os comandos e as propriedades (com o
 * nome que ele tem NESTA cena) e um exemplo. O botão "Por dentro" mostra o
 * caminho do comando até o mundo real, ligando com a trilha Automação.
 * Ensina a ler documentação, que é o que todo programador faz.
 */
import { CATALOGO_DISPOSITIVOS, FIM_POR_DENTRO } from "@/motor/cena/catalogo";
import type { DispositivoCena, ValorCena } from "@/motor/cena/modelo";
import { Modal } from "@/componentes/ui/Modal";
import { IconeFechar } from "@/componentes/icones/IconeFechar";
import { IconeFichaDispositivo } from "@/componentes/icones/IconeFichaDispositivo";
import { IlustracaoPorDentro } from "./IlustracaoPorDentro";
import { resumoDoDispositivo } from "./CenaSvg";

type Props = {
  dispositivo: DispositivoCena | null;
  /** O estado dele no instante que a cena mostra. */
  estado: Record<string, ValorCena> | undefined;
  porDentro: boolean;
  aoVerPorDentro: () => void;
  aoVoltar: () => void;
  aoFechar: () => void;
};

export function FichaDispositivo({ dispositivo, estado, porDentro, aoVerPorDentro, aoVoltar, aoFechar }: Props) {
  const ficha = dispositivo ? CATALOGO_DISPOSITIVOS[dispositivo.tipo] : null;
  const nome = dispositivo?.id ?? "";
  const botao = "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border-2 px-4 text-sm font-black pointer-coarse:min-h-11";
  return (
    <Modal aberto={dispositivo !== null} titulo={ficha ? `Ficha: ${ficha.nome} (${nome})` : "Ficha"} aoFechar={aoFechar} className="max-w-xl !p-5">
      {ficha && dispositivo && (
        <div className="flex max-h-[78dvh] flex-col gap-3" data-ficha-dispositivo={nome} data-por-dentro-aberto={porDentro ? "sim" : "nao"}>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primaria text-sobre-primaria" aria-hidden="true">
              <IconeFichaDispositivo />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-wide text-texto-suave">{porDentro ? "Por dentro" : `${ficha.sentido === "entrada" ? "Entrada" : "Saída"}: ${ficha.sentido === "entrada" ? "o código lê o mundo" : "o código manda no mundo"}`}</p>
              <h3 className="text-lg font-black leading-tight text-texto">
                {ficha.nome} <span className="font-mono text-base text-primaria">{nome}</span>
              </h3>
            </div>
            <button type="button" onClick={aoFechar} aria-label="Fechar a ficha" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-borda text-texto hover:border-primaria pointer-coarse:h-11 pointer-coarse:w-11">
              <IconeFechar />
            </button>
          </div>
          <div className="min-h-0 overflow-y-auto pr-1">
            {porDentro ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-texto">
                  {ficha.sentido === "saida"
                    ? "O comando não vai direto do código para o aparelho: ele passa por um caminho, assim."
                    : "O código não enxerga o mundo direto: a informação faz um caminho até ele, assim."}
                </p>
                <IlustracaoPorDentro etapas={ficha.porDentro} sentido={ficha.sentido} tipo={dispositivo.tipo} />
                <p className="rounded-xl border-2 border-borda bg-painel px-3 py-2 text-sm font-bold text-texto" data-fim-por-dentro>
                  {FIM_POR_DENTRO}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 text-sm text-texto">
                <p>{ficha.oQueFaz}</p>
                <p className="rounded-xl border-2 border-borda bg-painel px-3 py-1.5" data-estado-ficha>
                  <span className="font-black">Agora: </span>
                  {resumoDoDispositivo(dispositivo, estado)}
                </p>
                {ficha.comandos.length > 0 && (
                  <section aria-label="Comandos">
                    <h4 className="mb-1 text-xs font-black uppercase tracking-wide text-texto-suave">Comandos</h4>
                    <ul className="flex flex-col gap-1">
                      {ficha.comandos.map((comando) => (
                        <li key={comando.nome}>
                          <code className="rounded bg-codigo-fundo px-1.5 py-0.5 font-mono text-[13px] font-bold text-codigo-texto">
                            {nome}.{comando.assinatura}
                          </code>{" "}
                          {comando.explicacao}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                <section aria-label="Propriedades">
                  <h4 className="mb-1 text-xs font-black uppercase tracking-wide text-texto-suave">Propriedades</h4>
                  <ul className="flex flex-col gap-1">
                    {ficha.propriedades.map((propriedade) => (
                      <li key={propriedade.nome}>
                        <code className="rounded bg-codigo-fundo px-1.5 py-0.5 font-mono text-[13px] font-bold text-codigo-texto">
                          {nome}.{propriedade.nome}
                        </code>{" "}
                        <span className="text-xs font-bold text-texto-suave">
                          ({propriedade.tipo}
                          {propriedade.escreve ? ", troca com =" : propriedade.doMundo ? ", só lê: vem do mundo" : ", só lê"})
                        </span>{" "}
                        {propriedade.explicacao}
                      </li>
                    ))}
                  </ul>
                </section>
                <section aria-label="Exemplo">
                  <h4 className="mb-1 text-xs font-black uppercase tracking-wide text-texto-suave">Exemplo</h4>
                  <pre className="overflow-x-auto rounded-xl border-2 border-borda bg-codigo-fundo px-3 py-2 font-mono text-[13px] leading-relaxed text-codigo-texto" data-exemplo-ficha>
                    {ficha.exemplo(nome)}
                  </pre>
                </section>
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {porDentro ? (
              <button type="button" onClick={aoVoltar} className={`${botao} border-borda bg-superficie text-texto hover:border-primaria`} data-voltar-ficha>
                Voltar à ficha
              </button>
            ) : (
              <button type="button" onClick={aoVerPorDentro} className={`${botao} border-primaria bg-primaria text-sobre-primaria hover:brightness-110`} data-ver-por-dentro>
                Por dentro
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
