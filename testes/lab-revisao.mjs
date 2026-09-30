// /lab/revisao: a lista de todos os itens de revisão por zona e conceito e a
// abertura direta de um item (pela lista e pelo endereço ?item=), sem mexer no
// progresso. Uso: node testes/lab-revisao.mjs [desktop|retrato|paisagem]
import { abrir, conferir, errosRelevantes, esperarPronto } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: null, rota: "/lab/revisao", esperar: "[data-lab-revisao=lista]" });
try {
  const zonas = await pagina.locator("[data-zona]").count();
  const itens = await pagina.locator("[data-abrir-item]").count();
  conferir(zonas >= 5, `${MODO}: a lista agrupa por zona (${zonas} zonas)`);
  conferir(itens >= 214, `${MODO}: a lista tem todos os itens (${itens})`);
  conferir((await pagina.locator('[data-zona="Ser encontrado"]').count()) === 1, `${MODO}: a zona Ser encontrado aparece na lista`);

  // Abre um item pela lista.
  const botao = pagina.locator('[data-abrir-item="descricao-na-busca-2"]');
  await botao.scrollIntoViewIfNeeded();
  if (toque) await botao.tap();
  else await botao.click();
  await pagina.locator('[data-item-revisao="descricao-na-busca-2"] [data-jogo-fase][data-etapa="objetivos"]').waitFor({ timeout: 15000 });
  await esperarPronto(pagina);
  conferir(new URL(pagina.url()).searchParams.get("item") === "descricao-na-busca-2", `${MODO}: o endereço guarda o item aberto`);

  // Abre direto pelo endereço.
  await pagina.goto(`${new URL(pagina.url()).origin}/lab/revisao?item=rastreamento-1`);
  await pagina.locator('[data-item-revisao="rastreamento-1"] [data-jogo-fase]').waitFor({ timeout: 15000 });
  conferir(true, `${MODO}: ?item= abre o item direto`);

  const relevantes = errosRelevantes(erros);
  conferir(relevantes.length === 0, `${MODO}: console limpo (${relevantes.slice(0, 2).join(" | ")})`);
} finally {
  await navegador.close();
}
