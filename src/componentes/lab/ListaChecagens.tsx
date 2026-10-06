"use client";

import { useState } from "react";
import { Botao } from "@/componentes/ui/Botao";
import { FASES, UNIDADES } from "@/conteudo";
import { checarTudo, type ProblemaConteudo } from "@/conteudo/checagens";
import { carregarPythonNaPagina } from "@/motor/linguagens/python/pagina";
import { definirPythonSincrono } from "@/motor/linguagens/sincrono";

/** Roda no navegador as mesmas checagens do npm run testar:conteudo. */
export function ListaChecagens() {
  const [problemas, setProblemas] = useState<ProblemaConteudo[] | null>(null);
  const [rodando, setRodando] = useState(false);
  const rodar = async () => {
    setRodando(true);
    // O comparador do museu roda Python de verdade: as checagens precisam dele acordado (sem ele, valem as saídas declaradas).
    try {
      definirPythonSincrono(await carregarPythonNaPagina());
    } catch {
      definirPythonSincrono(null);
    }
    setProblemas(checarTudo({ unidades: UNIDADES, fases: FASES }));
    setRodando(false);
  };
  return (
    <div className="space-y-2">
      <Botao tamanho="p" onClick={() => void rodar()} disabled={rodando}>
        {rodando ? "Acordando o Python e checando..." : "Rodar checagens"}
      </Botao>
      {problemas === null ? (
        <p className="text-xs text-texto-suave">As mesmas regras do npm run testar:conteudo, rodando aqui.</p>
      ) : problemas.length === 0 ? (
        <p className="text-xs font-bold text-sucesso">Tudo certo em {FASES.length} fases.</p>
      ) : (
        <ul className="space-y-1.5">
          {problemas.map((problema, indice) => (
            <li key={indice} className="rounded-xl border-2 border-erro p-2 text-xs">
              <p className="font-black">
                {problema.onde}: {problema.regra}
              </p>
              <p className="whitespace-pre-wrap font-codigo">{problema.mensagem}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
