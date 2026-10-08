"use client";

/*
 * O modo das animações do mundo: "completas" ou "leves" (menos coisas se
 * mexendo: sem peixes, baleia nem gaivotas, metade dos reflexos e das
 * estrelas piscando, um anel de espuma e no máximo duas nuvens; o resto igual).
 *
 * Quem escolhe no menu (progresso.animacoes) manda. No automático, o modo
 * leve liga sozinho num aparelho fraco: pouca memória ou poucos núcleos
 * (o que o navegador conta), ou a rolagem do mundo travando nos primeiros
 * segundos rolando (abaixo de 45 quadros por segundo, ou mais de um quarto
 * dos quadros acima de 25 ms). Os primeiros quadros da primeira rolagem não
 * contam: neles caem custos de uma vez só (o primeiro toque destrava o som). O modo leve decidido sozinho fica
 * guardado no aparelho (chave própria e só cosmética), para não medir de novo
 * a cada visita; o completo mede de novo na próxima.
 */
import { type RefObject, useEffect, useState } from "react";
import { useProgresso } from "@/lib/armazemProgresso";

export type ModoAnimacoes = "completas" | "leves";

const CHAVE = "ilha-sites:mundo:animacoes-automaticas";
/** Abaixo disto (quadros por segundo rolando), o automático liga o modo leve. */
const QPS_MINIMO = 45;
/** Um quadro lento (ms) e quantos deles, no máximo, antes de ligar o modo leve. */
const QUADRO_LENTO_MS = 25;
const LENTOS_MAXIMO = 0.25;
/** Quantos quadros de rolagem descartar no começo e quantos medir antes de decidir. */
const QUADROS_DESCARTADOS = 30;
const QUADROS_PARA_DECIDIR = 90;
/** Quanto tempo depois do último evento de rolagem ainda conta como rolando. */
const ROLANDO_MS = 150;
/** Por quanto tempo, desde que o mundo abre, o automático fica de olho. */
const OLHANDO_MS = 60_000;

function lerGuardado(): ModoAnimacoes | null {
  try {
    const valor = localStorage.getItem(CHAVE);
    return valor === "leves" ? valor : null;
  } catch {
    return null;
  }
}

function guardarLeve() {
  try {
    localStorage.setItem(CHAVE, "leves");
  } catch {
    // Sem armazenamento: mede de novo na próxima visita.
  }
}

/** O aparelho se diz fraco (memória em GB e núcleos, quando o navegador conta). */
function aparelhoFraco(): boolean {
  if (typeof navigator === "undefined") return false;
  const memoria = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const nucleos = navigator.hardwareConcurrency;
  return (memoria !== undefined && memoria <= 2) || (nucleos !== undefined && nucleos > 0 && nucleos <= 2);
}

/** O modo leve decidido sozinho (antes de medir): o guardado no aparelho, ou o aparelho fraco. */
function modoInicial(): ModoAnimacoes {
  return lerGuardado() ?? (aparelhoFraco() ? "leves" : "completas");
}

/**
 * O modo das animações do mundo e se foi decidido sozinho. `area` contém a
 * área que rola (o automático ouve a rolagem na captura e mede os quadros).
 */
export function useModoAnimacoes(area: RefObject<HTMLElement | null>): { modo: ModoAnimacoes; automatico: boolean } {
  const { animacoes } = useProgresso();
  const automatico = animacoes === "auto";
  const [decidido, setDecidido] = useState<ModoAnimacoes>(modoInicial);

  // No automático e ainda completo: mede os quadros enquanto a pessoa rola.
  useEffect(() => {
    const elemento = area.current;
    if (!automatico || decidido === "leves" || !elemento) return;
    const inicio = performance.now();
    let pronto = false;
    let ultimaRolagem = -Infinity;
    let anterior = 0;
    let descartados = 0;
    let quadros = 0;
    let lentos = 0;
    let tempo = 0;
    let pedido = 0;
    const medir = (agora: number) => {
      pedido = 0;
      if (anterior && agora - ultimaRolagem < ROLANDO_MS) {
        // Um quadro muito longo (a aba escondida, uma pausa) não é rolagem: não conta.
        const delta = agora - anterior;
        if (descartados < QUADROS_DESCARTADOS) descartados += 1;
        else if (delta < 250) {
          quadros += 1;
          tempo += delta;
          if (delta > QUADRO_LENTO_MS) lentos += 1;
        }
      }
      anterior = agora;
      if (quadros >= QUADROS_PARA_DECIDIR) {
        // Decide uma vez por visita: rolando devagar demais, liga o modo leve (e guarda).
        pronto = true;
        if ((quadros / tempo) * 1000 < QPS_MINIMO || lentos / quadros > LENTOS_MAXIMO) {
          guardarLeve();
          setDecidido("leves");
        }
        return;
      }
      if (agora - ultimaRolagem < ROLANDO_MS) pedido = requestAnimationFrame(medir);
      else anterior = 0;
    };
    const aoRolar = () => {
      const agora = performance.now();
      if (pronto || agora - inicio > OLHANDO_MS) return;
      ultimaRolagem = agora;
      if (!pedido) pedido = requestAnimationFrame(medir);
    };
    elemento.addEventListener("scroll", aoRolar, { passive: true, capture: true });
    return () => {
      elemento.removeEventListener("scroll", aoRolar, { capture: true });
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, [area, automatico, decidido]);

  return { modo: automatico ? decidido : animacoes, automatico };
}
