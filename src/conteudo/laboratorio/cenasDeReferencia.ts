/*
 * As duas cenas de referência do kit (src/motor/cena): o padrão visual que
 * as próximas seguem. São só dados: o cenário montado com peças do kit, os
 * dispositivos com os nomes que o código usa e a linha do tempo.
 *
 * - O quarto à noite: uma lâmpada pendente e um ventilador na cabeceira;
 *   ninguém aparece (a missão é piscar a lâmpada).
 * - A vitrine da Padaria Pão de Mel: a fachada à noite, a luz da vitrine, o
 *   sensor de presença em cima da porta e o letreiro; uma pessoa passa e
 *   para na frente da vitrine.
 */
import type { AcontecimentoCena, DadosCena } from "@/motor/cena/modelo";

export const CENA_QUARTO: DadosCena = {
  id: "quarto-noite",
  titulo: "O quarto à noite",
  ambiente: "quarto",
  periodo: "noite",
  duracaoMs: 6_000,
  cenario: [
    { peca: "parede", x: 0, y: 0, largura: 320, altura: 152, variante: "listras" },
    { peca: "piso", x: 0, y: 150, largura: 320, altura: 50, variante: "madeira" },
    { peca: "janela", x: 30, y: 34, largura: 66, altura: 54, variante: "cortina" },
    { peca: "quadro", x: 178, y: 36, largura: 38, altura: 30 },
    { peca: "prateleira", x: 230, y: 58, largura: 58, altura: 28, variante: "livros" },
    { peca: "tapete", x: 100, y: 174, largura: 100, altura: 18 },
    { peca: "planta", x: 14, y: 130, largura: 26, altura: 44 },
    { peca: "cama", x: 150, y: 120, largura: 120, altura: 52 },
    { peca: "mesa", x: 276, y: 140, largura: 36, altura: 32, variante: "cabeceira" },
  ],
  dispositivos: [
    { id: "lampada", tipo: "lampada", x: 132, y: 46 },
    { id: "ventilador", tipo: "ventilador", x: 294, y: 140, escala: 0.75 },
  ],
  linhaDoTempo: [],
};

/** A pessoa que passa na frente da vitrine: chega no segundo 3 e vai embora no 7. */
export const CHEGADA_PADRAO: AcontecimentoCena[] = [{ tipo: "pessoa", chegaMs: 3_000, saiMs: 7_000, x: 118, lado: "esquerda" }];

export const CENA_VITRINE: DadosCena = {
  id: "vitrine-padaria",
  titulo: "A vitrine da Padaria Pão de Mel",
  ambiente: "vitrine",
  periodo: "noite",
  duracaoMs: 10_000,
  cenario: [
    { peca: "parede", x: 0, y: 0, largura: 320, altura: 156, variante: "tijolos" },
    // Dentro da vitrine: a parede da loja, os pães na prateleira e no balcão.
    { peca: "parede", x: 22, y: 54, largura: 176, altura: 88 },
    { peca: "prateleira", x: 30, y: 62, largura: 76, altura: 26, variante: "paes" },
    { peca: "prateleira", x: 114, y: 62, largura: 76, altura: 26, variante: "potes" },
    { peca: "balcao", x: 36, y: 100, largura: 148, altura: 40, variante: "padaria" },
    { peca: "vitrine", x: 22, y: 54, largura: 176, altura: 88 },
    { peca: "toldo", x: 12, y: 32, largura: 196, altura: 24 },
    { peca: "porta", x: 228, y: 70, largura: 46, altura: 82, variante: "vidro" },
    { peca: "planta", x: 284, y: 112, largura: 24, altura: 42 },
    { peca: "piso", x: 0, y: 152, largura: 320, altura: 48, variante: "calcada" },
  ],
  dispositivos: [
    { id: "letreiro", tipo: "letreiro", x: 54, y: 4, inicial: { texto: "PÃO DE MEL" } },
    { id: "luz", tipo: "lampada", x: 110, y: 62, variante: "spot" },
    { id: "sensor", tipo: "sensor", x: 251, y: 62 },
  ],
  linhaDoTempo: CHEGADA_PADRAO,
};
