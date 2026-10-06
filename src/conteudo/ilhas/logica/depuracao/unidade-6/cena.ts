/*
 * A recepção do Salão Girassol, a cena das duas fases do chamado da agenda:
 * o espelho e a cadeira do salão, o balcão e, em cima dele, a tela do
 * aplicativo (o "dispositivo" de um software é a tela dele). No aquecimento
 * ela mostra a taxa de cada grupo; no contrato, a agenda que o programa
 * monta, com o horário marcado duas vezes em vermelho.
 */
import type { DadosCena } from "@/motor/cena/modelo";

export const CENA_SALAO: DadosCena = {
  id: "salao-recepcao",
  titulo: "A recepção do Salão Girassol",
  ambiente: "salao",
  periodo: "dia",
  duracaoMs: 4_000,
  cenario: [
    { peca: "parede", x: 0, y: 0, largura: 320, altura: 152, variante: "listras" },
    { peca: "espelho", x: 18, y: 32, largura: 46, altura: 62 },
    { peca: "quadro", x: 86, y: 38 },
    { peca: "piso", x: 0, y: 150, largura: 320, altura: 50, variante: "madeira" },
    { peca: "cadeira", x: 20, y: 98, largura: 44, altura: 58 },
    { peca: "planta", x: 92, y: 108 },
    { peca: "balcao", x: 150, y: 112, largura: 152, altura: 40, variante: "salao" },
  ],
  dispositivos: [{ id: "tela", tipo: "telaApp", x: 176, y: 28, nome: "Tela da agenda" }],
  linhaDoTempo: [],
};
