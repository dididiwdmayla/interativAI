"use client";

/*
 * O desenho da cena num instante: o cenário (peças do kit), os
 * dispositivos no estado da simulação, as pessoas da linha do tempo e a luz.
 * À noite o ambiente fica escuro e cada lâmpada acesa abre uma área clara
 * de verdade (uma máscara com um gradiente), com o brilho regulando o
 * tamanho. Tocar num dispositivo abre a ficha dele.
 */
import { useReducedMotion } from "framer-motion";
import { AtoresCena } from "./kit/AtoresCena";
import { DispositivoNovo } from "./kit/DispositivosNovos";
import { type KeyboardEvent, useId, useMemo } from "react";
import { CATALOGO_DISPOSITIVOS } from "@/motor/cena/catalogo";
import { lerConteudoDaTela } from "@/motor/cena/telaApp";
import {
  ALTURA_CENA,
  type DadosCena,
  type DispositivoCena,
  type EstadoDispositivos,
  estadoNoTempo,
  type FiltroPasso,
  LARGURA_CENA,
  pessoasNoDesenho,
  type RastroCena,
  type ValorCena,
} from "@/motor/cena/modelo";
import { letrasAcesas } from "@/motor/cena/animacao";
import { caixaDoDispositivo, centroDaLuz, DesenhoDispositivo } from "./kit/DispositivosCena";
import { PecaDoCenario } from "./kit/PecasCenario";
import { PessoaCena } from "./kit/PessoaCena";
import { cor } from "./kit/estilo";

/** Uma frase curta do estado de um dispositivo (leitor de tela e testes). */
export function resumoDoDispositivo(dispositivo: DispositivoCena, estado: Record<string, ValorCena> | undefined): string {
  const e = estado ?? {};
  switch (dispositivo.tipo) {
    case "sensorCarro": return e.temCarro ? "carro na entrada" : "entrada livre";
    case "geladeira": return e.portaAberta ? "porta aberta" : "porta fechada";
    case "alarme": return e.tocando ? "tocando" : "silencioso";
    case "semaforo": return `carros: ${String(e.cor)}; pedestres: ${e.cor === "vermelho" ? "podem atravessar" : "esperem"}`;
    case "botao": return e.pressionado ? "pressionado" : "solto";
    case "aspersor": return e.ligado ? "regando" : "desligado";
    case "sensorUmidade": return `umidade ${Math.round(Number(e.valor))}%`;
    case "sensorDia": return e.dia ? "dia" : "noite";
    case "lampada":
      return e.ligada === true ? `acesa${e.brilho !== 100 ? `, brilho ${String(e.brilho)}` : ""}` : "apagada";
    case "sensor":
      return e.temGente === true ? "vê alguém" : "sem ninguém perto";
    case "interruptor":
      return e.ligado === true ? "ligado" : "desligado";
    case "portao":
      return e.aberto === true ? "aberto" : "fechado";
    case "letreiro":
      return e.texto ? `mostra "${String(e.texto)}"` : "apagado";
    case "forno":
      return `${e.ligado === true ? "ligado" : "desligado"}, ${String(e.temperatura ?? 25)} graus`;
    case "ventilador":
      return Number(e.velocidade ?? 0) > 0 ? `girando na velocidade ${String(e.velocidade)}` : "parado";
    case "relogio":
      return `marca ${String(e.hora ?? 0)}h`;
    case "campainha":
      return Number(e.toques ?? 0) > 0 ? `tocou ${String(e.toques)} ${Number(e.toques) === 1 ? "vez" : "vezes"}` : "quieta";
    case "registradora":
      return e.texto ? `o visor mostra "${String(e.texto)}"` : "visor apagado";
    case "telaApp": {
      const conteudo = lerConteudoDaTela(e.conteudo);
      if (!conteudo) return "tela apagada";
      if (conteudo.tipo === "recado") return `mostra "${conteudo.recado}"`;
      const repetidos = Number(e.conflitos ?? 0);
      return `agenda${conteudo.titulo ? ` de ${conteudo.titulo}` : ""} com ${conteudo.linhas.length} ${conteudo.linhas.length === 1 ? "marcação" : "marcações"}${
        repetidos ? `, ${repetidos} ${repetidos === 1 ? "horário repetido" : "horários repetidos"}` : ""
      }`;
    }
  }
}

/** "temGente" vira "tem-gente" (atributo data- dos testes). */
function kebab(nome: string): string {
  return nome.replace(/[A-Z]/g, (letra) => `-${letra.toLowerCase()}`);
}

type Props = {
  dados: DadosCena;
  rastro: RastroCena;
  tempoMs: number;
  /** (Linha do tempo da execução) Só as mudanças até o passo escolhido. */
  filtro?: FiltroPasso | null;
  aoTocarDispositivo?: (id: string) => void;
  /** O dispositivo com a ficha aberta (fica destacado). */
  destacado?: string | null;
};

/** Raio da área clara de uma lâmpada acesa. */
function raioDaLuz(dispositivo: DispositivoCena, brilho: number): number {
  const e = dispositivo.escala ?? 1;
  return (dispositivo.variante === "spot" ? 50 + 70 * brilho : 60 + 110 * brilho) * e;
}

/** As partes que brilham sozinhas (não escurecem à noite): letras do letreiro, LEDs, o forno quente. */
function Emissao({ dispositivo, estado, rastro, tempoMs, filtro }: { dispositivo: DispositivoCena; estado: EstadoDispositivos; rastro: RastroCena; tempoMs: number; filtro: FiltroPasso | null }) {
  const e = dispositivo.escala ?? 1;
  const atual = estado[dispositivo.id] ?? {};
  const { x, y } = dispositivo;
  if (dispositivo.tipo === "letreiro") {
    const texto = String(atual.texto ?? "");
    const acesas = letrasAcesas(rastro, dispositivo.id, texto, tempoMs, filtro);
    if (!acesas) return null;
    const largura = 6.4;
    const inicio = 56 - (texto.length * largura) / 2;
    return (
      <g transform={`translate(${x} ${y}) scale(${e})`} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontWeight={800} fontSize={10.5} textAnchor="middle" fill={cor("letreiro-aceso")}>
        {texto
          .slice(0, acesas)
          .split("")
          .map((letra, i) => (
            <text key={i} x={inicio + i * largura + largura / 2} y={17}>
              {letra}
            </text>
          ))}
      </g>
    );
  }
  if (dispositivo.tipo === "sensor" && atual.temGente === true) {
    return <circle cx={x + 6 * e} cy={y - 1.5 * e} r={1.8 * e} fill={cor("led")} />;
  }
  if (dispositivo.tipo === "forno") {
    const calor = Math.max(0, Math.min(1, (Number(atual.temperatura ?? 25) - 25) / 200));
    return (
      <g transform={`translate(${x} ${y}) scale(${e})`}>
        <rect x={10} y={21} width={44} height={16} rx={2} fill={cor("quente")} opacity={calor * 0.85} />
        <text x={45} y={11} textAnchor="middle" fontSize={6} fontWeight={800} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fill={cor("letreiro-aceso")}>
          {Number(atual.restante ?? 0) > 0 ? `${Math.ceil(Number(atual.restante) / 1000)}s` : `${String(atual.temperatura ?? 25)}°`}
        </text>
      </g>
    );
  }
  if (dispositivo.tipo === "ventilador" && Number(atual.velocidade ?? 0) > 0) {
    return (
      <g transform={`translate(${x} ${y}) scale(${e})`}>
        {[0, 1, 2].map((i) => (i < Number(atual.velocidade) ? <circle key={i} cx={-5 + i * 5} cy={-3} r={1.3} fill={cor("led")} /> : null))}
      </g>
    );
  }
  if (dispositivo.tipo === "lampada" && atual.ligada === true && Number(atual.brilho ?? 100) > 0) {
    const centro = centroDaLuz(dispositivo);
    return <circle cx={centro.x} cy={centro.y} r={4 * e} fill={cor("luz")} />;
  }
  return null;
}

export function CenaSvg({ dados, rastro, tempoMs, filtro = null, aoTocarDispositivo, destacado = null }: Props) {
  const id = `cena-${useId().replace(/:/g, "")}`;
  const reduzido = useReducedMotion() === true;
  const estado = estadoNoTempo(rastro, tempoMs, { filtro });
  const periodo = dados.periodoPor ? (estado[dados.periodoPor.dispositivo]?.[dados.periodoPor.propriedade] === true ? "dia" : "noite") : dados.periodo;
  // O cenário não muda com o tempo: desenhado uma vez só (a cena redesenha a cada quadro da animação).
  const cenario = useMemo(
    () => dados.cenario.map((peca, indice) => <PecaDoCenario key={indice} peca={peca} periodo={periodo} id={id} />),
    [dados.cenario, periodo, id],
  );
  const pessoas = pessoasNoDesenho(rastro.linhaDoTempo, tempoMs, rastro.duracaoMs);
  const noite = periodo === "noite";
  const luzes = dados.dispositivos.flatMap((dispositivo) => {
    const atual = estado[dispositivo.id];
    if (dispositivo.tipo !== "lampada" || atual?.ligada !== true) return [];
    const brilho = Number(atual.brilho ?? 100) / 100;
    if (brilho <= 0) return [];
    return [{ dispositivo, brilho, centro: centroDaLuz(dispositivo), raio: raioDaLuz(dispositivo, brilho) }];
  });
  const resumo = dados.dispositivos.map((d) => `${d.id}: ${resumoDoDispositivo(d, estado[d.id])}`).join("; ");
  const tocar = (alvo: string) => aoTocarDispositivo?.(alvo);
  const teclar = (evento: KeyboardEvent<SVGGElement>, alvo: string) => {
    if (evento.key !== "Enter" && evento.key !== " ") return;
    evento.preventDefault();
    tocar(alvo);
  };
  return (
    <svg
      viewBox={`0 0 ${LARGURA_CENA} ${ALTURA_CENA}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full select-none"
      role="group"
      aria-label={`Cena: ${dados.titulo}`}
      data-cena={dados.id}
      data-tempo={Math.round(tempoMs)}
      data-luzes={luzes.length}
      data-periodo={periodo}
    >
      <title>{`${dados.titulo}. ${resumo}`}</title>
      <defs>
        <linearGradient id={`${id}-luz-parede`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--cor-cena-claro)" stopOpacity={0.28} />
          <stop offset="0.55" stopColor="var(--cor-cena-claro)" stopOpacity={0} />
          <stop offset="1" stopColor="var(--cor-cena-escuro)" stopOpacity={0.12} />
        </linearGradient>
        <radialGradient id={`${id}-buraco`}>
          <stop offset="0" stopColor="black" stopOpacity={1} />
          <stop offset="0.5" stopColor="black" stopOpacity={0.8} />
          <stop offset="1" stopColor="black" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-brilho`}>
          <stop offset="0" stopColor="var(--cor-cena-luz)" stopOpacity={0.6} />
          <stop offset="0.45" stopColor="var(--cor-cena-luz)" stopOpacity={0.22} />
          <stop offset="1" stopColor="var(--cor-cena-luz)" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-cone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--cor-cena-luz)" stopOpacity={0.45} />
          <stop offset="1" stopColor="var(--cor-cena-luz)" stopOpacity={0} />
        </linearGradient>
        <mask id={`${id}-escuro`} maskUnits="userSpaceOnUse" x={0} y={0} width={LARGURA_CENA} height={ALTURA_CENA}>
          <rect width={LARGURA_CENA} height={ALTURA_CENA} fill="white" />
          {luzes.map(({ dispositivo, centro, raio }) => (
            <ellipse key={dispositivo.id} cx={centro.x} cy={centro.y + raio * 0.3} rx={raio} ry={raio * 0.92} fill={`url(#${id}-buraco)`} />
          ))}
        </mask>
        <clipPath id={`${id}-moldura`}>
          <rect width={LARGURA_CENA} height={ALTURA_CENA} rx={8} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-moldura)`}>
        {cenario}
        <AtoresCena rastro={rastro} estado={estado} tempoMs={tempoMs} filtro={filtro} reduzido={reduzido} />
        {dados.dispositivos.map((dispositivo) => (
          <g key={dispositivo.id} data-desenho={dispositivo.id}>
            <DesenhoDispositivo reduzido={reduzido} dispositivo={dispositivo} estado={estado} rastro={rastro} tempoMs={tempoMs} filtro={filtro} />
          </g>
        ))}
        {pessoas.map((pessoa) => (
          <PessoaCena key={pessoa.indice} pessoa={pessoa} tempoMs={tempoMs} />
        ))}
        {/* A luz: o cone da lâmpada pendente e o brilho em volta. */}
        {luzes.map(({ dispositivo, brilho, centro, raio }) =>
          dispositivo.variante === "spot" ? null : (
            <path
              key={`cone-${dispositivo.id}`}
              d={`M${centro.x - 12} ${centro.y - 2}L${centro.x + 12} ${centro.y - 2}L${centro.x + raio * 0.75} ${centro.y + raio}L${centro.x - raio * 0.75} ${centro.y + raio}z`}
              fill={`url(#${id}-cone)`}
              opacity={0.55 * brilho}
            />
          ),
        )}
        {/* À noite, o escuro: cada lâmpada acesa abre a área clara dela. */}
        {noite && <rect width={LARGURA_CENA} height={ALTURA_CENA} fill="var(--cor-cena-escuro)" opacity={0.62} mask={`url(#${id}-escuro)`} data-escuro />}
        {luzes.map(({ dispositivo, brilho, centro, raio }) => (
          <circle key={`brilho-${dispositivo.id}`} cx={centro.x} cy={centro.y} r={raio * 0.55} fill={`url(#${id}-brilho)`} opacity={(noite ? 1 : 0.55) * brilho} />
        ))}
        {dados.dispositivos.filter(d => d.tipo === "semaforo" || d.tipo === "alarme").map(d => <DispositivoNovo key={`sinal-${d.id}`} dispositivo={d} estado={estado} tempoMs={tempoMs} reduzido={reduzido} />)}
        {dados.dispositivos.map((dispositivo) => (
          <Emissao key={`emissao-${dispositivo.id}`} dispositivo={dispositivo} estado={estado} rastro={rastro} tempoMs={tempoMs} filtro={filtro} />
        ))}
      </g>
      {/* As áreas de toque: abrir a ficha de cada dispositivo. */}
      {dados.dispositivos.map((dispositivo) => {
        const caixa = caixaDoDispositivo(dispositivo);
        const ficha = CATALOGO_DISPOSITIVOS[dispositivo.tipo];
        const atributos = Object.fromEntries(Object.entries(estado[dispositivo.id] ?? {}).map(([nome, valor]) => [`data-${kebab(nome)}`, String(valor)]));
        const folga = 3;
        return (
          <g
            key={`toque-${dispositivo.id}`}
            role="button"
            tabIndex={aoTocarDispositivo ? 0 : -1}
            aria-label={`${ficha.nome} ${dispositivo.id}: ${resumoDoDispositivo(dispositivo, estado[dispositivo.id])}. Abrir a ficha.`}
            onClick={() => tocar(dispositivo.id)}
            onKeyDown={(evento) => teclar(evento, dispositivo.id)}
            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-[var(--cor-primaria)] [&:hover>rect]:stroke-[var(--cor-primaria)]"
            data-dispositivo={dispositivo.id}
            data-tipo={dispositivo.tipo}
            {...atributos}
          >
            <rect
              x={caixa.x - folga}
              y={caixa.y - folga}
              width={caixa.largura + folga * 2}
              height={caixa.altura + folga * 2}
              rx={5}
              fill="transparent"
              stroke={destacado === dispositivo.id ? "var(--cor-primaria)" : "transparent"}
              strokeWidth={1.6}
              strokeDasharray={destacado === dispositivo.id ? undefined : "4 3"}
            />
          </g>
        );
      })}
    </svg>
  );
}
