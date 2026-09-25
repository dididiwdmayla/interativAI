"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMusicaDaTela } from "@/audio/ganchos";
import { Mascote } from "@/componentes/mascote/Mascote";
import { faseDoId, localDaFase } from "@/conteudo";
import { localNoCurriculo } from "@/curriculo";
import { atualizarProgresso, obterProgresso, useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import { faseLiberada } from "@/lib/liberacao";
import type { EstadoFaseSalvo } from "@/lib/progresso";
import { ROTA_MUNDO, rotaDaFase, rotaDaIlha } from "@/lib/rotas";
import { JogoFase } from "./JogoFase";
import { TelaCarregando } from "./TelaCarregando";

/** Revisão aberta pelo "Rever" do desafio: qual fase rever e para qual desafio voltar. */
type Revisao = { faseId: string; desafioId: string };

/** A ilha (no mapa) de uma unidade de conteúdo. */
function ilhaDaUnidade(unidadeId: string): string | null {
  return localNoCurriculo(unidadeId)?.ilha.id ?? null;
}

/** Fase que ainda não abriu (endereço digitado direto): volta para a ilha. */
function FaseTrancada({ ilhaId }: { ilhaId: string | null }) {
  return (
    <div className="grid h-dvh place-items-center p-6 text-center">
      <div className="max-w-sm rounded-3xl border-2 border-borda bg-superficie p-6" data-fase-trancada>
        <Mascote expressao="pensativo" tamanho={96} className="mx-auto" />
        <p className="mt-2 text-lg font-black text-texto">Essa fase ainda está trancada.</p>
        <p className="mt-1 text-sm font-bold text-texto-suave">Ela abre quando você terminar a fase de antes. O mapa mostra o caminho.</p>
        <Link href={ilhaId ? rotaDaIlha(ilhaId) : ROTA_MUNDO} className="mt-4 inline-block font-black text-primaria underline">
          Voltar ao mapa
        </Link>
      </div>
    </div>
  );
}

/**
 * Uma fase aberta pelo endereço (/fase/[id]). Só monta a fase no navegador,
 * depois de ler o progresso salvo, para o editor e o iframe já nascerem com
 * o HTML de onde o jogador parou. Também cuida da próxima fase e da revisão
 * pedida pelo desafio (que acontece aqui mesmo, sem mudar o endereço).
 */
export function Jogo({ faseId }: { faseId: string }) {
  const carregado = useProgressoCarregado();
  const progresso = useProgresso();
  const router = useRouter();
  const [rodada, setRodada] = useState(0);
  const [revisao, setRevisao] = useState<Revisao | null>(null);
  const faseDaRota = faseDoId(faseId);
  const liberada = carregado && faseDaRota !== undefined && faseLiberada(faseDaRota, progresso);
  // A fase toca a música da ilha dela (a mesma do mapa da ilha: não reinicia).
  useMusicaDaTela({ tipo: "fase", ilhaId: faseDaRota ? ilhaDaUnidade(faseDaRota.unidadeId) : null });

  // A fase aberta vira a fase atual: o mapa põe o computadorzinho nela e o card diz "Continuar".
  useEffect(() => {
    if (!liberada || obterProgresso().faseAtual === faseId) return;
    atualizarProgresso((atual) => ({ ...atual, faseAtual: faseId }));
  }, [faseId, liberada]);

  if (!carregado || !faseDaRota) return <TelaCarregando />;
  if (!liberada) return <FaseTrancada ilhaId={ilhaDaUnidade(faseDaRota.unidadeId)} />;

  const fase = revisao ? (faseDoId(revisao.faseId) ?? faseDaRota) : faseDaRota;
  const ilhaId = ilhaDaUnidade(faseDaRota.unidadeId);

  const irParaFase = (id: string) => {
    setRevisao(null);
    router.push(rotaDaFase(id));
  };

  const recomecar = () => {
    atualizarProgresso((atual) => {
      const fasesEmAndamento: Record<string, EstadoFaseSalvo> = {};
      for (const [id, estado] of Object.entries(atual.fasesEmAndamento)) {
        if (id !== fase.id) fasesEmAndamento[id] = estado;
      }
      return { ...atual, fasesEmAndamento };
    });
    setRodada((valor) => valor + 1);
  };

  return (
    <JogoFase
      key={`${fase.id}-${revisao ? "revisao" : "jogo"}-${rodada}`}
      fase={fase}
      local={localDaFase(fase)}
      modo={revisao ? "revisao" : "jogo"}
      rotaDoMapa={ilhaId ? rotaDaIlha(ilhaId) : ROTA_MUNDO}
      aoRecomecar={recomecar}
      aoIrParaFase={irParaFase}
      aoVoltarAIlha={() => router.push(ilhaId ? rotaDaIlha(ilhaId) : ROTA_MUNDO)}
      aoRever={(id) => setRevisao({ faseId: id, desafioId: fase.id })}
      aoVoltarAoDesafio={() => setRevisao(null)}
    />
  );
}
