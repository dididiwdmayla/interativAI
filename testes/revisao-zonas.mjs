// A Revisão do dia com os itens de uma zona, jogada no navegador: progresso
// semeado com todas as fases publicadas da Ilha Sites e, para cada conceito
// que a zona ensina, o agendamento vencido. Cada sessão pega até 5 conceitos;
// o teste abre uma sessão por grupo de 5, confere que cada item monta (o
// mini-site na prévia, o enunciado, sem estrelas) e o percorre pelos dois
// caminhos que não dependem da solução: a previsão respondida (o item acaba
// ali ou depois do "Próximo") e "Não lembrei" nos itens de ação. Que a
// SOLUÇÃO de cada item cumpre o objetivo já é do `testar:conteudo`.
// A variação mostrada alterna de um conceito para o outro (`vezes` 0 e 1).
// Uso: node testes/revisao-zonas.mjs [desktop|retrato|paisagem] [zona]
//   zona: elementos | estilos | layout | responsivo | publicar (padrão: todas)
import { readdirSync, readFileSync } from "node:fs";
import { PUBLICADAS } from "./curriculo.mjs";
import { abrir, abrirBalao, conferir, errosRelevantes, esperarPronto, fecharBalao, opcaoDaPrevisao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const ZONA = process.argv[3];
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const toque = TAMANHOS[MODO].toque;
const movel = MODO !== "desktop";
const ZONAS = ["elementos", "estilos", "layout", "responsivo", "publicar"];

const raiz = new URL("../src/conteudo/", import.meta.url);
/** Os conceitos com itens de revisão (`conceito: "x"` nos arquivos de src/conteudo/revisao). */
const comItens = new Set(
  readdirSync(new URL("revisao/", raiz))
    .filter((arquivo) => arquivo.endsWith(".ts"))
    .flatMap((arquivo) => [...readFileSync(new URL(`revisao/${arquivo}`, raiz), "utf8").matchAll(/conceito: "([a-z0-9-]+)"/g)].map((m) => m[1])),
);

/** Os conceitos que a zona ENSINA (fases de prática, campo `conceitos`), na ordem das fases. */
function conceitosDaZona(zona) {
  const pasta = new URL(`ilhas/sites/${zona}/`, raiz);
  const achados = [];
  for (const unidade of readdirSync(pasta).filter((nome) => nome.startsWith("unidade-")).sort()) {
    for (const arquivo of readdirSync(new URL(`${unidade}/`, pasta)).filter((nome) => nome.startsWith("fase-")).sort()) {
      const fonte = readFileSync(new URL(`${unidade}/${arquivo}`, pasta), "utf8");
      if (!/tipo: "pratica"/.test(fonte)) continue;
      const lista = fonte.match(/^\s*conceitos: \[([^\]]*)\]/m);
      for (const id of lista ? [...lista[1].matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]) : []) {
        if (comItens.has(id) && !achados.includes(id)) achados.push(id);
      }
    }
  }
  return achados;
}

function dia(deslocamento = 0) {
  const agora = new Date();
  const alvo = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + deslocamento);
  const dois = (n) => String(n).padStart(2, "0");
  return `${alvo.getFullYear()}-${dois(alvo.getMonth() + 1)}-${dois(alvo.getDate())}`;
}

const todasAsFases = Object.values(PUBLICADAS).flat();
const unidades = Object.keys(PUBLICADAS);
function progressoCom(conceitos) {
  return {
    versao: 2,
    fasesConcluidas: todasAsFases,
    estrelasPorFase: {},
    fasesEmAndamento: {},
    faseAtual: null,
    tema: "doce",
    temasDesbloqueados: ["doce", "fliperama"],
    som: false,
    missoesDeCampo: {},
    apresentacoesVistas: [],
    metasVistas: unidades,
    unidadesComemoradas: unidades,
    posicaoNoMapa: {},
    mapaDesbloqueado: false,
    proporcaoPrevia: 0.4,
    revisao: {
      conceitos: Object.fromEntries(
        conceitos.map((id, i) => [id, { nivel: 1, proxima: dia(-1 - i), vezes: i % 2, ultima: dia(-4) }]),
      ),
      sequencia: { atual: 0, melhor: 0, ultimoDia: null },
    },
  };
}

const zonas = ZONA ? [ZONA] : ZONAS;
const conceitos = zonas.flatMap(conceitosDaZona);
conferir(conceitos.length > 0, `${MODO}: há conceitos com item de revisão em ${zonas.join(", ")}`);
const grupos = [];
for (let i = 0; i < conceitos.length; i += 5) grupos.push(conceitos.slice(i, i + 5));

const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: progressoCom(grupos[0]), rota: "/revisao", esperar: "[data-revisao-inicio]" });
const assentar = () => esperarPronto(pagina);

async function tocar(localizador) {
  await localizador.scrollIntoViewIfNeeded();
  if (toque) await localizador.tap();
  else await localizador.click();
}

async function falhar(nome, erro) {
  await pagina.screenshot({ path: `testes-falha-revisao-zonas-${MODO}-${nome}.png` }).catch(() => {});
  throw erro;
}

let vistos = 0;
for (const [g, grupo] of grupos.entries()) {
  if (g > 0) {
    await pagina.evaluate((progresso) => localStorage.setItem("ilha-sites:progresso:v2", JSON.stringify(progresso)), progressoCom(grupo));
    await pagina.goto(new URL("/revisao", pagina.url()).href);
    await pagina.locator("[data-revisao-inicio]").waitFor();
  }
  conferir((await pagina.locator("[data-vencidos]").getAttribute("data-vencidos")) === String(grupo.length), `${MODO}: sessão ${g + 1}, ${grupo.length} itens vencidos`);
  await tocar(pagina.locator("[data-comecar-revisao]"));
  for (let i = 0; i < grupo.length; i++) {
    const item = pagina.locator("[data-item-revisao]");
    try {
      await pagina.locator("[data-item-revisao] [data-jogo-fase][data-etapa='objetivos']").waitFor({ timeout: 15000 });
    } catch (erro) {
      await falhar(`sessao${g + 1}-item${i + 1}`, erro);
    }
    await assentar();
    const id = await item.getAttribute("data-item-revisao");
    conferir(grupo.some((conceito) => id?.startsWith(`${conceito}-`)), `${MODO}: o item ${id} é de um conceito da sessão`);
    conferir((await pagina.locator("[data-estrelas]").count()) === 0, `${MODO}: ${id} sem estrelas`);
    conferir((await pagina.locator("[data-previa], iframe").count()) > 0, `${MODO}: ${id} mostra o mini-site na prévia`);
    if (movel) await abrirBalao(pagina);
    const previsao = pagina.locator("[data-previsao] button");
    if ((await previsao.count()) > 0) {
      await tocar(await opcaoDaPrevisao(pagina));
      await pagina.locator("[data-previsao-respondida]").waitFor();
      await abrirBalao(pagina);
      const proximo = pagina.getByRole("button", { name: /^Próximo$/ }).first();
      // Previsão com validador (os itens de U1 e U2): depois do palpite, falta fazer; aí é "Não lembrei".
      const naoLembrei = pagina.locator("[data-nao-lembrei]").first();
      try {
        await proximo.or(naoLembrei).waitFor({ timeout: 8000 });
      } catch (erro) {
        await falhar(`${id}-proximo`, erro);
      }
      if ((await proximo.count()) > 0) await tocar(proximo);
      else {
        if (movel) await fecharBalao(pagina);
        await tocar(naoLembrei);
      }
    } else {
      if (movel) await fecharBalao(pagina);
      await tocar(pagina.locator("[data-nao-lembrei]").first());
    }
    await assentar();
    vistos += 1;
  }
  await pagina.locator("[data-revisao-resumo]").waitFor();
  conferir((await pagina.locator("[data-resumo-conceito]").count()) === grupo.length, `${MODO}: o resumo da sessão ${g + 1} tem os ${grupo.length} conceitos`);
}

conferir(vistos === conceitos.length, `${MODO}: ${vistos} itens percorridos, um por conceito`);
const relevantes = errosRelevantes(erros);
conferir(relevantes.length === 0, `${MODO}: console limpo${relevantes.length ? `: ${relevantes.join(" | ")}` : ""}`);
await navegador.close();
console.log(`revisao-zonas ${MODO} (${zonas.join(", ")}): ${vistos} itens em ${grupos.length} sessões, tudo certo.`);
