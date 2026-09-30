"use client";

import { IconeAviso } from "@/componentes/icones/IconeAviso";
import { IconeEntradaConsole } from "@/componentes/icones/IconeEntradaConsole";
import { IconeRespostaConsole } from "@/componentes/icones/IconeRespostaConsole";
import type { LinhaConsole } from "@/componentes/jogo/usePrograma";
import { explicarErro, textoDoErro } from "@/motor/executor/erros";
import type { SaidaConsole } from "@/motor/executor/tipos";
import { ValorConsole } from "./ValorConsole";

function PartesDaSaida({ saida }: { saida: SaidaConsole }) {
  const primeiro = saida.partes[0];
  // Com formato (%s, %d...), o texto já vem montado.
  if (saida.formato && primeiro?.t === "string" && /%[sdifoOc%]/.test(primeiro.v)) {
    return <span className="whitespace-pre-wrap break-words">{saida.texto}</span>;
  }
  return (
    <span className="inline-flex flex-wrap items-start gap-x-2">
      {saida.partes.map((parte, i) => (
        <ValorConsole key={i} valor={parte} contexto={saida.formato ? "log" : "argumento"} />
      ))}
    </span>
  );
}

/** Uma linha do Console: o que você digitou, a resposta, o que o programa mostrou ou o erro. */
export function LinhaDoConsole({ linha }: { linha: LinhaConsole }) {
  const base = "flex gap-1.5 border-b border-borda/60 px-2 py-1";
  const calha = "mt-0.5 flex w-3.5 shrink-0 justify-center";
  switch (linha.tipo) {
    case "entrada":
      return (
        <div className={base} data-linha-console="entrada">
          <span className={`${calha} text-secundaria`}>
            <IconeEntradaConsole />
          </span>
          <code className="min-w-0 whitespace-pre-wrap break-words text-codigo-texto">{linha.codigo}</code>
        </div>
      );
    case "resposta":
      return (
        <div className={base} data-linha-console="resposta">
          <span className={`${calha} text-texto-suave`}>
            <IconeRespostaConsole />
          </span>
          <span className="min-w-0">
            <ValorConsole valor={linha.valor} contexto="resposta" />
          </span>
        </div>
      );
    case "saida": {
      const { nivel } = linha.saida;
      const cor = nivel === "error" ? "bg-js-erro-fundo text-erro" : nivel === "warn" ? "bg-js-aviso-fundo" : "";
      return (
        <div className={`${base} ${cor}`} data-linha-console={`saida-${nivel}`} data-texto={linha.saida.texto}>
          <span className={calha}>{(nivel === "warn" || nivel === "error") && <IconeAviso className={nivel === "error" ? "text-erro" : "text-alerta"} />}</span>
          <span className="min-w-0">{linha.saida.partes.length ? <PartesDaSaida saida={linha.saida} /> : <span className="text-texto-suave"> </span>}</span>
        </div>
      );
    }
    case "erro": {
      const explicacao = explicarErro(linha.erro);
      return (
        <div className={`${base} flex-col bg-js-erro-fundo`} data-linha-console="erro" data-erro={linha.erro.nome || linha.erro.tipo}>
          <div className="flex gap-1.5 text-erro">
            <span className={calha}>
              <IconeAviso className="text-erro" />
            </span>
            <span className="min-w-0 whitespace-pre-wrap break-words font-bold">
              {textoDoErro(linha.erro)}
              {linha.erro.linha !== null && <span className="font-normal text-texto-suave">{`  ${linha.origem === "snippet" ? "programa" : "linha"}: ${linha.erro.linha}`}</span>}
            </span>
          </div>
          <div className="ml-5 mt-1 rounded-lg border-2 border-borda bg-superficie px-2.5 py-1.5 font-sans text-[13px] leading-snug text-texto" data-explicacao-erro>
            <p className="font-black">{explicacao.titulo}{linha.erro.linha !== null ? ` (linha ${linha.erro.linha})` : ""}</p>
            <p>{explicacao.explicacao}</p>
            {explicacao.dica && <p className="mt-0.5 italic text-texto-suave">{explicacao.dica}</p>}
          </div>
        </div>
      );
    }
    case "info":
      return (
        <div className={`${base} italic text-texto-suave`} data-linha-console="info">
          <span className={calha} />
          <span>{linha.texto}</span>
        </div>
      );
  }
}
