/*
 * Sala 3: os programas do comparador, em cada linguagem.
 *
 * Conferidos (rodada 38): JavaScript e Python rodam de verdade no jogo (e
 * nos testes: testes/conteudo/linguagens.test.ts compara com a `saida`);
 * C e Java foram compilados e rodados (gcc e javac) e a saída é a daqui.
 * COBOL e BASIC seguem a gramática da época, sem compilador à mão:
 * - COBOL no formato fixo dos cartões (7 colunas antes do código), com
 *   SAIDA PIC Z9 para o 35 sair sem zero na frente ("TOTAL: 35");
 * - BASIC com número de linha, no estilo dos computadores de casa dos anos
 *   1980 (PRINT "X"; N põe um espaço antes do número positivo). Os nomes
 *   (PAO, LEITE, BOLO, SOMA) não escondem palavra reservada, que essas
 *   máquinas tropeçavam (TOTAL tem TO).
 */
import type { ParteComparada, ProgramaComparado } from "@/motor/exposicao/comparador";

const linhas = (texto: string, partes: (string | null)[]): ProgramaComparado["linhas"] =>
  texto.split("\n").map((linha, i) => (partes[i] ? { texto: linha, parte: partes[i] as string } : { texto: linha }));

/* ------------------------------------------------------------------ a conta da padaria */

export const PARTES_PADARIA: ParteComparada[] = [
  { id: "precos", nome: "Os preços", explica: "Guardar cada preço num nome: pão 12, leite 8, bolo 20. Toda linguagem tem um jeito de dar nome a um valor." },
  { id: "somar", nome: "Somar a conta", explica: "Juntar os três preços num total. O + é igual em quase todas: 12 + 8 + 20 dá 40." },
  { id: "desconto", nome: "O desconto", explica: "Tirar 5 reais do total. COBOL escreve em inglês quase falado: SUBTRACT 5 FROM. As outras usam o sinal de menos." },
  { id: "mostrar", nome: "Mostrar", explica: "Pôr o resultado na tela: console.log, print, printf, println, DISPLAY ou PRINT. Muda a palavra; a ideia é a mesma." },
  { id: "moldura", nome: "A moldura", explica: "O que a linguagem pede em volta. C e Java põem tudo dentro do main; COBOL divide o programa em partes. Python e JavaScript vão direto." },
];

const P = ["precos", "precos", "precos", "somar", "desconto", "mostrar"];

export const PADARIA: ProgramaComparado[] = [
  {
    linguagem: "cobol",
    linhas: linhas(
      `       IDENTIFICATION DIVISION.
       PROGRAM-ID. PADARIA.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 PAO    PIC 99 VALUE 12.
       01 LEITE  PIC 99 VALUE 8.
       01 BOLO   PIC 99 VALUE 20.
       01 CONTA  PIC 999.
       01 SAIDA  PIC Z9.
       PROCEDURE DIVISION.
           COMPUTE CONTA = PAO + LEITE + BOLO.
           SUBTRACT 5 FROM CONTA.
           MOVE CONTA TO SAIDA.
           DISPLAY "TOTAL: " SAIDA.
           STOP RUN.`,
      ["moldura", "moldura", "moldura", "moldura", "precos", "precos", "precos", "moldura", "moldura", "moldura", "somar", "desconto", "mostrar", "mostrar", "moldura"],
    ),
    saida: ["TOTAL: 35"],
  },
  {
    linguagem: "basic",
    linhas: linhas(
      `10 PAO = 12
20 LEITE = 8
30 BOLO = 20
40 SOMA = PAO + LEITE + BOLO
50 SOMA = SOMA - 5
60 PRINT "TOTAL:"; SOMA`,
      P,
    ),
    saida: ["TOTAL: 35"],
  },
  {
    linguagem: "c",
    linhas: linhas(
      `#include <stdio.h>

int main(void) {
    int pao = 12;
    int leite = 8;
    int bolo = 20;
    int total = pao + leite + bolo;
    total = total - 5;
    printf("Total: %d\\n", total);
    return 0;
}`,
      ["moldura", null, "moldura", ...P, "moldura", "moldura"],
    ),
    saida: ["Total: 35"],
  },
  {
    linguagem: "java",
    linhas: linhas(
      `public class Padaria {
    public static void main(String[] args) {
        int pao = 12;
        int leite = 8;
        int bolo = 20;
        int total = pao + leite + bolo;
        total = total - 5;
        System.out.println("Total: " + total);
    }
}`,
      ["moldura", "moldura", ...P, "moldura", "moldura"],
    ),
    saida: ["Total: 35"],
  },
  {
    linguagem: "javascript",
    linhas: linhas(
      `let pao = 12;
let leite = 8;
let bolo = 20;
let total = pao + leite + bolo;
total = total - 5;
console.log("Total: " + total);`,
      P,
    ),
    saida: ["Total: 35"],
  },
  {
    linguagem: "python",
    linhas: linhas(
      `pao = 12
leite = 8
bolo = 20
total = pao + leite + bolo
total = total - 5
print("Total:", total)`,
      P,
    ),
    saida: ["Total: 35"],
  },
];

/* ------------------------------------------------------------------ as fornadas (o mesmo laço) */

export const PARTES_FORNADAS: ParteComparada[] = [
  { id: "repete", nome: "O laço", explica: "De onde até onde contar: de 1 até 3. No Python, range(1, 4) para ANTES do 4: conta 1, 2 e 3." },
  { id: "faz", nome: "O que repete", explica: "A linha de dentro do laço roda uma vez por volta, com o i valendo 1, depois 2, depois 3." },
  { id: "fecha", nome: "Onde o laço acaba", explica: "JavaScript e C fecham com }, o BASIC com NEXT. O Python não fecha: o recuo (os espaços na frente) diz o que está dentro." },
];

export const FORNADAS: ProgramaComparado[] = [
  {
    linguagem: "basic",
    linhas: linhas(
      `10 FOR I = 1 TO 3
20 PRINT "FORNADA"; I
30 NEXT I`,
      ["repete", "faz", "fecha"],
    ),
    saida: ["FORNADA 1", "FORNADA 2", "FORNADA 3"],
  },
  {
    linguagem: "c",
    linhas: linhas(
      `#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 3; i++) {
        printf("Fornada %d\\n", i);
    }
    return 0;
}`,
      [null, null, null, "repete", "faz", "fecha", null, null],
    ),
    saida: ["Fornada 1", "Fornada 2", "Fornada 3"],
  },
  {
    linguagem: "javascript",
    linhas: linhas(
      `for (let i = 1; i <= 3; i++) {
  console.log("Fornada " + i);
}`,
      ["repete", "faz", "fecha"],
    ),
    saida: ["Fornada 1", "Fornada 2", "Fornada 3"],
  },
  {
    linguagem: "python",
    linhas: linhas(
      `for i in range(1, 4):
    print("Fornada", i)`,
      ["repete", "faz"],
    ),
    saida: ["Fornada 1", "Fornada 2", "Fornada 3"],
  },
];

/** O Python das fornadas, mudado para 5 fornadas (a solução do objetivo de editar). */
export const FORNADAS_PYTHON_ATE_5 = `for i in range(1, 6):
    print("Fornada", i)`;

/* ------------------------------------------------------------------ o frete (o desafio) */

export const PARTES_FRETE: ParteComparada[] = [
  { id: "valor", nome: "O valor da compra", explica: "Guardar quanto deu a compra: 45 reais." },
  { id: "decisao", nome: "A decisão", explica: "Se a compra passa de 30, o frete é grátis; senão, custa 7. Toda linguagem tem o seu se (if, IF)." },
  { id: "mostrar", nome: "Mostrar", explica: "Pôr na tela o que foi decidido." },
];

export const FRETE: ProgramaComparado[] = [
  {
    linguagem: "basic",
    linhas: linhas(
      `10 COMPRA = 45
20 IF COMPRA > 30 THEN PRINT "FRETE GRATIS"
30 IF COMPRA <= 30 THEN PRINT "FRETE: 7"`,
      ["valor", "decisao", "decisao"],
    ),
    saida: ["FRETE GRATIS"],
  },
  {
    linguagem: "java",
    linhas: linhas(
      `public class Frete {
    public static void main(String[] args) {
        int compra = 45;
        if (compra > 30) {
            System.out.println("Frete grátis");
        } else {
            System.out.println("Frete: 7");
        }
    }
}`,
      [null, null, "valor", "decisao", "mostrar", "decisao", "mostrar", "decisao", null, null],
    ),
    saida: ["Frete grátis"],
  },
  {
    linguagem: "javascript",
    linhas: linhas(
      `let compra = 45;
if (compra > 30) {
  console.log("Frete grátis");
} else {
  console.log("Frete: 7");
}`,
      ["valor", "decisao", "mostrar", "decisao", "mostrar", "decisao"],
    ),
    saida: ["Frete grátis"],
  },
  {
    linguagem: "python",
    linhas: linhas(
      `compra = 45
if compra > 30:
    print("Frete grátis")
else:
    print("Frete: 7")`,
      ["valor", "decisao", "mostrar", "decisao", "mostrar"],
    ),
    saida: ["Frete grátis"],
  },
];
