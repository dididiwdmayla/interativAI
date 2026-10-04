"use client";

/*
 * Levar pro mundo (contrato de uma ilha com código): baixa o .js com o
 * programa do aluno e os aparelhos de mentirinha, com as instruções para
 * rodar no Console do navegador e no Node. Uma prévia das primeiras linhas
 * do programa mostra que é o código dele mesmo.
 */
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";

type Props = {
  aberto: boolean;
  arquivo: string;
  /** O código do aluno (a prévia). */
  codigo: string;
  aoBaixar: () => void;
  aoFechar: () => void;
};

export function DialogoLevarProMundoJs({ aberto, arquivo, codigo, aoBaixar, aoFechar }: Props) {
  const linhas = codigo.split("\n");
  return (
    <Modal aberto={aberto} titulo="Levar pro mundo" aoFechar={aoFechar} className="max-w-xl">
      <div className="flex flex-col gap-3" data-levar-pro-mundo-js>
        <div>
          <p className="text-xl font-black text-primaria">Seu programa, fora do jogo</p>
          <p className="mt-1 text-[15px] text-texto">
            O arquivo <span className="font-mono font-bold">{arquivo}</span> tem o seu código e uma versão simples dos aparelhos: em vez de acender luzes de verdade, eles escrevem no
            console o que fariam.
          </p>
        </div>
        <pre className="max-h-40 overflow-auto rounded-xl border-2 border-borda bg-codigo-fundo px-3 py-2 font-mono text-xs leading-snug text-codigo-texto" data-previa-programa>
          {linhas.slice(0, 12).join("\n")}
          {linhas.length > 12 ? "\n..." : ""}
        </pre>
        <ol className="list-inside list-decimal space-y-1 text-sm text-texto">
          <li>
            <span className="font-black">No navegador:</span> abra qualquer página, aperte F12 (ou Ctrl+Shift+J), vá na aba Console, cole o arquivo inteiro e aperte Enter.
          </li>
          <li>
            <span className="font-black">No computador, com o Node:</span> no terminal, <span className="font-mono">node {arquivo}</span>
          </li>
        </ol>
        <div className="flex flex-wrap justify-end gap-2">
          <Botao variante="secundario" onClick={aoFechar}>
            Fechar
          </Botao>
          <Botao onClick={aoBaixar} data-baixar-programa>
            Baixar {arquivo}
          </Botao>
        </div>
      </div>
    </Modal>
  );
}
