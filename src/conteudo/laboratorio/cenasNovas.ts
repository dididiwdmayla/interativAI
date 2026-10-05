/** Quatro lugares, montados com peças e acontecimentos do kit. */
import type { AcontecimentoCena, DadosCena } from "@/motor/cena/modelo";

export const CHEGADAS_GARAGEM: AcontecimentoCena[][] = [1000, 3500, 5500].map(em => [{ em, dispositivo: "sensorCarro", propriedade: "temCarro", valor: true }]);
export const CENA_GARAGEM: DadosCena = {
  id: "garagem-automatica", titulo: "A garagem da vila", ambiente: "garagem", periodo: "noite", duracaoMs: 10000,
  cenario: [
    { peca: "ceu", x: 0, y: 0, largura: 320, altura: 160 },
    { peca: "piso", x: 0, y: 145, altura: 55, variante: "calcada" },
    { peca: "garagem", x: 28, y: 15, largura: 270, altura: 142 },
    { peca: "planta", x: 293, y: 115, largura: 22, altura: 41 },
  ],
  dispositivos: [
    { id: "portao", tipo: "portao", x: 52, y: 109, escala: .78 },
    { id: "sensorCarro", tipo: "sensorCarro", x: 22, y: 134, escala: .8 },
    { id: "luz", tipo: "lampada", x: 120, y: 56, variante: "spot", escala: 1.15 },
  ],
  linhaDoTempo: CHEGADAS_GARAGEM[0],
  atores: [{ id: "carro", desenho: "carro", x: 56, y: 188, escala: .85, visivelQuando: { dispositivo: "sensorCarro", propriedade: "temCarro", valor: true }, acoes: { entrar: { duracaoMs: 1000, destino: { x: 111, y: 126 }, aoConcluir: [{ dispositivo: "sensorCarro", propriedade: "temCarro", valor: false }] } } }],
  reacoes: [{ quando: { dispositivo: "portao", propriedade: "aberto", valor: true }, se: [{ dispositivo: "sensorCarro", propriedade: "temCarro", valor: true }], atrasoMs: 1200, entao: { ator: "carro", acao: "entrar" } }],
};

const porta = (em: number, valor: boolean): AcontecimentoCena => ({ em, dispositivo: "geladeira", propriedade: "portaAberta", valor });
export const PORTAS_COZINHA: AcontecimentoCena[][] = [
  [porta(1000, true), porta(6500, false)],
  [porta(500, true), porta(1500, false), porta(3500, true), porta(8500, false)],
  [porta(1500, true), porta(3500, false), porta(5000, true), porta(6500, false)],
];
export const CENA_COZINHA: DadosCena = {
  id: "cozinha-de-casa", titulo: "A cozinha do fim da tarde", ambiente: "cozinha", periodo: "dia", duracaoMs: 11000,
  cenario: [
    { peca: "parede", x: 0, y: 0, altura: 154 },
    { peca: "piso", x: 0, y: 151, altura: 49, variante: "madeira" },
    { peca: "janela", x: 234, y: 24, largura: 66, altura: 51, variante: "cortina" },
    { peca: "cozinha", x: 84, y: 44, largura: 213, altura: 115 },
    { peca: "tapete", x: 144, y: 174, largura: 120, altura: 16 },
    { peca: "planta", x: 259, y: 50, largura: 20, altura: 27 },
  ],
  dispositivos: [
    { id: "geladeira", tipo: "geladeira", x: 13, y: 58, escala: 1.14 },
    { id: "alarme", tipo: "alarme", x: 37, y: 22, escala: .9 },
    { id: "forno", tipo: "forno", x: 94, y: 110, escala: .88 },
    { id: "luz", tipo: "lampada", x: 179, y: 23, inicial: { ligada: true, brilho: 65 } },
  ], linhaDoTempo: PORTAS_COZINHA[0],
};

export const PEDIDOS_ESQUINA: AcontecimentoCena[][] = [1500, 3000].map(em => [{ em, dispositivo: "botao", propriedade: "pressionado", valor: true }, { em: em + 300, dispositivo: "botao", propriedade: "pressionado", valor: false }]);
PEDIDOS_ESQUINA.push([]);
export const CENA_ESQUINA: DadosCena = {
  id: "esquina-pedestres", titulo: "A esquina do passeio", ambiente: "esquina", periodo: "dia", duracaoMs: 12000,
  cenario: [
    { peca: "ceu", x: 0, y: 0, altura: 110 },
    { peca: "parede", x: 5, y: 27, largura: 74, altura: 90, variante: "tijolos" },
    { peca: "janela", x: 17, y: 40, largura: 26, altura: 32 },
    { peca: "janela", x: 48, y: 40, largura: 24, altura: 32 },
    { peca: "parede", x: 226, y: 10, largura: 87, altura: 107 },
    { peca: "janela", x: 239, y: 25, largura: 58, altura: 35 },
    { peca: "porta", x: 253, y: 66, largura: 27, altura: 48 },
    { peca: "planta", x: 7, y: 89, largura: 30, altura: 35 },
    { peca: "rua", x: 0, y: 103, largura: 320, altura: 97 },
  ],
  dispositivos: [{ id: "semaforo", tipo: "semaforo", x: 77, y: 15, escala: .95 }, { id: "botao", tipo: "botao", x: 66, y: 83, escala: .85 }],
  linhaDoTempo: PEDIDOS_ESQUINA[0],
  atores: [{ id: "pedestre", desenho: "pessoa", x: 147, y: 119, escala: .65, acoes: { atravessar: { duracaoMs: 2200, destino: { x: 176, y: 193 } } } }],
  reacoes: [{ quando: { dispositivo: "semaforo", propriedade: "cor", valor: "vermelho" }, entao: { ator: "pedestre", acao: "atravessar" } }],
};

export const CLIMAS_ESTUFA: AcontecimentoCena[][] = [
  [{ de: 0, ate: 6000, dispositivo: "sensorUmidade", propriedade: "valor", valorInicial: 65, valorFinal: 5 }, { em: 7000, dispositivo: "sensorDia", propriedade: "dia", valor: false }],
  [{ em: 0, dispositivo: "sensorDia", propriedade: "dia", valor: false }, { em: 0, dispositivo: "sensorUmidade", propriedade: "valor", valor: 15 }, { em: 4500, dispositivo: "sensorDia", propriedade: "dia", valor: true }, { em: 7000, dispositivo: "sensorUmidade", propriedade: "valor", valor: 75 }],
  [{ em: 0, dispositivo: "sensorUmidade", propriedade: "valor", valor: 80 }],
];
export const CENA_ESTUFA: DadosCena = {
  id: "estufa-jardim", titulo: "A estufa das pequenas folhas", ambiente: "estufa", periodo: "dia", periodoPor: { dispositivo: "sensorDia", propriedade: "dia" }, duracaoMs: 10000,
  cenario: [
    { peca: "ceu", x: 0, y: 0, largura: 320, altura: 170 },
    { peca: "piso", x: 0, y: 149, altura: 51, variante: "madeira" },
    { peca: "estufa", x: 17, y: 10, largura: 284, altura: 162 },
    { peca: "canteiro", x: 28, y: 125, largura: 119, altura: 53, variante: "tomates" },
    { peca: "canteiro", x: 178, y: 127, largura: 112, altura: 49 },
    { peca: "planta", x: 25, y: 59, largura: 24, altura: 36 },
    { peca: "prateleira", x: 24, y: 79, largura: 54, altura: 25, variante: "potes" },
  ],
  dispositivos: [
    { id: "sensorUmidade", tipo: "sensorUmidade", x: 95, y: 122, escala: .85 },
    { id: "aspersor", tipo: "aspersor", x: 149, y: 116 },
    { id: "sensorDia", tipo: "sensorDia", x: 248, y: 61, escala: .9 },
  ], linhaDoTempo: CLIMAS_ESTUFA[0],
};
export const CENAS_NOVAS = [CENA_GARAGEM, CENA_COZINHA, CENA_ESQUINA, CENA_ESTUFA];
