/*
 * Sala 5: o mapa dos cabos (o oceano do próprio jogo, com as ilhas) e os
 * arquivos da aba Rede.
 *
 * Fatos conferidos (rodada 38), sem número exato quando não precisa:
 * - quase todo o tráfego de internet entre continentes passa por cabos de
 *   fibra óptica no fundo do mar (satélites carregam uma parte pequena);
 * - o DNS traduz o nome do site no endereço (IP) do servidor; o endereço
 *   do exemplo, 203.0.113.7, é de um bloco reservado para documentação;
 * - 200 é OK, 404 é Not Found e 500 é Internal Server Error (HTTP).
 */
import type { CaboDoMapa, IlhaDoMapa, NoDoMapa } from "@/motor/exposicao/simulacoes/pacote";
import type { Requisicao } from "@/motor/exposicao/simulacoes/abaRede";

export const ILHAS_DO_MAPA: IlhaDoMapa[] = [
  { nome: "Origens", x: 12, y: 32, raio: 10 },
  { nome: "Sites", x: 38, y: 74, raio: 9 },
  { nome: "Lógica", x: 54, y: 26, raio: 9 },
  { nome: "Páginas vivas", x: 74, y: 12, raio: 6 },
  { nome: "Rede e Servidor", x: 86, y: 64, raio: 11 },
];

export const PONTOS_DO_MAPA: NoDoMapa[] = [
  { id: "casa", nome: "Sua casa", figura: "casa", x: 7, y: 26 },
  { id: "bairro", nome: "Roteador do bairro", figura: "roteador", x: 15, y: 36 },
  { id: "costa-origens", nome: "Estação de cabo", figura: "estacao-cabo", x: 22, y: 44 },
  { id: "sites", nome: "Roteador da Sites", figura: "roteador", x: 38, y: 70 },
  { id: "logica", nome: "Roteador da Lógica", figura: "roteador", x: 54, y: 28 },
  { id: "costa-rede", nome: "Estação de cabo", figura: "estacao-cabo", x: 78, y: 58 },
  { id: "servidor", nome: "Servidor da padaria", figura: "servidor", x: 92, y: 66 },
];

export function cabosDoMapa(partidos: readonly string[] = []): CaboDoMapa[] {
  const cabos: CaboDoMapa[] = [
    { de: "casa", para: "bairro" },
    { de: "bairro", para: "costa-origens" },
    { de: "costa-origens", para: "sites", submarino: true },
    { de: "costa-origens", para: "logica", submarino: true },
    { de: "sites", para: "costa-rede", submarino: true },
    { de: "logica", para: "costa-rede", submarino: true },
    { de: "costa-rede", para: "servidor" },
  ];
  return cabos.map((cabo) => (partidos.includes(`${cabo.de}>${cabo.para}`) ? { ...cabo, partido: true } : cabo));
}

export const ARQUIVOS_DA_PADARIA: Requisicao[] = [
  { id: "pagina", nome: "padariadobairro.com.br", tipo: "documento", status: 200, tamanhoKb: 14, inicioMs: 0, duracaoMs: 120 },
  { id: "estilo", nome: "estilo.css", tipo: "estilo", status: 200, tamanhoKb: 6, inicioMs: 130, duracaoMs: 60 },
  { id: "cardapio", nome: "cardapio.js", tipo: "script", status: 200, tamanhoKb: 22, inicioMs: 130, duracaoMs: 90 },
  { id: "letra", nome: "letra.woff2", tipo: "fonte", status: 200, tamanhoKb: 30, inicioMs: 140, duracaoMs: 110 },
  { id: "logo", nome: "logo.png", tipo: "imagem", status: 200, tamanhoKb: 18, inicioMs: 200, duracaoMs: 80 },
  { id: "foto", nome: "foto-dos-paes.jpg", tipo: "imagem", status: 200, tamanhoKb: 850, inicioMs: 200, duracaoMs: 1400 },
  { id: "selo", nome: "selo-antigo.png", tipo: "imagem", status: 404, tamanhoKb: 1, inicioMs: 210, duracaoMs: 40 },
];

export const ARQUIVOS_DO_SALAO: Requisicao[] = [
  { id: "pagina", nome: "salaogirassol.com.br", tipo: "documento", status: 200, tamanhoKb: 11, inicioMs: 0, duracaoMs: 100 },
  { id: "estilo", nome: "cores.css", tipo: "estilo", status: 200, tamanhoKb: 5, inicioMs: 110, duracaoMs: 50 },
  { id: "agenda", nome: "agenda", tipo: "dados", status: 500, tamanhoKb: 1, inicioMs: 130, duracaoMs: 900 },
  { id: "foto", nome: "fachada.jpg", tipo: "imagem", status: 200, tamanhoKb: 240, inicioMs: 120, duracaoMs: 300 },
  { id: "script", nome: "horarios.js", tipo: "script", status: 200, tamanhoKb: 9, inicioMs: 110, duracaoMs: 70 },
];
