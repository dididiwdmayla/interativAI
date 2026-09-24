// Caixa de Ferramentas, "Rever apresentação", "Pular" e o "?" das ferramentas.
import { abrir, conferir, errosRelevantes } from "./util.mjs";

const BASE = {
  versao: 1,
  fasesConcluidas: [],
  estrelasPorFase: {},
  fasesEmAndamento: { "sites-elementos-1": { objetivoAtual: 0, htmlAtual: null, estrelas: 3, introducaoVista: true } },
  tema: "doce",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: [],
};

const { navegador, pagina, erros } = await abrir({ progresso: BASE });

// Pular salva como vista e passa para a próxima.
await pagina.locator('[data-apresentacao="painel"]').waitFor();
await pagina.getByRole("button", { name: "Pular" }).click();
await pagina.locator('[data-apresentacao="previa"]').waitFor();
conferir(true, "Pular fecha e segue para a próxima");
for (const id of ["previa", "me-ajuda", "tutor", "arvore"]) {
  await pagina.locator(`[data-apresentacao="${id}"]`).waitFor();
  await pagina.keyboard.press("Escape");
}
await pagina.waitForTimeout(400);
conferir((await pagina.locator("[data-apresentacao]").count()) === 0, "Esc pula também");
const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem("ilha-sites:progresso:v1")).apresentacoesVistas);
conferir(salvo.length === 5, `puladas ficam salvas (${salvo.join(", ")})`);

// Caixa: conhecidas e silhuetas.
await pagina.getByRole("button", { name: "Abrir a Caixa de Ferramentas" }).click();
const caixa = pagina.getByRole("dialog", { name: "Caixa de Ferramentas" });
await caixa.waitFor();
conferir((await caixa.getByText("Você conhece essa em breve").count()) === 4, "4 ferramentas ainda em silhueta");
conferir((await caixa.getByRole("button", { name: "Rever apresentação" }).count()) === 5, "5 cards com Rever");
await pagina.screenshot({ path: "/tmp/claude-0/caixa.png" });

// Rever apresentação.
await caixa.locator('[data-card="arvore"]').getByRole("button", { name: "Rever apresentação" }).click();
await pagina.locator('[data-apresentacao="arvore"]').waitFor();
conferir(true, "Rever abre a apresentação de novo");
await pagina.getByRole("button", { name: "Pular" }).click();
await pagina.waitForTimeout(300);

// "?" abre o card certo.
await pagina.locator('[data-ferramenta~="arvore"]').first().hover();
await pagina.getByRole("button", { name: "O que é: Árvore de elementos" }).click();
await caixa.waitFor();
const emFoco = await caixa.locator("[data-card].ring-2").getAttribute("data-card");
conferir(emFoco === "arvore", "o ? abre a Caixa no card da ferramenta");
await pagina.keyboard.press("Escape");
await caixa.waitFor({ state: "detached", timeout: 3000 }).catch(() => {});
conferir((await caixa.count()) === 0, "Esc fecha a Caixa");

conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
