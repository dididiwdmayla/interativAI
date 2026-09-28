"use client";

import { Mascote } from "@/componentes/mascote/Mascote";
import { NOME_FOLHA_DO_JOGO } from "@/motor/css/cascata";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import { type ArquivosDoProjeto, LINHA_DO_CSS, NOME_CSS, NOME_HTML, nomeDoZip } from "@/lib/exportarProjeto";

type Props = {
  aberto: boolean;
  /** Os dois arquivos, já montados do que está na tela agora. */
  arquivos: ArquivosDoProjeto | null;
  /** O nome do .zip (vira "meu-primeiro-site.zip"). */
  nome: string;
  /** O jogo pôs a linha do <link> no head (o jogador ainda não tinha escrito). */
  linhaAcrescentada: boolean;
  aoBaixar: () => void;
  aoVerGuia: () => void;
  aoFechar: () => void;
};

function linhas(texto: string): number {
  return texto.length === 0 ? 0 : texto.replace(/\n$/, "").split("\n").length;
}

/**
 * "Levar pro mundo": mostra os dois arquivos que o site vira fora do jogo
 * (a página e o visual), baixa o .zip e leva ao guia de publicação.
 */
export function DialogoLevarProMundo({ aberto, arquivos, nome, linhaAcrescentada, aoBaixar, aoVerGuia, aoFechar }: Props) {
  return (
    <Modal aberto={aberto} titulo="Levar pro mundo" aoFechar={aoFechar} className="max-w-lg">
      <div className="flex items-start gap-3" data-dialogo-levar-pro-mundo>
        <Mascote expressao="comemorando" tamanho={72} className="shrink-0" />
        <div className="min-w-0">
          <p className="font-bold leading-snug text-texto">
            Fora do jogo, um site é uma pasta com arquivos. O seu vira estes dois, num .zip:
          </p>
          {arquivos && (
            <ul className="mt-2 space-y-1.5 text-sm">
              <li data-arquivo-exportado={NOME_HTML} className="rounded-lg bg-painel px-2 py-1">
                <span className="font-codigo font-bold text-texto">{NOME_HTML}</span>{" "}
                <span className="text-texto-suave">a página ({linhas(arquivos[NOME_HTML])} linhas)</span>
              </li>
              <li data-arquivo-exportado={NOME_CSS} className="rounded-lg bg-painel px-2 py-1">
                <span className="font-codigo font-bold text-texto">{NOME_CSS}</span>{" "}
                <span className="text-texto-suave">
                  o visual, a aba {NOME_FOLHA_DO_JOGO} do jogo ({linhas(arquivos[NOME_CSS])} linhas)
                </span>
              </li>
            </ul>
          )}
          <p className="mt-2 text-sm text-texto-suave" data-linha-do-css={linhaAcrescentada ? "acrescentada" : "ja-tinha"}>
            {linhaAcrescentada ? (
              <>
                Pus esta linha no fim do head, pra página achar o visual:{" "}
                <code className="font-codigo text-xs text-texto">{LINHA_DO_CSS}</code>
              </>
            ) : (
              <>
                A sua página já liga o visual com <code className="font-codigo text-xs text-texto">{LINHA_DO_CSS}</code>. Perfeito!
              </>
            )}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Botao variante="secundario" onClick={aoVerGuia} data-abrir-guia>
          Ver o guia de publicação
        </Botao>
        <Botao onClick={aoBaixar} data-baixar-zip title={`Baixar ${nomeDoZip(nome)}`}>
          Baixar .zip
        </Botao>
      </div>
    </Modal>
  );
}
