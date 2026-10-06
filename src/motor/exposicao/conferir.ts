/*
 * Conferência dos dados de uma exposição do museu (a fábrica de conteúdo
 * chama daqui, em src/conteudo/checagens.ts). Puro.
 */
import type { IdFerramenta } from "@/ferramentas/ids";
import { type DadosExposicao, ehEstacaoSimulacao, ehIdAntepassado, type Estacao, IDS_ANTEPASSADOS, normalizarHex, type TipoEstacao } from "./modelo";
import { conferirLigar, conferirOrdem } from "./cartoes";
import { conferirCircuito } from "./circuitoMuseu";
import { conferirComparador } from "./comparador";
import { modeloDa } from "./simulacoes";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** A ferramenta de cada tipo de estação (apresentada como as outras, e listada em usaFerramentas). */
export const FERRAMENTA_DA_ESTACAO: Record<TipoEstacao, IdFerramenta> = {
  tear: "tear-de-cartoes",
  bits: "lampadas-de-bits",
  camadas: "camadas-da-maquina",
  cor: "mesa-de-cores",
  "linha-do-tempo": "linha-do-tempo-museu",
  comparador: "comparador-de-linguagens",
  ligar: "cartoes-de-ligar",
  ordem: "ordem-dos-cartoes",
  circuito: "painel-de-cabos",
  traducao: "compilar-interpretar",
  memoria: "caixas-da-memoria",
  processador: "processador-de-brinquedo",
  sistema: "gerente-do-sistema",
  arquivos: "arvore-de-pastas",
  clique: "caminho-do-clique",
  pacote: "mapa-dos-cabos",
  "aba-rede": "aba-rede-previa",
  cidade: "cidade-do-codigo",
};

export const FIGURAS_DE_EVENTO = [...IDS_ANTEPASSADOS, "cartao", "transistor", "chip", "ia"] as const;

function tamanho(problemas: string[], onde: string, texto: string, maximo: number): void {
  if (!texto.trim()) problemas.push(`${onde} está vazio`);
  else if (texto.length > maximo) problemas.push(`${onde} tem ${texto.length} caracteres (máximo ${maximo})`);
}

function repetidos(ids: readonly string[]): string[] {
  return [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
}

function conferirEstacao(estacao: Estacao): string[] {
  const p: string[] = [];
  const onde = `estação "${estacao.id}"`;
  tamanho(p, `${onde}: titulo`, estacao.titulo, 40);
  switch (estacao.tipo) {
    case "tear": {
      const { modelo, inicial } = estacao;
      if (modelo.length < 2 || modelo.length > 8) p.push(`${onde}: o modelo tem ${modelo.length} cartões (de 2 a 8)`);
      const colunas = modelo[0]?.length ?? 0;
      if (colunas < 3 || colunas > 8) p.push(`${onde}: o modelo tem ${colunas} agulhas (de 3 a 8)`);
      modelo.forEach((linha, i) => {
        if (linha.length !== colunas) p.push(`${onde}: a linha ${i} do modelo tem tamanho diferente da primeira`);
        if (!/^[#.]+$/.test(linha)) p.push(`${onde}: a linha ${i} do modelo só pode ter "#" e "."`);
      });
      if (inicial) {
        if (inicial.length !== modelo.length) p.push(`${onde}: inicial tem ${inicial.length} cartões; o modelo, ${modelo.length}`);
        inicial.forEach((linha, i) => {
          if (linha.length !== colunas || !/^[#.]+$/.test(linha)) p.push(`${onde}: a linha ${i} de inicial não tem a forma do modelo`);
        });
        if (inicial.join("") === modelo.join("")) p.push(`${onde}: inicial já é igual ao modelo (não sobra nada para tecer)`);
      }
      break;
    }
    case "bits": {
      if (estacao.quantos !== 4 && estacao.quantos !== 8) p.push(`${onde}: quantos vale 4 ou 8`);
      if (estacao.inicial !== undefined && (estacao.inicial.length !== estacao.quantos || !/^[01]+$/.test(estacao.inicial))) p.push(`${onde}: inicial precisa de ${estacao.quantos} dígitos 0 ou 1`);
      if (estacao.letra && estacao.quantos !== 8) p.push(`${onde}: a letra só aparece com 8 lâmpadas`);
      break;
    }
    case "camadas": {
      const { camadas } = estacao;
      if (camadas.length < 2 || camadas.length > 4) p.push(`${onde}: ${camadas.length} camadas (de 2 a 4)`);
      const todas = [...camadas.map((c) => c.id), ...camadas.flatMap((c) => c.linhas.map((l) => l.id))];
      p.push(...repetidos(todas).map((id) => `${onde}: id repetido "${id}" (camadas e linhas)`));
      camadas.forEach((camada, i) => {
        if (!KEBAB.test(camada.id)) p.push(`${onde}: a camada "${camada.id}" não está em kebab-case`);
        tamanho(p, `${onde}: nome da camada "${camada.id}"`, camada.nome, 32);
        tamanho(p, `${onde}: legenda da camada "${camada.id}"`, camada.legenda, 110);
        if (camada.linhas.length < 1 || camada.linhas.length > 10) p.push(`${onde}: a camada "${camada.id}" tem ${camada.linhas.length} linhas (de 1 a 10)`);
        const deCima = new Set(camadas[i - 1]?.linhas.map((l) => l.id) ?? []);
        for (const linha of camada.linhas) {
          if (!KEBAB.test(linha.id)) p.push(`${onde}: a linha "${linha.id}" não está em kebab-case`);
          tamanho(p, `${onde}: a linha "${linha.id}"`, linha.texto, 60);
          if (i === 0 && linha.de?.length) p.push(`${onde}: a linha "${linha.id}" está na primeira camada e não vem de ninguém`);
          if (i > 0 && !linha.de?.length) p.push(`${onde}: a linha "${linha.id}" precisa dizer de qual linha da camada de cima ela veio (de)`);
          for (const origem of linha.de ?? []) if (i > 0 && !deCima.has(origem)) p.push(`${onde}: a linha "${linha.id}" vem de "${origem}", que não está na camada logo acima`);
        }
      });
      break;
    }
    case "cor": {
      if (!normalizarHex(estacao.inicial)) p.push(`${onde}: inicial "${estacao.inicial}" não é uma cor hexadecimal`);
      if (!estacao.css.seletor.trim()) p.push(`${onde}: css.seletor está vazio`);
      if (estacao.amostra) {
        if (!normalizarHex(estacao.amostra.valor)) p.push(`${onde}: a amostra "${estacao.amostra.valor}" não é uma cor hexadecimal`);
        tamanho(p, `${onde}: o nome da amostra`, estacao.amostra.nome, 24);
      }
      break;
    }
    case "linha-do-tempo": {
      const { eventos, fixos } = estacao;
      if (eventos.length < 3 || eventos.length > 10) p.push(`${onde}: ${eventos.length} cartões (de 3 a 10)`);
      p.push(...repetidos(eventos.map((e) => e.id)).map((id) => `${onde}: cartão com id repetido "${id}"`));
      for (const evento of eventos) {
        const qual = `${onde}: o cartão "${evento.id}"`;
        if (!KEBAB.test(evento.id)) p.push(`${qual} não está em kebab-case`);
        tamanho(p, `${qual}: titulo`, evento.titulo, 48);
        tamanho(p, `${qual}: pista`, evento.pista, 110);
        tamanho(p, `${qual}: epoca`, evento.epoca, 40);
        tamanho(p, `${qual}: mudou`, evento.mudou, 140);
        if (!(FIGURAS_DE_EVENTO as readonly string[]).includes(evento.figura)) p.push(`${qual}: figura "${evento.figura}" não existe`);
        if (/\b1[0-9]{3}\b|\b20[0-9]{2}\b/.test(evento.epoca) && !/anos|década|século|início|fim|meados/.test(evento.epoca)) {
          p.push(`${qual}: a época "${evento.epoca}" parece uma data exata; prefira a década ("anos 1940") se não estiver conferida`);
        }
      }
      const ids = eventos.map((e) => e.id);
      for (const id of fixos ?? []) if (!ids.includes(id)) p.push(`${onde}: fixos cita "${id}", que não existe`);
      const posicoes = (fixos ?? []).map((id) => ids.indexOf(id));
      if (posicoes.some((pos, i) => i > 0 && pos < posicoes[i - 1])) p.push(`${onde}: os fixos precisam estar na ordem certa (a dos eventos)`);
      if ((fixos ?? []).length >= eventos.length - 1) p.push(`${onde}: fixos demais (sobra no máximo um cartão para pôr)`);
      break;
    }
    case "comparador":
      p.push(...conferirComparador(estacao, onde));
      break;
    case "ligar":
      p.push(...conferirLigar(estacao, onde));
      break;
    case "ordem":
      p.push(...conferirOrdem(estacao, onde));
      break;
    case "circuito":
      p.push(...conferirCircuito(estacao, onde));
      break;
    default:
      if (ehEstacaoSimulacao(estacao)) p.push(...modeloDa(estacao).conferir(estacao, onde));
  }
  return p;
}

/** Os dados da exposição: anfitrião, placa, falas e estações. `etapas`: os ids dos objetivos (ou das partes). */
export function conferirDadosExposicao(dados: DadosExposicao, etapas: readonly string[]): string[] {
  const p: string[] = [];
  if (!ehIdAntepassado(dados.anfitriao)) p.push(`anfitriao "${dados.anfitriao}" não é um antepassado (${IDS_ANTEPASSADOS.join(", ")})`);
  tamanho(p, "placa.titulo", dados.placa.titulo, 48);
  tamanho(p, "placa.texto", dados.placa.texto, 200);
  tamanho(p, "falas.abrir", dados.falas.abrir, 160);
  if (dados.falas.concluir !== undefined) tamanho(p, "falas.concluir", dados.falas.concluir, 160);
  for (const [etapa, fala] of Object.entries(dados.falas.porEtapa ?? {})) {
    if (!etapas.includes(etapa)) p.push(`falas.porEtapa cita "${etapa}", que não é objetivo nem parte da fase`);
    tamanho(p, `falas.porEtapa.${etapa}`, fala, 160);
  }
  if (dados.estacoes.length < 1 || dados.estacoes.length > 4) p.push(`${dados.estacoes.length} estações (de 1 a 4)`);
  p.push(...repetidos(dados.estacoes.map((e) => e.id)).map((id) => `estação com id repetido "${id}"`));
  for (const estacao of dados.estacoes) {
    if (!KEBAB.test(estacao.id)) p.push(`a estação "${estacao.id}" não está em kebab-case`);
    p.push(...conferirEstacao(estacao));
  }
  return p;
}
