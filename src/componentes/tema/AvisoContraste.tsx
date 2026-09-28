"use client";

import { Mascote } from "@/componentes/mascote/Mascote";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import { formatarContraste } from "@/lib/contraste";
import type { ResultadoPar } from "@/lib/meuTema";

type Props = {
  aberto: boolean;
  /** Os pares abaixo de 4,5:1. */
  ruins: readonly ResultadoPar[];
  aoVoltar: () => void;
  aoSalvarMesmoAssim: () => void;
};

/**
 * Antes de salvar o Meu tema, o computadorzinho confere o contraste dos
 * pares principais. Abaixo de 4,5:1 (WCAG 1.4.3), ele avisa quais pares
 * ficaram ruins e deixa salvar mesmo assim: o tema é do jogador.
 */
export function AvisoContraste({ aberto, ruins, aoVoltar, aoSalvarMesmoAssim }: Props) {
  return (
    <Modal aberto={aberto} titulo="Conferindo o contraste" aoFechar={aoVoltar} className="max-w-md">
      <div className="flex items-start gap-3" data-aviso-contraste>
        <Mascote expressao="preocupado" tamanho={72} className="shrink-0" />
        <div className="min-w-0">
          <p className="font-bold leading-snug text-texto">
            Antes de salvar, conferi se dá pra ler. {ruins.length === 1 ? "Este par ficou" : "Estes pares ficaram"} com pouco contraste
            (o mínimo pra texto é 4,5:1):
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {ruins.map((par) => (
              <li key={`${par.texto}-${par.fundo}`} data-par-ruim={`${par.texto} ${par.fundo}`} className="rounded-lg bg-painel px-2 py-1">
                <span className="font-bold text-texto">{par.nome}</span>{" "}
                <span className="font-codigo text-xs text-texto-suave">
                  ({par.texto} em {par.fundo}): {par.razao === null ? "cor que eu não sei ler" : formatarContraste(par.razao)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-texto-suave">Quem enxerga pouco (ou usa o celular no sol) pode não conseguir ler. O tema é seu: você decide.</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Botao variante="secundario" onClick={aoVoltar}>
          Voltar e ajustar
        </Botao>
        <Botao onClick={aoSalvarMesmoAssim} data-salvar-mesmo-assim>
          Salvar mesmo assim
        </Botao>
      </div>
    </Modal>
  );
}
