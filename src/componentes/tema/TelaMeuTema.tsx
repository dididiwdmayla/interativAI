"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMusicaDaTela } from "@/audio/ganchos";
import { tocarEfeito } from "@/audio/motor";
import { IconeChevron } from "@/componentes/icones/IconeChevron";
import { TelaCarregando } from "@/componentes/jogo/TelaCarregando";
import { BarraMapa } from "@/componentes/mapa/BarraMapa";
import { Mascote } from "@/componentes/mascote/Mascote";
import { MiniPrevia } from "@/componentes/preview/MiniPrevia";
import { hexDoSeletor } from "@/componentes/painel/estilos/cores";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import { obterProgresso, useProgresso, useProgressoCarregado } from "@/lib/armazemProgresso";
import { formatarContraste } from "@/lib/contraste";
import { conferirContraste, coresDoTemaAtual, montarMeuTema, type ResultadoPar, valorDeCorSeguro } from "@/lib/meuTema";
import { ROTA_MUNDO } from "@/lib/rotas";
import { apagarMeuTema, salvarMeuTema } from "@/lib/tema";
import { lerCor } from "@/motor/css/valores";
import { cssDosTokens, GRUPOS_DA_MAQUETE, SITE_ALVO_DO_JOGO } from "@/motor/siteDoJogo";
import { tokensDoTema, type Tokens } from "@/tema/tokensDoJogo";
import { AvisoContraste } from "./AvisoContraste";

function BotaoVoltar() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => (window.history.length > 1 ? router.back() : router.push(ROTA_MUNDO))}
      className="flex h-11 shrink-0 items-center gap-1 rounded-full border-2 border-borda bg-superficie pl-2 pr-3 text-sm font-black text-texto hover:border-primaria hover:text-primaria"
    >
      <IconeChevron direcao="esquerda" tamanho={14} />
      Voltar
    </button>
  );
}

/**
 * A oficina do Meu tema (/meu-tema): o jeito de mexer de novo nas cores
 * salvas na E5 fora da fase (o card "Salvar como Meu tema" da Caixa de
 * Ferramentas traz para cá), ou apagar o tema. Mostra a mesma maquete do
 * jogo, um seletor de cor por variável e o contraste dos pares principais.
 */
export function TelaMeuTema() {
  const carregado = useProgressoCarregado();
  useMusicaDaTela({ tipo: "mundo" });
  if (!carregado) return <TelaCarregando />;
  return <OficinaDoTema />;
}

function OficinaDoTema() {
  const progresso = useProgresso();
  const [partida] = useState(() => {
    const atual = coresDoTemaAtual(obterProgresso());
    return { base: atual.base, cores: atual.cores ?? tokensDoTema(atual.base) };
  });
  const [cores, setCores] = useState<Tokens>(partida.cores);
  const [aviso, setAviso] = useState<ResultadoPar[] | null>(null);
  const [confirmarApagar, setConfirmarApagar] = useState(false);
  const [recado, setRecado] = useState<string | null>(null);
  const existe = progresso.meuTema !== null;
  const pares = useMemo(() => conferirContraste(cores), [cores]);
  const css = useMemo(() => cssDosTokens(cores), [cores]);

  const trocar = (nome: string, valor: string) => {
    setRecado(null);
    setCores((atuais) => ({ ...atuais, [nome]: valor }));
  };

  const salvar = (confirmado: boolean) => {
    const meuTema = montarMeuTema(partida.base, partida.cores, cores);
    const ruins = conferirContraste(meuTema.cores).filter((par) => !par.bom);
    if (ruins.length > 0 && !confirmado) {
      setAviso(ruins);
      return;
    }
    setAviso(null);
    salvarMeuTema(meuTema);
    tocarEfeito("desbloqueio");
    setRecado("Salvo! O Meu tema já vale no jogo inteiro.");
  };

  return (
    <div className="flex h-dvh flex-col bg-fundo" data-tela="meu-tema">
      <BarraMapa caminho={["Meu tema"]} voltar={<BotaoVoltar />} />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-start gap-3 pt-4">
            <Mascote expressao={existe ? "feliz" : "curioso"} tamanho={64} className="shrink-0" />
            <div className="min-w-0">
              <h1 className="text-2xl font-black text-texto">Oficina do Meu tema</h1>
              <p className="text-sm font-bold text-texto-suave">
                {existe
                  ? "Mude as cores e salve de novo, ou apague o tema. A maquete mostra o jogo com as cores novas."
                  : "Você ainda não salvou um Meu tema (ele nasce na Variáveis e temas, da zona Estilos). Dá pra começar aqui mesmo, a partir do tema atual."}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-3">
              <MiniPrevia head={SITE_ALVO_DO_JOGO.head} body={SITE_ALVO_DO_JOGO.body} css={css} legenda="O jogo com essas cores" rotulo="Maquete do jogo" />
              <section aria-label="Contraste dos pares principais" className="rounded-2xl border-2 border-borda bg-superficie p-3" data-contraste-pares>
                <h2 className="text-sm font-black text-texto">Dá pra ler? (mínimo 4,5:1)</h2>
                <ul className="mt-1 space-y-1 text-sm">
                  {pares.map((par) => (
                    <li key={`${par.texto}-${par.fundo}`} className="flex items-center justify-between gap-2" data-par={`${par.texto} ${par.fundo}`} data-bom={par.bom ? "sim" : "nao"}>
                      <span className="min-w-0 text-texto">{par.nome}</span>
                      <span className={`shrink-0 rounded-full px-2 font-codigo text-xs font-bold ${par.bom ? "bg-painel text-sucesso" : "bg-painel text-erro"}`}>
                        {par.razao === null ? "?" : formatarContraste(par.razao)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            <div className="min-w-0 space-y-3">
              {GRUPOS_DA_MAQUETE.map((grupo) => (
                <fieldset key={grupo.nome} className="rounded-2xl border-2 border-borda bg-superficie p-3">
                  <legend className="px-1 text-sm font-black text-texto">{grupo.nome}</legend>
                  <ul className="space-y-1.5">
                    {grupo.tokens.map((nome) => (
                      <LinhaToken key={nome} nome={nome} valor={cores[nome] ?? ""} aoTrocar={(valor) => trocar(nome, valor)} />
                    ))}
                  </ul>
                </fieldset>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2" data-acoes-meu-tema>
            <Botao onClick={() => salvar(false)} data-salvar-oficina>
              Salvar o Meu tema
            </Botao>
            <Botao variante="secundario" onClick={() => setCores(partida.cores)}>
              Desfazer as mudanças
            </Botao>
            {existe && (
              <Botao variante="fantasma" onClick={() => setConfirmarApagar(true)} data-apagar-meu-tema>
                Apagar o Meu tema
              </Botao>
            )}
            {recado && (
              <p role="status" className="text-sm font-bold text-sucesso">
                {recado}
              </p>
            )}
          </div>
        </div>
      </main>
      <AvisoContraste aberto={aviso !== null} ruins={aviso ?? []} aoVoltar={() => setAviso(null)} aoSalvarMesmoAssim={() => salvar(true)} />
      <Modal aberto={confirmarApagar} titulo="Apagar o Meu tema?" aoFechar={() => setConfirmarApagar(false)} className="max-w-sm">
        <p className="font-bold text-texto">As cores do Meu tema somem, e o jogo volta para o tema de onde ele partiu. Dá pra criar outro depois.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Botao variante="secundario" onClick={() => setConfirmarApagar(false)}>
            Manter
          </Botao>
          <Botao
            onClick={() => {
              apagarMeuTema();
              setConfirmarApagar(false);
              setRecado("Meu tema apagado.");
            }}
            data-confirmar-apagar
          >
            Apagar
          </Botao>
        </div>
      </Modal>
    </div>
  );
}

/** Uma variável: o seletor de cor e o valor em texto (qualquer formato de cor). */
function LinhaToken({ nome, valor, aoTrocar }: { nome: string; valor: string; aoTrocar: (valor: string) => void }) {
  const [texto, setTexto] = useState(valor);
  const [valorConhecido, setValorConhecido] = useState(valor);
  if (valorConhecido !== valor) {
    setValorConhecido(valor);
    setTexto(valor);
  }
  const cor = lerCor(valor);
  const valido = valorDeCorSeguro(texto.trim());
  return (
    <li className="flex items-center gap-2" data-token={nome}>
      <label className="relative grid h-11 w-11 shrink-0 cursor-pointer place-items-center">
        <span className="h-7 w-7 rounded-lg border-2 border-borda" style={{ backgroundColor: valor }} aria-hidden="true" />
        <input
          type="color"
          aria-label={`Escolher a cor de ${nome}`}
          value={cor ? hexDoSeletor(cor) : "#000000"}
          onChange={(evento) => aoTrocar(evento.currentTarget.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
      <label className="min-w-0 flex-1">
        <span className="block truncate font-codigo text-xs text-codigo-atributo">{nome}</span>
        <input
          type="text"
          value={texto}
          spellCheck={false}
          aria-label={`Valor de ${nome}`}
          aria-invalid={!valido}
          onChange={(evento) => {
            setTexto(evento.target.value);
            if (valorDeCorSeguro(evento.target.value.trim())) aoTrocar(evento.target.value.trim());
          }}
          className={`h-9 w-full rounded-lg border-2 bg-superficie px-2 font-codigo text-sm text-texto pointer-coarse:h-11 ${valido ? "border-borda" : "border-erro"}`}
        />
      </label>
    </li>
  );
}
