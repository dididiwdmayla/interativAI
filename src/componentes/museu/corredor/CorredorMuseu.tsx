"use client";

/*
 * O Museu das Origens (/ilha/origens): um corredor de épocas. Deitado e no
 * computador, ele corre de lado (a rodinha do mouse também anda); em pé,
 * de cima para baixo. A parede do fundo anda mais devagar que as peças (a
 * profundidade). Cada época tem um antepassado do computadorzinho, em
 * silhueta, que acorda quando o aluno chega perto, com o som da época dele,
 * e cumprimenta do seu jeito; o computadorzinho, que guia a visita, reage
 * a cada parente. No fim, a árvore da família, com o lugar da próxima
 * geração. Com "menos movimento", sem profundidade nem animações (eles
 * acordam do mesmo jeito).
 */
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMusicaDaTela } from "@/audio/ganchos";
import { audioLiberado, tocarEfeito } from "@/audio/motor";
import type { IdEfeito } from "@/audio/efeitos";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { useLayoutJogo } from "@/componentes/jogo/movel/useLayoutJogo";
import { BarraMapa } from "@/componentes/mapa/BarraMapa";
import { BotaoVoltarAoMundo } from "@/componentes/mapa/ilha/TelaIlha";
import { Mascote } from "@/componentes/mascote/Mascote";
import { ilhaDoId } from "@/curriculo";
import { atualizarProgresso, useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import { epocasDoCorredor, proximaGeracaoAberta } from "@/lib/museu";
import type { RetratoDoAluno } from "@/lib/progresso";
import { useMontado } from "@/lib/useMontado";
import { FICHAS_ANTEPASSADOS } from "@/motor/exposicao/antepassados";
import type { IdAntepassado } from "@/motor/exposicao/modelo";
import { ArvoreDaFamilia } from "./ArvoreDaFamilia";
import { CriadorDeRetrato } from "./CriadorDeRetrato";
import { EpocaDoCorredor } from "./EpocaDoCorredor";

/** Depois de acordar, o antepassado espera um tiquinho (o som da época) antes de falar. */
const MS_ATE_FALAR = 900;

/** Fachada do museu: frontão e colunas. */
function Fachada() {
  return (
    <svg viewBox="0 0 320 130" className="h-auto w-full max-w-xs" aria-hidden="true">
      <path d="M20 44L160 6l140 38z" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="160" cy="30" r="9" fill="var(--cor-destaque)" />
      <rect x="24" y="44" width="272" height="12" rx="3" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="2" />
      {[40, 90, 140, 190, 240].map((x) => (
        <rect key={x} x={x} y="58" width="22" height="56" rx="3" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="2" />
      ))}
      <rect x="14" y="114" width="292" height="12" rx="3" fill="var(--cor-pedra-sombra)" />
    </svg>
  );
}

/** A coluna que separa uma época da outra. */
function Coluna({ vertical }: { vertical: boolean }) {
  if (vertical) return <div aria-hidden="true" className="mx-6 h-3 shrink-0 rounded-full bg-[var(--cor-museu-rodape)] opacity-70" />;
  return (
    <div aria-hidden="true" className="relative h-full w-6 shrink-0">
      <div className="absolute inset-y-6 left-1 w-4 rounded-t-lg bg-[var(--cor-pedra)] shadow-[inset_-4px_0_0_var(--cor-pedra-sombra)]" />
      <div className="absolute left-0 top-4 h-3 w-6 rounded bg-[var(--cor-pedra-sombra)]" />
    </div>
  );
}

const SOM_DA_EPOCA: Partial<Record<IdAntepassado, IdEfeito>> = {
  tecela: "epoca-tecela",
  engrenagens: "epoca-engrenagens",
  valvulas: "epoca-valvulas",
  terminal: "epoca-terminal",
  pc: "epoca-pc",
  internet: "epoca-internet",
  celular: "epoca-celular",
  computadorzinho: "acordar",
};

type Props = { ilhaId: string };

export function CorredorMuseu({ ilhaId }: Props) {
  const carregado = useProgressoCarregado();
  const progresso = useProgresso();
  const ilha = ilhaDoId(ilhaId);
  const layout = useLayoutJogo();
  // Em pé e deitado (baixinho), o corredor desce; no computador, corre de lado.
  const vertical = layout !== "desktop";
  const deitado = layout === "paisagem";
  const reduzir = useReducedMotion() ?? false;
  const montado = useMontado();
  const animar = montado && !reduzir;
  useMusicaDaTela({ tipo: "museu" });
  // Porta antiga rangendo (só depois do primeiro gesto; no endereço direto, fica quieto).
  useEffect(() => {
    if (audioLiberado()) tocarEfeito("abrir-museu");
  }, []);

  const epocas = useMemo(() => epocasDoCorredor(progresso), [progresso]);
  const aberta = proximaGeracaoAberta(progresso);
  const retrato = progresso.proximaGeracao;

  /* ---------------------------------------------------------------- acordar */
  const trilho = useRef<HTMLDivElement>(null);
  const [acordados, setAcordados] = useState<readonly IdAntepassado[]>([]);
  const [falando, setFalando] = useState<readonly IdAntepassado[]>([]);
  const [guia, setGuia] = useState("Esses são os meus antepassados! Eles estão cochilando. Chega perto que eles acordam.");
  // A fala do guia: cada recado novo abre; no celular deitado (pouca altura), recolhe sozinha depois de um tempo.
  const [guiaAberto, setGuiaAberto] = useState(true);
  const [guiaConhecido, setGuiaConhecido] = useState(guia);
  if (guiaConhecido !== guia) {
    setGuiaConhecido(guia);
    setGuiaAberto(true);
  }
  useEffect(() => {
    if (!deitado || !guiaAberto) return;
    const recolher = setTimeout(() => setGuiaAberto(false), 6000);
    return () => clearTimeout(recolher);
  }, [deitado, guiaAberto, guia]);
  /** O guia está dando o recado da árvore (o lugar vazio esperando): as reações aos parentes esperam. */
  const recadoDaArvore = useRef(false);
  // Quem já acordou nesta visita (lido na hora: o observador pode avisar duas vezes seguidas).
  const jaAcordou = useRef(new Set<IdAntepassado>());
  const acordar = useCallback((id: IdAntepassado) => {
    if (jaAcordou.current.has(id)) return;
    jaAcordou.current.add(id);
    setAcordados((atual) => [...atual, id]);
    const som = SOM_DA_EPOCA[id];
    if (som) tocarEfeito(som);
    // Com o lugar da próxima geração esperando, o recado dele não sai da boca do guia.
    if (!recadoDaArvore.current) setGuia(FICHAS_ANTEPASSADOS[id].reacao);
    setTimeout(() => setFalando((agora) => (agora.includes(id) ? agora : [...agora, id])), MS_ATE_FALAR);
  }, []);
  useEffect(() => {
    const raiz = trilho.current;
    if (!raiz || !carregado) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const id = (entrada.target as HTMLElement).dataset.epoca as IdAntepassado | undefined;
          if (entrada.isIntersecting && id) acordar(id);
        }
      },
      { root: raiz, threshold: 0.6 },
    );
    raiz.querySelectorAll("[data-epoca]").forEach((elemento) => observador.observe(elemento));
    return () => observador.disconnect();
  }, [acordar, carregado, vertical]);

  /* ---------------------------------------------------------------- a rodinha anda de lado */
  useEffect(() => {
    const raiz = trilho.current;
    if (!raiz || vertical) return;
    const aoRolar = (evento: WheelEvent) => {
      if (Math.abs(evento.deltaY) <= Math.abs(evento.deltaX)) return;
      // Dentro de uma área que rola de pé (a árvore), a rodinha rola ela.
      const alvo = evento.target instanceof Element ? evento.target.closest("[data-rola-de-pe]") : null;
      if (alvo && alvo.scrollHeight > alvo.clientHeight) return;
      evento.preventDefault();
      raiz.scrollLeft += evento.deltaY;
    };
    raiz.addEventListener("wheel", aoRolar, { passive: false });
    return () => raiz.removeEventListener("wheel", aoRolar);
  }, [vertical, carregado]);

  /* ---------------------------------------------------------------- a profundidade */
  const { scrollX, scrollY } = useScroll({ container: trilho });
  const fundoX = useTransform(scrollX, (valor) => (animar && !vertical ? valor * 0.45 : 0));
  const fundoY = useTransform(scrollY, (valor) => (animar && vertical ? valor * 0.45 : 0));

  /* ---------------------------------------------------------------- a próxima geração */
  const arvore = useRef<HTMLDivElement>(null);
  const [criando, setCriando] = useState(false);
  const [festa, setFesta] = useState(false);
  // Direto, sem deslizar: deslizando, a família inteira acordaria de uma vez no caminho.
  const irParaArvore = useCallback(() => {
    arvore.current?.scrollIntoView({ behavior: "auto", inline: "center", block: "start" });
  }, []);
  // Terminou a sala 2 e o lugar ainda está vazio: o corredor leva o aluno até a árvore.
  const levou = useRef(false);
  useEffect(() => {
    if (!carregado || !aberta || retrato || levou.current) return;
    levou.current = true;
    const espera = setTimeout(() => {
      recadoDaArvore.current = true;
      setGuia("Lembra do lugar vazio no fim do corredor? Ele estava esperando por você.");
      irParaArvore();
    }, 900);
    return () => clearTimeout(espera);
  }, [aberta, carregado, irParaArvore, retrato]);

  const entrarParaFamilia = (novo: Omit<RetratoDoAluno, "desde">) => {
    const primeiraVez = !retrato;
    atualizarProgresso((atual) => ({ ...atual, proximaGeracao: { ...novo, desde: atual.proximaGeracao?.desde ?? Date.now() } }));
    setCriando(false);
    recadoDaArvore.current = false;
    if (primeiraVez) {
      setFesta(true);
      setGuia("Olha quem chegou na árvore! Escuta só a família...");
    } else {
      tocarEfeito("acerto");
      setGuia("Retrato novo! A família gostou.");
    }
  };

  if (!carregado || !ilha) return <TelaCarregando />;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[var(--cor-museu-parede)]" data-mapa="museu" data-ilha={ilha.id} data-corredor={vertical ? "vertical" : "horizontal"}>
      <BarraMapa caminho={["Mundo", `Ilha ${ilha.nome}`]} voltar={<BotaoVoltarAoMundo />} />
      <div className="relative min-h-0 flex-1">
        <div
          ref={trilho}
          tabIndex={0}
          aria-label="O corredor do museu"
          className={`h-full w-full ${vertical ? "overflow-y-auto overflow-x-hidden" : "overflow-x-auto overflow-y-hidden"} focus-visible:outline-4 focus-visible:outline-primaria`}
          data-trilho-museu
        >
          <div className={`relative flex ${vertical ? "w-full flex-col pb-28" : "h-full w-max flex-row pr-[20vw]"}`}>
            {/* A parede do fundo: arcos que andam mais devagar (a profundidade) */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                x: fundoX,
                y: fundoY,
                backgroundImage:
                  "radial-gradient(ellipse 70px 110px at 50% 100%, var(--cor-museu-parede-sombra) 98%, transparent 100%), linear-gradient(to bottom, transparent 0, transparent 62%, var(--cor-museu-rodape) 62%, var(--cor-museu-rodape) 63.5%, var(--cor-museu-piso) 63.5%)",
                backgroundSize: vertical ? "220px 340px, 100% 100%" : "260px 62%, 100% 100%",
                backgroundRepeat: "repeat-x, no-repeat",
              }}
            />
            {/* O chão: as tábuas em perspectiva */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%]"
              style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 58px, var(--cor-museu-piso-linha) 58px 60px)", opacity: 0.6 }}
            />
            {/* A entrada */}
            <section className={`relative z-10 flex shrink-0 flex-col items-center justify-center gap-2 text-center ${vertical ? "w-full px-6 pb-4 pt-6" : "h-full w-[min(86vw,28rem)] px-6"}`} data-entrada-museu>
              <Fachada />
              <h1 className="text-2xl font-black text-primaria">Museu das Origens</h1>
              <p className="max-w-xs text-sm font-bold text-texto-suave">
                Um corredor de épocas. Cada uma tem um antepassado do computadorzinho e, quase sempre, uma sala para explorar.
              </p>
              <p className="mt-2 rounded-full bg-[var(--cor-museu-placa)] px-3 py-1 text-xs font-black text-texto" aria-hidden="true">
                {vertical ? "Role para baixo" : "Role para o lado"} para visitar a família
              </p>
            </section>
            {epocas.map((epoca) => (
              <div key={epoca.ficha.id} className={`relative z-10 flex ${vertical ? "flex-col" : "h-full flex-row"}`}>
                <Coluna vertical={vertical} />
                <EpocaDoCorredor epoca={epoca} acordado={acordados.includes(epoca.ficha.id)} falando={falando.includes(epoca.ficha.id)} animar={animar} vertical={vertical} deitado={deitado} />
              </div>
            ))}
            {/* O fim do corredor: a árvore da família */}
            <div className={`relative z-10 flex ${vertical ? "flex-col" : "h-full flex-row"}`}>
              <Coluna vertical={vertical} />
              <div ref={arvore} className={`shrink-0 ${vertical ? "w-full px-4 py-4" : "h-full w-[min(92vw,30rem)] overflow-y-auto px-4 py-4"}`} data-rola-de-pe>
                <p className="mb-2 text-center text-xs font-black uppercase tracking-wide text-texto">A árvore da família</p>
                <ArvoreDaFamilia
                  aberta={aberta}
                  retrato={retrato}
                  festa={festa}
                  animar={animar}
                  aoOcupar={() => setCriando(true)}
                  aoTerminarFesta={() => setGuia("Cada um da família deixou alguma coisa para o próximo. Agora você também programa. A próxima invenção pode ser sua.")}
                />
              </div>
            </div>
          </div>
        </div>
        {/* O computadorzinho, que guia a visita */}
        <div className={`pointer-events-none absolute z-30 flex items-end gap-2 ${deitado ? "bottom-2 left-2 max-w-sm" : vertical ? "inset-x-2 bottom-2" : "left-3 top-3 max-w-md flex-row-reverse items-start justify-end"}`} data-guia-museu>
          <button
            type="button"
            onClick={() => setGuiaAberto((aberto) => !aberto)}
            aria-label={guiaAberto ? "Recolher a fala do computadorzinho" : "Ver a fala do computadorzinho"}
            aria-expanded={guiaAberto}
            className="pointer-events-auto shrink-0 rounded-full"
          >
            <Mascote expressao={festa ? "comemorando" : "apontando"} direcao="cima" tamanho={deitado ? 48 : vertical ? 64 : 84} />
          </button>
          {guiaAberto && (
            <p className="pointer-events-auto rounded-2xl border-2 border-borda bg-superficie px-3 py-2 text-sm font-bold text-texto shadow-[0_4px_0_var(--cor-sombra)]" aria-live="polite" data-fala-guia>
              {guia}
            </p>
          )}
        </div>
      </div>
      <CriadorDeRetrato
        key={retrato ? `${retrato.desde}-${retrato.nome}` : "novo"}
        aberto={criando}
        inicial={retrato ? { aparencia: retrato.aparencia, nome: retrato.nome } : null}
        aoFechar={() => setCriando(false)}
        aoConfirmar={entrarParaFamilia}
      />
    </div>
  );
}
