/*
 * O data-chave da árvore: os testes Playwright calculam a chave de um
 * seletor com src/motor/chaveArvore.ts; aqui confirmamos que é exatamente
 * a chave que a árvore desenha para cada nó, em todos os sites-alvo.
 */
import { describe, expect, it } from "vitest";
import { FASES } from "@/conteudo";
import { construirArvore, type NoArvore } from "@/lib/arvore";
import { criarDocumentoSolto } from "@/lib/documentoSiteAlvo";
import { chaveDoNo, chaveDoSeletor } from "@/motor/chaveArvore";

function todos(no: NoArvore): NoArvore[] {
  return [no, ...(no.textoEmLinha ? [no.textoEmLinha] : []), ...no.filhos.flatMap(todos)];
}

describe("data-chave da árvore", () => {
  it("a chave de cada nó da árvore é a de chaveDoNo, em todos os sites", () => {
    const problemas: string[] = [];
    for (const fase of FASES) {
      const documento = criarDocumentoSolto(fase.siteAlvo.head, fase.siteAlvo.body);
      for (const no of todos(construirArvore(documento.body))) {
        const calculada = chaveDoNo(documento.body, no.no);
        if (calculada !== no.chave) problemas.push(`${fase.id}: árvore "${no.chave}", chaveDoNo "${calculada}"`);
      }
    }
    expect(problemas).toEqual([]);
  });

  it("esquema: body, índices entre filhos visíveis, texto também conta", () => {
    const documento = criarDocumentoSolto(
      "",
      `<header>Topo</header>
      <!-- comentário -->
      <main><h1>Oi</h1>   <ul><li>Um</li><li>Dois</li></ul></main>`,
    );
    expect(chaveDoNo(documento.body, documento.body)).toBe("body");
    expect(chaveDoSeletor(documento, "header")).toBe("0");
    expect(chaveDoSeletor(documento, "main")).toBe("2");
    expect(chaveDoSeletor(documento, "main li:last-child")).toBe("2.1.1");
    const texto = documento.querySelector("main li")?.firstChild;
    expect(texto && chaveDoNo(documento.body, texto)).toBe("2.1.0.0");
    expect(chaveDoSeletor(documento, "#nao-existe")).toBeNull();
  });
});
