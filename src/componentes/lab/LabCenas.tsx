"use client";

/*
 * O mostruário do kit de cenas (/lab/cenas): as duas cenas de referência e
 * cada peça e cada dispositivo do kit, nos estados que eles têm, em todos os
 * temas de base. É o padrão visual que as próximas cenas seguem: quem
 * acrescenta uma peça confere aqui (guia, seção 30).
 */
import type { ReactNode } from "react";
import { CenaSvg } from "@/componentes/cena/CenaSvg";
import { PecaDoCenario, TAMANHO_PADRAO } from "@/componentes/cena/kit/PecasCenario";
import { CENA_QUARTO, CENA_VITRINE } from "@/conteudo/laboratorio/cenasDeReferencia";
import { CATALOGO_DISPOSITIVOS } from "@/motor/cena/catalogo";
import { type DadosCena, type DispositivoCena, type MudancaCena, PECAS_CENARIO, type RastroCena, rastroInicial, type ValorCena } from "@/motor/cena/modelo";
import { TEMAS } from "@/tema/temas";

type Amostra = { rotulo: string; dados: DadosCena; rastro: RastroCena; tempoMs: number };

/** Uma cena pequena com um dispositivo só, num estado (as mudanças no instante 0). */
function amostra(rotulo: string, dispositivo: DispositivoCena, mudancas: [string, ValorCena, string][], tempoMs: number, extra: Partial<DadosCena> = {}): Amostra {
  const dados: DadosCena = {
    id: `kit-${dispositivo.tipo}`,
    titulo: rotulo,
    ambiente: "kit",
    periodo: "noite",
    duracaoMs: 10_000,
    cenario: [
      { peca: "parede", x: 0, y: 0, largura: 320, altura: 152 },
      { peca: "piso", x: 0, y: 150, largura: 320, altura: 50 },
    ],
    dispositivos: [dispositivo],
    linhaDoTempo: [],
    ...extra,
  };
  const lista: MudancaCena[] = mudancas.map(([propriedade, valor, acao]) => ({ tempoMs: 0, dispositivo: dispositivo.id, propriedade, valor, acao, execucao: 1, passo: null }));
  return { rotulo, dados, rastro: { ...rastroInicial(dados), mudancas: lista, fimCodigoMs: 0, relogioMs: 10_000 }, tempoMs };
}

const AMOSTRAS: Amostra[] = [
  amostra("Lâmpada apagada", { id: "lampada", tipo: "lampada", x: 160, y: 60, escala: 1.6 }, [], 100),
  amostra("Lâmpada acesa", { id: "lampada", tipo: "lampada", x: 160, y: 60, escala: 1.6 }, [["ligada", true, "ligar"]], 100),
  amostra("Lâmpada com brilho 40", { id: "lampada", tipo: "lampada", x: 160, y: 60, escala: 1.6 }, [["ligada", true, "ligar"], ["brilho", 40, "brilho"]], 100),
  amostra("Spot aceso", { id: "luz", tipo: "lampada", x: 160, y: 30, escala: 1.6, variante: "spot" }, [["ligada", true, "ligar"]], 100),
  amostra("Sensor sem ninguém", { id: "sensor", tipo: "sensor", x: 200, y: 60, escala: 1.8 }, [], 100),
  amostra("Sensor vendo alguém", { id: "sensor", tipo: "sensor", x: 200, y: 60, escala: 1.8 }, [], 1200, { linhaDoTempo: [{ tipo: "pessoa", chegaMs: 500, x: 130 }] }),
  amostra("Interruptor desligado", { id: "interruptor", tipo: "interruptor", x: 160, y: 90, escala: 2.2 }, [], 100),
  amostra("Interruptor ligado", { id: "interruptor", tipo: "interruptor", x: 160, y: 90, escala: 2.2, inicial: { ligado: true } }, [], 100),
  amostra("Portão fechado", { id: "portao", tipo: "portao", x: 50, y: 84, escala: 1.1 }, [], 100),
  amostra("Portão abrindo", { id: "portao", tipo: "portao", x: 50, y: 84, escala: 1.1 }, [["aberto", true, "abrir"]], 600),
  amostra("Portão aberto", { id: "portao", tipo: "portao", x: 50, y: 84, escala: 1.1 }, [["aberto", true, "abrir"]], 2000),
  amostra("Letreiro acendendo", { id: "letreiro", tipo: "letreiro", x: 48, y: 50, escala: 2 }, [["texto", "ABERTO", "mostrar"]], 230),
  amostra("Letreiro aceso", { id: "letreiro", tipo: "letreiro", x: 48, y: 50, escala: 2 }, [["texto", "ABERTO", "mostrar"]], 2000),
  amostra("Forno frio", { id: "forno", tipo: "forno", x: 112, y: 70, escala: 1.5 }, [], 100),
  amostra("Forno quente", { id: "forno", tipo: "forno", x: 112, y: 70, escala: 1.5 }, [["ligado", true, "ligar"]], 5000),
  amostra("Ventilador parado", { id: "ventilador", tipo: "ventilador", x: 160, y: 160, escala: 1.8 }, [], 100),
  amostra("Ventilador na 3", { id: "ventilador", tipo: "ventilador", x: 160, y: 160, escala: 1.8 }, [["velocidade", 3, "velocidade"]], 120),
];

/** As cenas de referência num momento bom: o quarto aceso e a vitrine acesa com a pessoa na frente. */
const REFERENCIAS: Amostra[] = [
  { rotulo: CENA_QUARTO.titulo, dados: CENA_QUARTO, rastro: { ...rastroInicial(CENA_QUARTO), mudancas: [{ tempoMs: 0, dispositivo: "lampada", propriedade: "ligada", valor: true, acao: "ligar", execucao: 1, passo: null }, { tempoMs: 0, dispositivo: "ventilador", propriedade: "velocidade", valor: 2, acao: "velocidade", execucao: 1, passo: null }], fimCodigoMs: 0, relogioMs: 6000 }, tempoMs: 400 },
  { rotulo: CENA_VITRINE.titulo, dados: CENA_VITRINE, rastro: { ...rastroInicial(CENA_VITRINE), mudancas: [{ tempoMs: 3000, dispositivo: "luz", propriedade: "ligada", valor: true, acao: "ligar", execucao: 1, passo: null }], fimCodigoMs: 10_000, relogioMs: 10_000 }, tempoMs: 4500 },
];

function Quadro({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <figure className="flex flex-col gap-1">
      <div className="aspect-[16/10] overflow-hidden rounded-xl border-2 border-borda bg-painel">{children}</div>
      <figcaption className="text-xs font-bold text-texto-suave">{rotulo}</figcaption>
    </figure>
  );
}

export function LabCenas() {
  return (
    <main className="min-h-dvh bg-fundo p-4 text-texto sm:p-6">
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-black text-primaria">Kit de cenas</h1>
        <p className="text-texto-suave">As cenas de referência, as peças e os dispositivos do kit, em todos os temas. Cores só por tokens (--cor-cena-*).</p>
      </header>
      <div className="grid gap-8">
        {TEMAS.filter((tema) => !tema.doJogador).map((tema) => (
          <section key={tema.id} data-theme={tema.id} aria-label={`Tema ${tema.nome}`} className="rounded-2xl border-2 border-borda bg-fundo p-4 text-texto">
            <h2 className="mb-3 text-lg font-black text-primaria">{tema.nome}</h2>
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              {REFERENCIAS.map((ref) => (
                <Quadro key={ref.rotulo} rotulo={ref.rotulo}>
                  <CenaSvg dados={ref.dados} rastro={ref.rastro} tempoMs={ref.tempoMs} />
                </Quadro>
              ))}
            </div>
            <h3 className="mb-2 font-black">Peças do cenário</h3>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {PECAS_CENARIO.map((peca) => {
                const [largura, altura] = TAMANHO_PADRAO[peca];
                const folga = 10;
                return (
                  <Quadro key={peca} rotulo={peca}>
                    <svg viewBox={`${-folga} ${-folga} ${largura + folga * 2} ${altura + folga * 2}`} className="h-full w-full" aria-hidden="true">
                      <PecaDoCenario peca={{ peca, x: 0, y: 0, variante: peca === "parede" ? "listras" : undefined }} periodo="noite" id={`kit-${tema.id}`} />
                    </svg>
                  </Quadro>
                );
              })}
            </div>
            <h3 className="mb-2 font-black">Dispositivos</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {AMOSTRAS.map((item) => (
                <Quadro key={item.rotulo} rotulo={`${item.rotulo} (${CATALOGO_DISPOSITIVOS[item.dados.dispositivos[0].tipo].classe})`}>
                  <CenaSvg dados={item.dados} rastro={item.rastro} tempoMs={item.tempoMs} />
                </Quadro>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
