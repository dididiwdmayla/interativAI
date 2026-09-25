"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ListaFases } from "@/componentes/jogo/ListaFases";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { Botao } from "@/componentes/ui/Botao";
import { FASE_INICIAL } from "@/conteudo";
import { CURRICULO } from "@/curriculo";
import { atualizarProgresso, useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import { totalDeEstrelas } from "@/lib/mapa";
import { ROTA_MUNDO, rotaDaFase, rotaDaIlha } from "@/lib/rotas";

/**
 * /lab/mapa, só para testes (fora da navegação do jogo): desbloquear
 * tudo, resetar o progresso do mapa e a Lista de fases, que antes era a
 * navegação provisória do jogo.
 */
export function LabMapa() {
  const carregado = useProgressoCarregado();
  const progresso = useProgresso();
  const router = useRouter();
  const [listaAberta, setListaAberta] = useState(false);
  const [confirmandoReset, setConfirmandoReset] = useState(false);

  if (!carregado) return <TelaCarregando />;

  const alternarDesbloqueio = () =>
    atualizarProgresso((atual) => ({ ...atual, mapaDesbloqueado: !atual.mapaDesbloqueado }));

  // Tema, som, apresentações vistas e a altura da prévia ficam: é só o progresso do mapa.
  const resetar = () => {
    atualizarProgresso((atual) => ({
      ...atual,
      fasesConcluidas: [],
      estrelasPorFase: {},
      fasesEmAndamento: {},
      faseAtual: null,
      missoesDeCampo: {},
      metasVistas: [],
      unidadesComemoradas: [],
      posicaoNoMapa: {},
      mapaDesbloqueado: false,
    }));
    setConfirmandoReset(false);
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-4 p-4" data-lab-mapa>
      <header>
        <h1 className="text-2xl font-black text-primaria">Laboratório do mapa</h1>
        <p className="text-sm font-bold text-texto-suave">Só para testes. Nada aqui aparece no jogo.</p>
      </header>

      <section className="rounded-2xl border-2 border-borda bg-superficie p-4">
        <h2 className="text-lg font-black">Progresso</h2>
        <dl className="mt-2 grid grid-cols-2 gap-1 text-sm">
          <dt className="font-bold text-texto-suave">Tudo desbloqueado</dt>
          <dd data-desbloqueado={progresso.mapaDesbloqueado}>{progresso.mapaDesbloqueado ? "sim" : "não"}</dd>
          <dt className="font-bold text-texto-suave">Fases concluídas</dt>
          <dd>{progresso.fasesConcluidas.length}</dd>
          <dt className="font-bold text-texto-suave">Estrelas</dt>
          <dd>{totalDeEstrelas(progresso)}</dd>
          <dt className="font-bold text-texto-suave">Fase atual</dt>
          <dd className="font-codigo text-xs">{progresso.faseAtual ?? "nenhuma"}</dd>
        </dl>
        <div className="mt-3 flex flex-wrap gap-2">
          <Botao onClick={alternarDesbloqueio}>{progresso.mapaDesbloqueado ? "Trancar de novo" : "Desbloquear tudo"}</Botao>
          {confirmandoReset ? (
            <>
              <Botao variante="secundario" onClick={() => setConfirmandoReset(false)}>
                Cancelar
              </Botao>
              <Botao onClick={resetar}>Sim, resetar</Botao>
            </>
          ) : (
            <Botao variante="secundario" onClick={() => setConfirmandoReset(true)}>
              Resetar o progresso do mapa
            </Botao>
          )}
        </div>
      </section>

      <section className="rounded-2xl border-2 border-borda bg-superficie p-4">
        <h2 className="text-lg font-black">Ir para</h2>
        <ul className="mt-2 flex flex-wrap gap-2 text-sm font-black">
          <li>
            <Link className="text-primaria underline" href={ROTA_MUNDO}>
              Mundo
            </Link>
          </li>
          {CURRICULO.map((ilha) => (
            <li key={ilha.id}>
              <Link className="text-primaria underline" href={rotaDaIlha(ilha.id)}>
                Ilha {ilha.nome}
              </Link>
            </li>
          ))}
          <li>
            <Link className="text-primaria underline" href="/lab/fases">
              Laboratório de fases
            </Link>
          </li>
        </ul>
        <Botao variante="secundario" className="mt-3" onClick={() => setListaAberta(true)}>
          Abrir a Lista de fases
        </Botao>
      </section>

      <ListaFases
        aberta={listaAberta}
        faseAtual={progresso.faseAtual ?? FASE_INICIAL.id}
        aoEscolher={(faseId) => router.push(rotaDaFase(faseId))}
        aoFechar={() => setListaAberta(false)}
      />
    </main>
  );
}
