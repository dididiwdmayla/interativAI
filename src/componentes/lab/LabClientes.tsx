"use client";

/*
 * O mostruário do kit de clientes (/lab/clientes): cada cliente em todas as
 * expressões, um falando de verdade (a boca acompanhando o texto), e as
 * peças do kit (peles, cabelos, roupas e acessórios), nos três temas. Para
 * conferir um cliente novo antes de usar num contrato (guia, seção 31.6).
 */
import { useEffect, useState } from "react";
import { FalaDoCliente } from "@/componentes/contrato/FalaDoCliente";
import { Cliente, RetratoCliente } from "@/componentes/contrato/Cliente";
import { useTextoDigitado } from "@/componentes/contrato/useTextoDigitado";
import { Botao } from "@/componentes/ui/Botao";
import { TEMAS } from "@/tema/temas";
import { ACESSORIOS, type AparenciaCliente, CABELOS, CLIENTES, CORES_CABELO, CORES_ROUPA, type IdCliente, PELES, ROUPAS } from "@/motor/contrato/clientes";
import { EXPRESSOES_CLIENTE } from "@/motor/contrato/expressoes";

const IDS = Object.keys(CLIENTES) as IdCliente[];
const BASE: AparenciaCliente = { pele: "media", cabelo: "curto", corCabelo: "castanho", roupa: "camisa", corRoupa: "azul" };

/** As peças, uma variação de cada vez a partir da base. */
const PECAS: { rotulo: string; aparencia: AparenciaCliente }[] = [
  ...PELES.map((pele) => ({ rotulo: `pele ${pele}`, aparencia: { ...BASE, pele } })),
  ...CABELOS.map((cabelo, i) => ({ rotulo: `cabelo ${cabelo}`, aparencia: { ...BASE, cabelo, corCabelo: CORES_CABELO[i % CORES_CABELO.length] } })),
  ...ROUPAS.map((roupa, i) => ({ rotulo: `roupa ${roupa}`, aparencia: { ...BASE, roupa, corRoupa: CORES_ROUPA[(i + 1) % CORES_ROUPA.length] } })),
  ...ACESSORIOS.map((acessorio) => ({ rotulo: `acessório ${acessorio}`, aparencia: { ...BASE, acessorios: [acessorio] } })),
];

const FALA_DEMO = "Oi! Eu falo assim: a boca abre nas vogais e quase fecha nas consoantes.";

function Falando({ id }: { id: IdCliente }) {
  const [vez, setVez] = useState(0);
  const texto = `${FALA_DEMO}${" ".repeat(vez % 2)}`;
  const { mostrado, completo } = useTextoDigitado(texto);
  useEffect(() => {
    if (!completo) return;
    const proxima = setTimeout(() => setVez((atual) => atual + 1), 1800);
    return () => clearTimeout(proxima);
  }, [completo]);
  return <FalaDoCliente cliente={id} fala={{ texto, expressao: "feliz" }} mostrado={mostrado} falando={!completo} />;
}

export function LabClientes() {
  const [falando, setFalando] = useState<IdCliente>(IDS[0]);
  return (
    <main className="min-h-dvh bg-fundo p-4 text-texto sm:p-6">
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-black text-primaria">Kit de clientes</h1>
        <p className="text-texto-suave">Os clientes dos contratos, as cinco expressões e as peças do kit, em todos os temas. Cores só por tokens (--cor-cliente-*).</p>
      </header>
      <section className="mb-6 rounded-2xl border-2 border-borda bg-painel p-4" aria-label="Cliente falando">
        <div className="mb-3 flex flex-wrap gap-2">
          {IDS.map((id) => (
            <Botao key={id} variante={id === falando ? "primario" : "secundario"} tamanho="p" onClick={() => setFalando(id)}>
              {CLIENTES[id].nome}
            </Botao>
          ))}
        </div>
        <Falando key={falando} id={falando} />
      </section>
      <div className="grid gap-8">
        {TEMAS.filter((tema) => !tema.doJogador).map((tema) => (
          <section key={tema.id} data-theme={tema.id} aria-label={`Tema ${tema.nome}`} className="rounded-2xl border-2 border-borda bg-fundo p-4 text-texto">
            <h2 className="mb-3 text-lg font-black text-primaria">{tema.nome}</h2>
            {IDS.map((id) => (
              <div key={id} className="mb-4">
                <h3 className="mb-2 font-black">
                  {CLIENTES[id].nome} <span className="font-bold text-texto-suave">· {CLIENTES[id].negocio}</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {EXPRESSOES_CLIENTE.map((expressao) => (
                    <figure key={expressao} className="flex flex-col items-center gap-1 rounded-xl border-2 border-borda bg-painel p-2">
                      <Cliente id={id} expressao={expressao} tamanho={110} />
                      <figcaption className="text-xs font-bold text-texto-suave">{expressao}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
            <h3 className="mb-2 font-black">Peças do kit</h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-10">
              {PECAS.map((peca) => (
                <figure key={peca.rotulo} className="flex flex-col items-center gap-1 rounded-xl border-2 border-borda bg-painel p-2">
                  <RetratoCliente aparencia={peca.aparencia} nome={peca.rotulo} tamanho={80} />
                  <figcaption className="text-center text-[11px] font-bold text-texto-suave">{peca.rotulo}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
