"use client";

/*
 * O comparador de linguagens (sala 3): o mesmo programa em várias
 * linguagens, lado a lado. Tocar numa linha acende a mesma parte em todas
 * (o conceito é o mesmo, muda a escrita). Rodar mostra a saída: JavaScript
 * e Python de verdade (o Python baixa e acorda na primeira vez, com uma
 * barra amigável), as outras com a saída pronta, marcada "simulado". A
 * linguagem editável abre um editor simples. O coral chama os antepassados.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { explicarErro, textoDoErro } from "@/motor/executor/erros";
import { codigoDaLinguagem, type EstacaoComparador as DadosComparador, type EstadoComparador, linhasDeAgora } from "@/motor/exposicao/comparador";
import { explicarErroPython } from "@/motor/linguagens/python/erros";
import { type CargaPython, FICHAS_LINGUAGENS, type Linguagem, type ResultadoLinguagem, textosDaSaida } from "@/motor/linguagens/tipos";
import type { ExtrasComparador } from "@/componentes/jogo/useExposicao";
import { CoralDosAntepassados } from "./CoralDosAntepassados";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

type Props = PropsEstacao<DadosComparador, EstadoComparador> & { extras?: ExtrasComparador };

function megas(bytes: number): string {
  return (bytes / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
}

/** O estado amigável da carga do Python. */
function CargaDoPython({ carga }: { carga: CargaPython }) {
  if (carga.etapa === "pronto") return null;
  if (carga.etapa === "falhou") {
    return (
      <p className="rounded-lg border-2 border-erro bg-[var(--cor-js-erro-fundo)] px-2 py-1 text-xs font-bold text-texto" role="alert">
        O Python não acordou: {carga.mensagem}
      </p>
    );
  }
  const fracao = carga.etapa === "baixando" ? Math.min(1, carga.baixados / Math.max(1, carga.total)) : 1;
  return (
    <div className="flex flex-col gap-1" role="status" aria-live="polite" data-carga-python={carga.etapa}>
      <p className="text-xs font-bold text-texto">
        {carga.etapa === "baixando"
          ? `Baixando o Python: ${megas(carga.baixados)} de ${megas(carga.total)} MB. Só na primeira vez; depois ele fica guardado.`
          : "O Python está acordando... é um interpretador de verdade, inteirinho dentro do navegador."}
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-painel">
        <motion.div className="h-full rounded-full bg-primaria" initial={false} animate={{ width: `${Math.round(fracao * 100)}%` }} transition={{ duration: 0.3 }} />
      </div>
    </div>
  );
}

/** A tela de saída, com o erro (e a explicação) quando houver. */
function SaidaDoPrograma({ linguagem, resultado }: { linguagem: Linguagem; resultado: ResultadoLinguagem | "rodando" | undefined }) {
  if (!resultado) return null;
  if (resultado === "rodando") {
    return (
      <p className="rounded-lg bg-[var(--cor-terminal-fundo)] px-2 py-1.5 font-codigo text-xs text-[var(--cor-terminal-texto)]" data-saida-linguagem={linguagem} data-pronta="nao">
        rodando...
      </p>
    );
  }
  const linhas = textosDaSaida(resultado);
  const erro = resultado.erro;
  const explicacao = erro ? (linguagem === "python" ? explicarErroPython(erro) : linguagem === "javascript" ? explicarErro(erro) : null) : null;
  return (
    <div className="flex flex-col gap-1" data-saida-linguagem={linguagem} data-pronta="sim" data-com-erro={erro ? "sim" : "nao"}>
      <pre className="overflow-x-auto rounded-lg bg-[var(--cor-terminal-fundo)] px-2 py-1.5 font-codigo text-xs leading-snug text-[var(--cor-terminal-texto)]" aria-label={`Saída em ${FICHAS_LINGUAGENS[linguagem].nome}`}>
        {linhas.length ? linhas.join("\n") : erro ? "" : "(nada apareceu)"}
        {erro && <span className="block text-[var(--cor-erro)]">{`${textoDoErro(erro)}${erro.linha ? ` (linha ${erro.linha})` : ""}`}</span>}
      </pre>
      {explicacao && (
        <p className="text-xs text-texto-suave">
          <span className="font-black text-texto">{explicacao.titulo}.</span> {explicacao.explicacao}
        </p>
      )}
      {resultado.simulado && <p className="text-[11px] font-bold text-texto-suave">Saída simulada: esta linguagem não roda no navegador. Conferida rodando de verdade, fora do jogo.</p>}
    </div>
  );
}

export function EstacaoComparador({ estacao, estado, mexer, toque, destaque, extras }: Props) {
  const reduzir = useReducedMotion();
  const [editando, setEditando] = useState(false);
  const acesa = estado.acesa;
  const parteAcesa = acesa ? estacao.partes.find((p) => p.id === acesa.parte) : undefined;
  const saidas = extras?.saidas[estacao.id] ?? {};
  const carga = extras?.cargaPython ?? null;
  const coral = extras?.coral?.estacao === estacao.id ? extras.coral : null;
  const varias = estacao.programas.length > 2;
  return (
    <div className="flex flex-col gap-2" data-estacao-comparador={estacao.id}>
      {/* A parte acesa: o conceito, que é o mesmo em todas. */}
      <div className="min-h-12 rounded-xl border-2 border-dashed border-borda bg-painel px-3 py-1.5" aria-live="polite" data-parte-acesa={acesa?.parte ?? ""}>
        {parteAcesa ? (
          <p className="text-sm text-texto">
            <span className="font-black">{parteAcesa.nome}:</span> {parteAcesa.explica}
          </p>
        ) : (
          <p className="text-sm font-bold text-texto-suave">{toque ? "Toque" : "Clique"} numa linha: a mesma parte acende em todas as linguagens.</p>
        )}
      </div>
      {estacao.coral && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => mexer({ tipo: "cantarCoral", estacao: estacao.id })}
            disabled={coral !== null && !coral.terminou}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-secundaria bg-secundaria px-4 text-sm font-black text-sobre-secundaria hover:brightness-110 disabled:opacity-60 ${destaque?.peca === "coral" ? "animate-pulse ring-4 ring-destaque" : ""}`}
            data-cantar-coral
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M7 15V4l9-2v11" />
              <circle cx="5" cy="15" r="2.2" fill="currentColor" />
              <circle cx="14" cy="13" r="2.2" fill="currentColor" />
            </svg>
            Chamar o coral dos antepassados
          </button>
          <span className="text-xs font-bold text-texto-suave">Cada um canta a versão da sua época.</span>
        </div>
      )}
      <AnimatePresence>
        {coral && (
          <motion.div key="coral" initial={reduzir ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <CoralDosAntepassados estacao={estacao} coral={coral} saidas={saidas} aoFechar={() => extras?.fecharCoral()} />
          </motion.div>
        )}
      </AnimatePresence>
      <NucleoDaEstacao tipo="comparador" className={`grid gap-2 ${varias ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2"}`}>
        {estacao.programas.map((programa) => {
          const linguagem = programa.linguagem;
          const ficha = FICHAS_LINGUAGENS[linguagem];
          const linhas = linhasDeAgora(estacao, estado, linguagem);
          const resultado = saidas[linguagem];
          const rodando = resultado === "rodando";
          const editavel = estacao.editavel === linguagem;
          const pisca = destaque?.peca === `rodar:${linguagem}`;
          return (
            <section
              key={linguagem}
              className={`flex min-w-0 flex-col gap-1.5 rounded-2xl border-2 bg-superficie p-2 ${coral && coral.linguagens[coral.vez] === linguagem ? "border-secundaria ring-4 ring-secundaria/40" : "border-borda"}`}
              aria-label={`${ficha.nome}, de ${ficha.nasceu}`}
              data-programa-linguagem={linguagem}
            >
              <header className="flex flex-wrap items-center gap-1.5">
                <h4 className="text-sm font-black text-texto">{ficha.nome}</h4>
                <span className="text-[11px] font-bold text-texto-suave">{ficha.nasceu}</span>
                <span className="flex-1" />
                {ficha.roda === "executa" ? (
                  <span className="rounded-full bg-primaria px-2 py-0.5 text-[10px] font-black uppercase text-sobre-primaria">roda de verdade</span>
                ) : (
                  <span className="rounded-full border-2 border-dashed border-borda px-2 py-0.5 text-[10px] font-black uppercase text-texto-suave">simulado</span>
                )}
              </header>
              {editavel && editando ? (
                <textarea
                  value={codigoDaLinguagem(estacao, estado, linguagem)}
                  onChange={(evento) => mexer({ tipo: "escreverNaLinguagem", estacao: estacao.id, linguagem, codigo: evento.target.value })}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  rows={Math.max(4, linhas.length + 1)}
                  className="w-full resize-y rounded-lg border-2 border-primaria bg-codigo-fundo p-1.5 font-codigo text-[12px] leading-snug text-codigo-texto"
                  aria-label={`Editar o código em ${ficha.nome}`}
                  data-editor-linguagem={linguagem}
                />
              ) : (
                <ol className="flex flex-col overflow-x-auto rounded-lg bg-codigo-fundo py-1 font-codigo text-[12px] leading-snug text-codigo-texto">
                  {linhas.map((linha, i) => {
                    const daParte = linha.parte !== undefined && acesa?.parte === linha.parte;
                    const tocada = daParte && acesa?.linguagem === linguagem;
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          disabled={!linha.parte}
                          onClick={() => linha.parte && mexer({ tipo: "tocarParte", estacao: estacao.id, parte: linha.parte, linguagem })}
                          className={`block w-full whitespace-pre px-2 text-left transition-colors pointer-coarse:min-h-7 ${daParte ? (tocada ? "bg-[var(--cor-codigo-destaque-linha)] font-black" : "bg-selecao") : linha.parte ? "hover:bg-hover" : "cursor-default opacity-70"} ${destaque?.peca === `${linguagem}:${linha.parte}` ? "animate-pulse ring-2 ring-destaque" : ""}`}
                          data-linha-comparada={`${linguagem}-${i}`}
                          data-parte={linha.parte ?? ""}
                          data-acesa={daParte ? "sim" : "nao"}
                        >
                          {linha.texto || " "}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              )}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => mexer({ tipo: "rodarLinguagem", estacao: estacao.id, linguagem })}
                  disabled={rodando}
                  className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border-2 border-primaria bg-primaria px-3 text-xs font-black text-sobre-primaria hover:brightness-110 disabled:opacity-60 pointer-coarse:min-h-11 ${pisca ? "animate-pulse ring-4 ring-destaque" : ""}`}
                  data-rodar={linguagem}
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                    <path d="M3 2l7 4-7 4z" fill="currentColor" />
                  </svg>
                  {rodando ? "Rodando..." : `Rodar ${ficha.nome}`}
                </button>
                {editavel && (
                  <button
                    type="button"
                    onClick={() => setEditando((antes) => !antes)}
                    className={`inline-flex min-h-9 items-center rounded-full border-2 border-borda bg-superficie px-3 text-xs font-black text-texto hover:bg-hover pointer-coarse:min-h-11 ${destaque?.peca === "editar" ? "animate-pulse ring-4 ring-destaque" : ""}`}
                    aria-pressed={editando}
                    data-editar-linguagem={linguagem}
                  >
                    {editando ? "Ver as partes" : "Editar"}
                  </button>
                )}
              </div>
              {linguagem === "python" && carga && rodando && <CargaDoPython carga={carga} />}
              <SaidaDoPrograma linguagem={linguagem} resultado={resultado} />
            </section>
          );
        })}
      </NucleoDaEstacao>
    </div>
  );
}
