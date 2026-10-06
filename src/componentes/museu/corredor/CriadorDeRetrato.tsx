"use client";

/*
 * O retrato do aluno para a árvore da família: as peças do kit de clientes
 * (pele, cabelo, cor do cabelo, roupa, cor da roupa e óculos) e a
 * assinatura da placa. É o mesmo estilo de desenho dos clientes do jogo.
 */
import { useState } from "react";
import { tocarEfeito } from "@/audio/motor";
import { RetratoCliente } from "@/componentes/contrato/Cliente";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import { MAXIMO_NOME_RETRATO } from "@/lib/progresso";
import { type AparenciaCliente, CABELOS, CORES_CABELO, CORES_ROUPA, PELES, ROUPAS } from "@/motor/contrato/clientes";

type Props = {
  aberto: boolean;
  inicial: { aparencia: AparenciaCliente; nome: string } | null;
  aoFechar: () => void;
  aoConfirmar: (retrato: { aparencia: AparenciaCliente; nome: string }) => void;
};

const PADRAO: AparenciaCliente = { pele: "media", cabelo: "curto", corCabelo: "castanho", roupa: "camisa", corRoupa: "azul" };

const NOME_CABELO: Record<(typeof CABELOS)[number], string> = { coque: "Coque", curto: "Curto", cacheado: "Cacheado", longo: "Longo", careca: "Careca", rabo: "Rabo de cavalo" };
const NOME_ROUPA: Record<(typeof ROUPAS)[number], string> = { avental: "Avental", camisa: "Camisa", jaleco: "Jaleco", macacao: "Macacão" };

/** Uma fileira de bolinhas de cor (pele, cabelo, roupa). */
function Cores<T extends string>({ rotulo, opcoes, valor, cor, aoEscolher }: { rotulo: string; opcoes: readonly T[]; valor: T; cor: (opcao: T) => string; aoEscolher: (opcao: T) => void }) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="text-xs font-black uppercase tracking-wide text-texto-suave">{rotulo}</legend>
      <div className="flex flex-wrap gap-1.5">
        {opcoes.map((opcao) => (
          <button
            key={opcao}
            type="button"
            aria-pressed={opcao === valor}
            aria-label={`${rotulo}: ${opcao}`}
            onClick={() => aoEscolher(opcao)}
            className={`h-9 w-9 rounded-full border-4 pointer-coarse:h-11 pointer-coarse:w-11 ${opcao === valor ? "border-primaria" : "border-borda"}`}
            style={{ background: cor(opcao) }}
            data-opcao-retrato={`${rotulo}:${opcao}`}
          />
        ))}
      </div>
    </fieldset>
  );
}

function Pecas<T extends string>({ rotulo, opcoes, valor, nome, aoEscolher }: { rotulo: string; opcoes: readonly T[]; valor: T; nome: Record<T, string>; aoEscolher: (opcao: T) => void }) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="text-xs font-black uppercase tracking-wide text-texto-suave">{rotulo}</legend>
      <div className="flex flex-wrap gap-1.5">
        {opcoes.map((opcao) => (
          <button
            key={opcao}
            type="button"
            aria-pressed={opcao === valor}
            onClick={() => aoEscolher(opcao)}
            className={`min-h-9 rounded-full border-2 px-3 text-xs font-black pointer-coarse:min-h-11 ${opcao === valor ? "border-primaria bg-primaria text-sobre-primaria" : "border-borda bg-superficie text-texto hover:bg-hover"}`}
            data-opcao-retrato={`${rotulo}:${opcao}`}
          >
            {nome[opcao]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function CriadorDeRetrato({ aberto, inicial, aoFechar, aoConfirmar }: Props) {
  const [aparencia, setAparencia] = useState<AparenciaCliente>(inicial?.aparencia ?? PADRAO);
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const mudar = (parte: Partial<AparenciaCliente>) => {
    tocarEfeito("clique");
    setAparencia((atual) => ({ ...atual, ...parte }));
  };
  const comOculos = aparencia.acessorios?.includes("oculos") ?? false;
  return (
    <Modal aberto={aberto} titulo="O seu retrato na família" aoFechar={aoFechar} className="max-w-xl">
      <p className="mb-1 text-lg font-black text-primaria" aria-hidden="true">
        O seu retrato na família
      </p>
      <p className="mb-3 text-sm font-bold text-texto-suave">Monte do seu jeito. Ele vai ficar na árvore, no lugar da próxima geração.</p>
      <div className="flex flex-col gap-3 sm:flex-row" data-criador-retrato>
        <div className="flex shrink-0 flex-col items-center gap-1 rounded-2xl border-2 border-[var(--cor-museu-placa-borda)] bg-[var(--cor-museu-parede)] p-3">
          <RetratoCliente aparencia={aparencia} nome={nome || "Você"} tamanho={130} expressao="feliz" />
          <p className="text-sm font-black text-texto">{nome.trim() || "Você"}</p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <Cores rotulo="Pele" opcoes={PELES} valor={aparencia.pele} cor={(pele) => `var(--cor-cliente-pele-${pele})`} aoEscolher={(pele) => mudar({ pele })} />
          <Pecas rotulo="Cabelo" opcoes={CABELOS} valor={aparencia.cabelo} nome={NOME_CABELO} aoEscolher={(cabelo) => mudar({ cabelo })} />
          <Cores rotulo="Cor do cabelo" opcoes={CORES_CABELO} valor={aparencia.corCabelo} cor={(corCabelo) => `var(--cor-cliente-cabelo-${corCabelo})`} aoEscolher={(corCabelo) => mudar({ corCabelo })} />
          <Pecas rotulo="Roupa" opcoes={ROUPAS} valor={aparencia.roupa} nome={NOME_ROUPA} aoEscolher={(roupa) => mudar({ roupa })} />
          <Cores rotulo="Cor da roupa" opcoes={CORES_ROUPA} valor={aparencia.corRoupa} cor={(corRoupa) => `var(--cor-cliente-roupa-${corRoupa})`} aoEscolher={(corRoupa) => mudar({ corRoupa })} />
          <label className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-texto">
            <input type="checkbox" checked={comOculos} onChange={() => mudar({ acessorios: comOculos ? [] : ["oculos"] })} className="h-5 w-5 accent-[var(--cor-primaria)]" />
            Óculos
          </label>
          <label className="flex flex-col gap-1 text-xs font-black uppercase tracking-wide text-texto-suave">
            Como você assina na placa?
            <input
              type="text"
              value={nome}
              maxLength={MAXIMO_NOME_RETRATO}
              onChange={(evento) => setNome(evento.target.value)}
              placeholder="Seu nome ou apelido"
              className="min-h-11 rounded-xl border-2 border-borda bg-superficie px-3 text-base font-bold normal-case tracking-normal text-texto"
              data-nome-retrato
            />
          </label>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Botao variante="secundario" onClick={aoFechar}>
          Agora não
        </Botao>
        <Botao onClick={() => aoConfirmar({ aparencia, nome: nome.trim() })} data-confirmar-retrato>
          Entrar para a família
        </Botao>
      </div>
    </Modal>
  );
}
