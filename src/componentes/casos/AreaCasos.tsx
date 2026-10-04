"use client";

/*
 * A área "testes" de uma fase composta: o aluno escreve exemplos (a entrada,
 * como os argumentos de uma chamada, e a saída que espera) e roda todos
 * contra a própria função. Cada caso mostra se passou ou falhou e o que veio
 * de fato. O caso novo se escreve em cima (embaixo, no celular, o
 * computadorzinho cobriria o botão); os casos ficam editáveis na própria
 * linha, e mudar um caso apaga o resultado dele até rodar de novo.
 *
 * No toque, a barra de símbolos aparece embaixo enquanto um campo está em
 * foco (colchetes, aspas e vírgula que o teclado do celular esconde).
 */
import { type ChangeEvent, type KeyboardEvent, type ReactNode, useRef, useState } from "react";
import type { CasosDeTeste } from "@/componentes/jogo/useCasos";
import { IconeCerto } from "@/componentes/icones/IconeCerto";
import { IconeExecutar } from "@/componentes/icones/IconeExecutar";
import { IconeFechar } from "@/componentes/icones/IconeFechar";
import { BarraSimbolos } from "@/componentes/painel/console/BarraSimbolos";
import { type CasoDoAluno, lerCaso, MAXIMO_CASOS, type ResultadoCaso } from "@/motor/casos/modelo";

type Props = {
  casos: CasosDeTeste;
  toque: boolean;
  ocupado: boolean;
  /** O botão "Rodar os casos" embrulhado (a apresentação e a Caixa de Ferramentas apontam para ele). */
  alvoRodar: (botao: ReactNode) => ReactNode;
  /** Um campo ganhou foco (deitado, o computadorzinho dá a dica de espaço). */
  aoFocar?: () => void;
};

function IconeX() {
  return (
    <svg viewBox="0 0 16 16" width={14} height={14} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

function IconePendente() {
  return (
    <svg viewBox="0 0 16 16" width={14} height={14} aria-hidden="true" fill="currentColor">
      <circle cx="8" cy="8" r="2.5" />
    </svg>
  );
}

/** Escreve no lugar do cursor do campo em foco, como se o aluno digitasse (o React fica sabendo pelo evento input). */
function inserirNoCampo(campo: HTMLInputElement | null, texto: string) {
  if (!campo) return;
  const inicio = campo.selectionStart ?? campo.value.length;
  const fim = campo.selectionEnd ?? inicio;
  const novo = campo.value.slice(0, inicio) + texto + campo.value.slice(fim);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(campo, novo);
  campo.dispatchEvent(new Event("input", { bubbles: true }));
  campo.setSelectionRange(inicio + texto.length, inicio + texto.length);
}

const classeCampo =
  "min-h-9 min-w-0 rounded-lg border-2 border-borda bg-superficie px-2 font-mono text-[13px] text-texto placeholder:text-texto-suave focus:border-primaria focus:outline-none pointer-coarse:min-h-11";

type SituacaoCaso = "passou" | "falhou" | "ilegivel" | "sem-resultado";

function situacaoDe(caso: CasoDoAluno, resultado: ResultadoCaso | undefined): SituacaoCaso {
  if (!lerCaso(caso).ok) return "ilegivel";
  if (!resultado) return "sem-resultado";
  return resultado.passou ? "passou" : "falhou";
}

export function AreaCasos({ casos, toque, ocupado, alvoRodar, aoFocar }: Props) {
  const [entrada, setEntrada] = useState("");
  const [esperado, setEsperado] = useState("");
  const [focado, setFocado] = useState(false);
  const campoEmFoco = useRef<HTMLInputElement | null>(null);
  const campoNovaEntrada = useRef<HTMLInputElement>(null);
  const recipiente = useRef<HTMLDivElement>(null);
  const dados = casos.dados;
  const estado = casos.estado;
  if (!dados || !estado) return null;
  const assinatura = `${dados.funcao}(${dados.parametros.join(", ")})`;
  const cheia = estado.casos.length >= MAXIMO_CASOS;
  const passando = estado.casos.filter((caso) => estado.resultados[caso.id]?.passou).length;
  const comResultado = estado.casos.filter((caso) => estado.resultados[caso.id]).length;

  const adicionar = () => {
    if (!entrada.trim() && !esperado.trim()) return;
    if (casos.escrever(entrada, esperado)) {
      setEntrada("");
      setEsperado("");
      campoNovaEntrada.current?.focus();
    }
  };
  const aoTeclarNovo = (evento: KeyboardEvent<HTMLInputElement>) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      adicionar();
    }
  };
  const focar = (evento: { currentTarget: HTMLInputElement }) => {
    campoEmFoco.current = evento.currentTarget;
    setFocado(true);
    aoFocar?.();
  };
  // A barra some só quando o foco sai da área inteira (pular de um campo para o outro não pisca).
  const desfocar = () => {
    requestAnimationFrame(() => {
      if (!recipiente.current?.contains(document.activeElement)) setFocado(false);
    });
  };
  const camposDoCaso = (caso: CasoDoAluno) => ({
    entrada: {
      value: caso.entrada,
      onChange: (evento: ChangeEvent<HTMLInputElement>) => casos.editar(caso.id, { entrada: evento.target.value }),
    },
    esperado: {
      value: caso.esperado,
      onChange: (evento: ChangeEvent<HTMLInputElement>) => casos.editar(caso.id, { esperado: evento.target.value }),
    },
  });

  const botaoRodar = (
    <button
      type="button"
      onClick={casos.rodar}
      disabled={ocupado || casos.rodando || estado.casos.length === 0}
      className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border-2 border-primaria bg-primaria px-3 text-xs font-black text-sobre-primaria hover:brightness-110 disabled:opacity-60 pointer-coarse:h-11"
      data-rodar-casos
    >
      <IconeExecutar tamanho={12} />
      {casos.rodando ? "Rodando..." : "Rodar os casos"}
    </button>
  );

  return (
    <div ref={recipiente} className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-borda bg-painel shadow-[0_8px_0_var(--cor-sombra)]" data-casos-de-teste>
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b-2 border-borda bg-superficie px-3 py-2">
        <div className="min-w-0 flex-1 basis-40">
          <p className="text-[11px] font-black uppercase tracking-wide text-texto-suave">Casos de teste</p>
          <p className="truncate font-mono text-sm font-black text-primaria">{assinatura}</p>
        </div>
        {alvoRodar(botaoRodar)}
      </div>
      <div className="shrink-0 border-b-2 border-borda bg-superficie px-2.5 py-2" data-novo-caso>
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-mono text-[13px] font-bold text-texto-suave">{dados.funcao}(</span>
          <input
            ref={campoNovaEntrada}
            value={entrada}
            onChange={(evento) => setEntrada(evento.target.value)}
            onKeyDown={aoTeclarNovo}
            onFocus={focar}
            onBlur={desfocar}
            placeholder={dados.parametros.join(", ") || "sem argumentos"}
            aria-label="Entrada do caso novo"
            className={`${classeCampo} min-w-[6rem] flex-[2]`}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            disabled={cheia}
            data-entrada-nova
          />
          <span className="font-mono text-[13px] font-bold text-texto-suave">)</span>
          <span className="text-xs font-black text-texto-suave" aria-hidden="true">
            devolve
          </span>
          <input
            value={esperado}
            onChange={(evento) => setEsperado(evento.target.value)}
            onKeyDown={aoTeclarNovo}
            onFocus={focar}
            onBlur={desfocar}
            placeholder="esperado"
            aria-label="Saída esperada do caso novo"
            className={`${classeCampo} min-w-[4.5rem] flex-1`}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            disabled={cheia}
            data-esperado-novo
          />
          <button
            type="button"
            // Adicionar não tira o foco do campo: o teclado do celular continua aberto para o próximo caso.
            onPointerDown={(evento) => evento.preventDefault()}
            onClick={adicionar}
            disabled={cheia}
            className="inline-flex h-8 shrink-0 items-center rounded-full border-2 border-primaria px-3 text-xs font-black text-primaria hover:bg-hover disabled:opacity-60 pointer-coarse:h-11"
            data-adicionar-caso
          >
            Adicionar
          </button>
        </div>
        <p className="mt-1 text-[11px] text-texto-suave" aria-live="polite" data-resumo-casos>
          {cheia
            ? `A lista está cheia (${MAXIMO_CASOS} casos).`
            : comResultado
              ? `${passando} de ${estado.casos.length} passando na última rodada.`
              : "Textos vão entre aspas; listas, entre colchetes: [8, 6]."}
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
        {estado.casos.length === 0 ? (
          <p className="rounded-lg border-2 border-dashed border-borda px-3 py-3 text-center text-xs text-texto-suave">
            Escreva um exemplo em cima: a entrada, como numa chamada, e o que a função tem que devolver. Pense nos esquisitos também.
          </p>
        ) : (
          <ol className="flex flex-col gap-1.5" data-lista-casos>
            {estado.casos.map((caso, indice) => {
              const resultado = estado.resultados[caso.id];
              const situacao = situacaoDe(caso, resultado);
              const lido = lerCaso(caso);
              const campos = camposDoCaso(caso);
              const cor =
                situacao === "passou" ? "border-sucesso" : situacao === "falhou" ? "border-erro" : situacao === "ilegivel" ? "border-alerta" : "border-borda";
              return (
                <li key={caso.id} className={`rounded-xl border-2 bg-superficie p-1.5 ${cor}`} data-caso={indice} data-situacao-caso={situacao}>
                  <div className="flex flex-wrap items-center gap-1">
                    <span
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        situacao === "passou" ? "bg-sucesso text-superficie" : situacao === "falhou" ? "bg-erro text-superficie" : "bg-painel text-texto-suave"
                      }`}
                      aria-label={situacao === "passou" ? "Passou" : situacao === "falhou" ? "Falhou" : situacao === "ilegivel" ? "Não dá para ler" : "Ainda não rodou"}
                      role="img"
                    >
                      {situacao === "passou" ? <IconeCerto tamanho={14} /> : situacao === "falhou" ? <IconeX /> : <IconePendente />}
                    </span>
                    <span className="font-mono text-[13px] font-bold text-texto-suave">{dados.funcao}(</span>
                    <input
                      {...campos.entrada}
                      onFocus={focar}
                      onBlur={desfocar}
                      aria-label={`Entrada do caso ${indice + 1}`}
                      className={`${classeCampo} min-w-[6rem] flex-[2]`}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoComplete="off"
                      data-entrada-caso={indice}
                    />
                    <span className="font-mono text-[13px] font-bold text-texto-suave">)</span>
                    <span className="text-xs font-black text-texto-suave" aria-hidden="true">
                      devolve
                    </span>
                    <input
                      {...campos.esperado}
                      onFocus={focar}
                      onBlur={desfocar}
                      aria-label={`Saída esperada do caso ${indice + 1}`}
                      className={`${classeCampo} min-w-[4.5rem] flex-1`}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoComplete="off"
                      data-esperado-caso={indice}
                    />
                    <button
                      type="button"
                      onClick={() => casos.apagarPorId(caso.id)}
                      aria-label={`Apagar o caso ${indice + 1}`}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-texto-suave hover:bg-hover hover:text-texto pointer-coarse:h-11 pointer-coarse:w-11"
                      data-apagar-caso={indice}
                    >
                      <IconeFechar tamanho={12} />
                    </button>
                  </div>
                  <p className="mt-1 px-1 font-mono text-xs text-texto-suave" aria-live="polite" data-resultado-caso={indice}>
                    {!lido.ok
                      ? `Não dá para ler: ${lido.motivo}`
                      : !resultado
                        ? "Ainda não rodou com este caso."
                        : resultado.erro
                          ? `Deu erro: ${resultado.erro}`
                          : resultado.passou
                            ? `Passou: veio ${resultado.obtido}`
                            : `Falhou: veio ${resultado.obtido ?? "nada"}`}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </div>
      {toque && focado && <BarraSimbolos aoInserir={(simbolo) => inserirNoCampo(campoEmFoco.current, simbolo)} />}
    </div>
  );
}
