"use client";

/*
 * A tabela verdade do circuito, ao lado da bancada: uma linha por jeito de
 * ligar as chaves, a linha de agora acesa e as já testadas marcadas. "Ver
 * como código" mostra o mesmo circuito com &&, || e ! (a ponte para o if).
 */
import type { ReactNode } from "react";
import { IconeCerto } from "@/componentes/icones/IconeCerto";
import { type Circuito, circuitoComoCodigo, entradasDo, type LinhaTabela, linhaAtual, nomeDa, saidasDo } from "@/motor/circuito/modelo";

type Props = {
  circuito: Circuito;
  tabela: readonly LinhaTabela[];
  testadas: readonly number[];
  mostrarCodigo: boolean;
  aoAlternarCodigo: () => void;
  /** O botão embrulhado (apresentação e Caixa de Ferramentas). */
  alvoBotao: (botao: ReactNode) => ReactNode;
};

function Valor({ ligado }: { ligado: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 font-bold ${ligado ? "text-sucesso" : "text-texto-suave"}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${ligado ? "bg-fio-ligado" : "bg-fio-desligado"}`} aria-hidden="true" />
      {ligado ? "sim" : "não"}
    </span>
  );
}

export function PainelTabelaVerdade({ circuito, tabela, testadas, mostrarCodigo, aoAlternarCodigo, alvoBotao }: Props) {
  const entradas = entradasDo(circuito);
  const saidas = saidasDo(circuito);
  const agora = linhaAtual(circuito);
  const codigo = circuitoComoCodigo(circuito);
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-borda bg-superficie shadow-[0_8px_0_var(--cor-sombra)]" data-tabela-verdade>
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-borda bg-painel px-3 py-1.5">
        <span className="text-sm font-black text-texto">Tabela verdade</span>
        <span className="text-xs text-texto-suave" data-linhas-testadas={testadas.length}>
          {testadas.length} de {tabela.length} testadas
        </span>
        <span className="flex-1" />
        {alvoBotao(
          <button
            type="button"
            onClick={aoAlternarCodigo}
            aria-pressed={mostrarCodigo}
            className="inline-flex h-8 items-center rounded-full border-2 border-primaria bg-primaria px-3 text-xs font-black text-sobre-primaria hover:brightness-110 pointer-coarse:h-11"
            data-ver-como-codigo
          >
            {mostrarCodigo ? "Esconder o código" : "Ver como código"}
          </button>,
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-2">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-6" aria-label="Testada" />
              {entradas.map((peca) => (
                <th key={peca.id} className="border-b-2 border-borda px-2 py-1 text-left font-bold text-texto">
                  {peca.rotulo ?? nomeDa(peca)}
                </th>
              ))}
              {saidas.map((peca) => (
                <th key={peca.id} className="border-b-2 border-l-2 border-borda px-2 py-1 text-left font-black text-primaria">
                  {peca.rotulo ?? nomeDa(peca)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tabela.map((linha, i) => (
              <tr
                key={i}
                className={i === agora ? "bg-codigo-destaque-linha" : ""}
                data-linha-tabela={i}
                data-linha-atual={i === agora ? "sim" : "nao"}
                data-testada={testadas.includes(i) ? "sim" : "nao"}
              >
                <td className="px-1 text-sucesso">{testadas.includes(i) && <IconeCerto />}</td>
                {entradas.map((peca) => (
                  <td key={peca.id} className="border-b border-borda px-2 py-1">
                    <Valor ligado={linha.entradas[nomeDa(peca)]} />
                  </td>
                ))}
                {saidas.map((peca) => (
                  <td key={peca.id} className="border-b border-l-2 border-borda px-2 py-1">
                    <Valor ligado={linha.saidas[nomeDa(peca)]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {mostrarCodigo && (
          <div className="mt-3 flex flex-col gap-1.5 rounded-xl border-2 border-borda bg-codigo-fundo p-2.5" data-codigo-circuito>
            <pre className="whitespace-pre-wrap break-words font-mono text-sm font-bold text-codigo-texto">{codigo}</pre>
            <p className="text-xs text-texto-suave">
              No código, o E vira <code className="font-mono font-bold">&amp;&amp;</code>, o OU vira <code className="font-mono font-bold">||</code> e o NÃO vira{" "}
              <code className="font-mono font-bold">!</code>. Cada chave é uma variável que vale true (ligada) ou false (desligada).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
