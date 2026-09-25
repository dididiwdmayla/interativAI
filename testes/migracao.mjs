// Progresso antigo (chave v1, com a Fase 1 no meio) migra sem perder nada:
// HTML, objetivo, estrelas, missão, tema e apresentações vistas.
import { abrir, conferir, errosRelevantes } from "./util.mjs";

const VISTAS = ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique", "editor", "sincronia"];
const HTML = `<header class="topo">Padaria</header>
<h1>Pão quentinho toda manhã</h1>
<p class="descricao">Minha descrição</p>
<button class="botao">Encomendar</button>
<ul class="produtos">
  <li>Pão</li>
</ul>`;
const V1 = {
  versao: 1,
  fasesConcluidas: [],
  estrelasPorFase: {},
  fasesEmAndamento: { "sites-elementos-1": { objetivoAtual: 2, htmlAtual: HTML, estrelas: 2, introducaoVista: true } },
  tema: "fliperama",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: { "sites-elementos-1": true },
  apresentacoesVistas: VISTAS,
  proporcaoPrevia: 0.5,
};

// Entra pelo mapa, como quem volta a jogar depois da atualização.
const { navegador, pagina, erros } = await abrir({ progresso: V1, rota: "/", esperar: "[data-mapa=mundo]" });
conferir((await pagina.locator("[data-mascote-no-mapa=sites]").count()) === 1, "mundo: o computadorzinho está em Sites");
await pagina.locator("[data-ilha=sites]").click();
await pagina.locator("[data-mapa=ilha][data-ilha=sites]").waitFor();
await pagina.locator('[data-unidade="sites-elementos-u1"]').click();
const continuar = pagina.getByRole("dialog").getByRole("button", { name: "Continuar", exact: true });
conferir((await continuar.count()) === 1, "ilha: a U1 aparece em andamento (Continuar)");
await continuar.click();
await pagina.waitForSelector("section[data-previa] iframe");
await pagina.waitForTimeout(1200);
conferir(new URL(pagina.url()).pathname === "/fase/sites-elementos-u1-f1", "abre a fase migrada");
conferir((await pagina.locator("[data-meta]").count()) === 0, "quem já tinha progresso não vê a meta de novo");
const iframe = pagina.frameLocator("section[data-previa] iframe");
conferir((await iframe.locator("p.descricao").textContent()) === "Minha descrição", "o HTML salvo na v1 volta");
conferir((await pagina.locator("[aria-current=step]").textContent()).includes("Dê dois cliques"), "continua no objetivo 3");
conferir((await pagina.locator("html").getAttribute("data-theme")) === "fliperama", "tema mantido");
conferir((await pagina.locator("[data-apresentacao]").count()) === 0, "apresentações vistas não repetem");
conferir((await pagina.locator("header [aria-label='2 de 3 estrelas']").count()) === 1, "estrelas mantidas");
const v2 = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v2")));
conferir(
  v2.versao === 2 &&
    v2.fasesEmAndamento["sites-elementos-u1-f1"].objetivoAtual === 2 &&
    v2.missoesDeCampo["sites-elementos-u1-f1"] === true &&
    v2.faseAtual === "sites-elementos-u1-f1" &&
    v2.proporcaoPrevia === 0.5,
  "v2 gravada com os ids novos, missão, fase atual e proporção",
);
conferir((await pagina.evaluate(() => localStorage.getItem("ilha-sites:progresso:v1"))) !== null, "a v1 fica intacta como cópia");
conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
