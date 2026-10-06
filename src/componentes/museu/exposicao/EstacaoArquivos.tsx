"use client";

/*
 * Arquivos e pastas (sala 4): o explorador como árvore. A raiz no topo,
 * pastas que abrem e fecham, arquivos nas pontas. Escolher um arquivo
 * mostra o caminho (a trilha da raiz até ele) e o Mover para leva o
 * arquivo para outra pasta. "Ver como árvore" desenha a mesma coisa como
 * a árvore da zona Estruturas de dados: raiz, galhos e folhas.
 */
import { motion, useReducedMotion } from "framer-motion";
import {
  caminhoDe,
  type EstacaoArquivos as DadosArquivos,
  type EstadoArquivos,
  filhosDeAgora,
  type NoArquivo,
  paisDeAgora,
  todosOsNos,
} from "@/motor/exposicao/simulacoes/arquivos";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

function IconeNo({ no, aberta }: { no: NoArquivo; aberta: boolean }) {
  return no.tipo === "pasta" ? (
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-[var(--cor-ante-latao)]" aria-hidden="true">
      <path d={aberta ? "M2 5h5l1.5 1.5H17v2H5.5L3 15H2z" : "M2 4.5h5l1.5 1.5H18v10H2z"} fill="currentColor" stroke="var(--cor-ante-latao-sombra)" strokeWidth="1.2" />
      {aberta && <path d="M5.5 8.5H19L16.5 16H3z" fill="currentColor" stroke="var(--cor-ante-latao-sombra)" strokeWidth="1.2" />}
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-texto-suave" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 2h7l4 4v12H5z" fill="var(--cor-superficie)" />
      <path d="M12 2v4h4M7.5 10h6M7.5 13h4" />
    </svg>
  );
}

/** A mesma pasta desenhada como árvore (nós e galhos), com o escolhido aceso. */
function DesenhoDaArvore({ dados, estado }: { dados: DadosArquivos; estado: EstadoArquivos }) {
  const reduzir = useReducedMotion();
  // Camadas pela profundidade; cada nó no meio dos filhos.
  const posicoes = new Map<string, { x: number; y: number }>();
  let folha = 0;
  const colocar = (no: NoArquivo, nivel: number): number => {
    const filhos = no.tipo === "pasta" ? filhosDeAgora(dados, estado, no.id) : [];
    const xs = filhos.map((filho) => colocar(filho, nivel + 1));
    const x = xs.length ? (xs[0] + xs[xs.length - 1]) / 2 : folha++;
    posicoes.set(no.id, { x, y: nivel });
    return x;
  };
  colocar(dados.raiz, 0);
  const largura = Math.max(1, folha);
  const niveis = Math.max(...[...posicoes.values()].map((p) => p.y)) + 1;
  const px = (x: number) => 30 + (x / Math.max(1, largura - 1)) * 440;
  const py = (y: number) => 24 + y * 62;
  const pais = paisDeAgora(dados, estado);
  const nos = todosOsNos(dados.raiz);
  return (
    <svg viewBox={`0 0 500 ${py(niveis - 1) + 34}`} className="h-auto w-full rounded-xl border-2 border-borda bg-painel" role="img" aria-label="A mesma pasta desenhada como árvore: a raiz em cima, as pastas são galhos e os arquivos, folhas" data-desenho-arvore>
      {nos.map((no) => {
        const pai = pais[no.id];
        const a = posicoes.get(no.id);
        const b = pai ? posicoes.get(pai) : undefined;
        return a && b ? <line key={`l-${no.id}`} x1={px(b.x)} y1={py(b.y)} x2={px(a.x)} y2={py(a.y)} stroke="var(--cor-ante-madeira)" strokeWidth="3" /> : null;
      })}
      {nos.map((no) => {
        const p = posicoes.get(no.id);
        if (!p) return null;
        const escolhido = estado.escolhido === no.id;
        return (
          <motion.g key={no.id} initial={reduzir ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduzir ? 0 : p.y * 0.12 }}>
            {no.tipo === "pasta" ? (
              <rect x={px(p.x) - 13} y={py(p.y) - 11} width="26" height="22" rx="5" fill={escolhido ? "var(--cor-secundaria)" : "var(--cor-ante-latao)"} stroke="var(--cor-ante-latao-sombra)" strokeWidth="2" />
            ) : (
              <circle cx={px(p.x)} cy={py(p.y)} r="10" fill={escolhido ? "var(--cor-secundaria)" : "var(--cor-grama)"} stroke="var(--cor-grama-sombra)" strokeWidth="2" />
            )}
            <text x={px(p.x)} y={py(p.y) + 26} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="var(--cor-texto)">
              {no.nome}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

export function EstacaoArquivos({ estacao, estado, mexer, toque, destaque }: PropsEstacao<DadosArquivos, EstadoArquivos>) {
  const comando = (texto: string) => mexer({ tipo: "comandoNaEstacao", estacao: estacao.id, comando: texto });
  const porId = new Map(todosOsNos(estacao.raiz).map((no) => [no.id, no]));
  const escolhido = estado.escolhido ? porId.get(estado.escolhido) : undefined;
  const pais = paisDeAgora(estacao, estado);
  const pastas = todosOsNos(estacao.raiz).filter((no) => no.tipo === "pasta");
  const linha = (no: NoArquivo, nivel: number): React.ReactNode => {
    const aberta = no.tipo === "pasta" && estado.abertas.includes(no.id);
    const ativo = estado.escolhido === no.id;
    const filhos = aberta ? filhosDeAgora(estacao, estado, no.id) : [];
    const raiz = no.id === estacao.raiz.id;
    return (
      <li key={no.id}>
        <button
          type="button"
          onClick={() => {
            if (no.tipo === "pasta" && !raiz) comando(`abrir:${no.id}`);
            if (no.tipo === "arquivo" || raiz) comando(`escolher:${no.id}`);
          }}
          style={{ paddingLeft: `${nivel * 18 + 6}px` }}
          className={`flex w-full items-center gap-1.5 rounded-lg py-1 pr-2 text-left text-sm font-bold pointer-coarse:min-h-10 ${ativo ? "bg-selecao text-texto" : "text-texto hover:bg-hover"} ${destaque?.peca === no.id ? "animate-pulse ring-4 ring-destaque" : ""}`}
          aria-expanded={no.tipo === "pasta" && !raiz ? aberta : undefined}
          data-no-arquivo={no.id}
          data-comando={no.tipo === "pasta" && !raiz ? `abrir:${no.id}` : `escolher:${no.id}`}
          data-aberta={aberta ? "sim" : "nao"}
        >
          {no.tipo === "pasta" && !raiz && (
            <svg viewBox="0 0 10 10" className={`h-2.5 w-2.5 shrink-0 transition-transform ${aberta ? "rotate-90" : ""}`} aria-hidden="true">
              <path d="M3 1.5 7 5l-4 3.5z" fill="currentColor" />
            </svg>
          )}
          <IconeNo no={no} aberta={aberta || raiz} />
          {no.nome}
        </button>
        {(aberta || raiz) && filhos.length > 0 && <ul className="border-l-2 border-dashed border-borda" style={{ marginLeft: `${nivel * 18 + 14}px` }}>{filhos.map((filho) => linha(filho, nivel + 1))}</ul>}
        {(aberta || raiz) && filhos.length === 0 && no.tipo === "pasta" && (
          <p className="text-[11px] italic text-texto-suave" style={{ paddingLeft: `${(nivel + 1) * 18 + 6}px` }}>
            (pasta vazia)
          </p>
        )}
      </li>
    );
  };
  return (
    <div className="flex flex-col gap-2" data-estacao-arquivos={estacao.id}>
      {/* A barra do caminho, como no explorador. */}
      <p className="flex min-h-9 flex-wrap items-center gap-1 rounded-lg border-2 border-borda bg-painel px-2 py-1 font-codigo text-xs text-texto" aria-live="polite" data-caminho-arquivo>
        {escolhido ? caminhoDe(estacao, estado, escolhido.id).join(" / ") : `${toque ? "Toque" : "Clique"} num arquivo para ver o caminho dele.`}
      </p>
      <div className="flex flex-col gap-2 lg:flex-row">
        <NucleoDaEstacao tipo="arquivos" className="min-w-0 flex-1 rounded-2xl border-2 border-borda bg-superficie p-1">
          <ul>{linha(estacao.raiz, 0)}</ul>
        </NucleoDaEstacao>
        {escolhido?.tipo === "arquivo" && (
          <section className="flex flex-col gap-1 rounded-2xl border-2 border-borda bg-superficie p-2 lg:w-56" aria-label={`Mover ${escolhido.nome}`}>
            <p className="text-xs font-black text-texto">Mover {escolhido.nome} para:</p>
            {pastas.map((pasta) => (
              <button
                key={pasta.id}
                type="button"
                disabled={pais[escolhido.id] === pasta.id}
                onClick={() => comando(`mover:${escolhido.id}>${pasta.id}`)}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border-2 border-borda px-2 text-left text-xs font-bold text-texto hover:bg-hover disabled:opacity-40 pointer-coarse:min-h-10 ${destaque?.peca === `mover:${pasta.id}` ? "animate-pulse ring-4 ring-destaque" : ""}`}
                data-comando={`mover:${escolhido.id}>${pasta.id}`}
              >
                <IconeNo no={pasta} aberta={false} />
                {caminhoDe(estacao, estado, pasta.id).slice(1).join(" / ") || pasta.nome}
              </button>
            ))}
          </section>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => comando("ver-arvore")}
          disabled={estado.viuArvore}
          className={`self-start inline-flex min-h-10 items-center rounded-full border-2 border-secundaria bg-superficie px-3 text-xs font-black text-texto hover:bg-hover disabled:opacity-60 pointer-coarse:min-h-11 ${destaque?.peca === "ver-arvore" ? "animate-pulse ring-4 ring-destaque" : ""}`}
          data-comando="ver-arvore"
        >
          {estado.viuArvore ? "A mesma pasta, como árvore:" : "Ver como árvore"}
        </button>
        {estado.viuArvore && <DesenhoDaArvore dados={estacao} estado={estado} />}
      </div>
    </div>
  );
}
