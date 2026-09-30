import type { BlocoEstruturado } from "@/motor/busca";

/**
 * O teste de dados estruturados, simplificado: um cartão por bloco
 * application/ld+json, com o JSON quebrado (a linha e a coluna do erro) ou
 * os itens lidos (o @type, os obrigatórios que faltam, os recomendados
 * ausentes e os avisos).
 */
export function ListaDadosEstruturados({ blocos }: { blocos: readonly BlocoEstruturado[] }) {
  if (blocos.length === 0) {
    return (
      <p className="text-sm text-texto-suave" data-sem-dados-estruturados>
        Nenhum bloco de dados estruturados nesta página. Eles moram num{" "}
        <code className="font-mono text-xs">{'<script type="application/ld+json">'}</code>, normalmente no head.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-3" data-lista-dados-estruturados>
      {blocos.map((bloco) => (
        <li key={bloco.numero} className="rounded-2xl border-2 border-borda bg-fundo p-3 text-sm" data-bloco-estruturado={bloco.numero}>
          <p className="text-xs font-black uppercase tracking-wide text-texto-suave">Bloco {bloco.numero}</p>
          {bloco.erro ? (
            <p className="mt-1 text-texto" data-erro-json data-erro-linha={bloco.erro.linha}>
              <span className="font-black text-alerta">JSON inválido</span> na linha {bloco.erro.linha}, coluna {bloco.erro.coluna}:{" "}
              {bloco.erro.mensagem}. A busca ignora o bloco inteiro.
            </p>
          ) : bloco.itens.length === 0 ? (
            <p className="mt-1 text-texto-suave">O JSON está certo, mas não tem nenhum objeto com @type.</p>
          ) : (
            bloco.itens.map((item, indice) => {
              const valido = item.faltam.length === 0 && item.tipo !== null;
              return (
                <div key={indice} className="mt-2" data-item-estruturado={item.tipo ?? ""} data-valido={valido ? "sim" : "nao"}>
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-texto">{item.tipo ?? "(sem @type)"}</span>
                    {item.negocioLocal && (
                      <span className="rounded-full bg-painel px-2 py-0.5 text-[11px] font-black text-texto">negócio local</span>
                    )}
                    <span className={`text-xs font-black ${valido ? "text-sucesso" : "text-alerta"}`}>{valido ? "Válido" : "Com erro"}</span>
                  </p>
                  {item.faltam.length > 0 && (
                    <p className="mt-1 text-texto" data-faltam={item.faltam.join(" ")}>
                      Faltam os obrigatórios: <span className="font-mono">{item.faltam.join(", ")}</span>
                    </p>
                  )}
                  {item.recomendadosAusentes.length > 0 && (
                    <p className="mt-1 text-texto-suave" data-recomendados={item.recomendadosAusentes.join(" ")}>
                      Recomendados que ajudariam: <span className="font-mono">{item.recomendadosAusentes.join(", ")}</span>
                    </p>
                  )}
                  {item.avisos.map((aviso) => (
                    <p key={aviso} className="mt-1 text-texto-suave">
                      {aviso}
                    </p>
                  ))}
                </div>
              );
            })
          )}
        </li>
      ))}
    </ul>
  );
}
