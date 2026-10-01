// As apresentações das ferramentas da Ilha Lógica, parte B, pelo "Rever
// apresentação" da Caixa de Ferramentas nas demonstrações do /lab: cada uma
// abre, acha o alvo de verdade na tela (no celular, a aba certa aparece
// sozinha) e fecha no Pular.
// Uso: node testes/apresentacoes-logica.mjs [desktop|retrato|paisagem]
import { abrir, conferir, errosRelevantes, esperarPronto, fecharBalao } from "./util.mjs";

const MODO = process.argv[2] ?? "desktop";
const TAMANHOS = {
  desktop: { largura: 1440, altura: 900, toque: false },
  retrato: { largura: 390, altura: 844, toque: true },
  paisagem: { largura: 844, altura: 390, toque: true },
};
const { toque } = TAMANHOS[MODO];
const movel = MODO !== "desktop";

/** As demonstrações e as ferramentas que cada uma apresenta. */
const GRUPOS = [
  { fase: "lab-logica-u1-f4", ferramentas: ["pontos-de-parada", "controles-depurador", "painel-escopo", "painel-observar", "pilha-de-chamadas"] },
  { fase: "lab-logica-u1-f5", ferramentas: ["quadro-de-passos"] },
];

const todas = GRUPOS.flatMap((grupo) => grupo.ferramentas);
const PROGRESSO = {
  versao: 2,
  fasesConcluidas: [],
  estrelasPorFase: {},
  fasesEmAndamento: {},
  faseAtual: null,
  tema: "doce",
  temasDesbloqueados: ["doce", "fliperama"],
  som: false,
  missoesDeCampo: {},
  apresentacoesVistas: ["painel", "previa", "me-ajuda", "tutor", "console", "snippet", "palco-memoria", "linha-do-tempo", ...todas],
};

async function tocar(pagina, localizador) {
  if (toque) await localizador.tap();
  else await localizador.click();
  await esperarPronto(pagina);
}

for (const grupo of GRUPOS) {
  const { navegador, pagina, erros } = await abrir({ ...TAMANHOS[MODO], progresso: PROGRESSO, rota: `/lab/fases?fase=${grupo.fase}`, esperar: "[data-jogo-fase]" });
  const recolher = pagina.getByRole("button", { name: "Recolher o lab" });
  if (await recolher.isVisible().catch(() => false)) await tocar(pagina, recolher);
  await esperarPronto(pagina, 30000);
  for (const id of grupo.ferramentas) {
    if (movel) {
      await fecharBalao(pagina);
      await tocar(pagina, pagina.getByRole("button", { name: "Mais opções" }));
    }
    await tocar(pagina, pagina.getByRole("button", { name: "Abrir a Caixa de Ferramentas" }).first());
    const caixa = pagina.getByRole("dialog", { name: "Caixa de Ferramentas" });
    await caixa.waitFor();
    await tocar(pagina, caixa.locator(`[data-card="${id}"]`).getByRole("button", { name: "Rever apresentação" }));
    await pagina.locator(`[data-apresentacao="${id}"]`).waitFor({ timeout: 8000 });
    // O alvo de verdade está na tela (o buraco da apresentação mostra ele).
    await pagina.waitForFunction(
      (ferramenta) =>
        [...document.querySelectorAll(`[data-ferramenta~="${ferramenta}"]`)].some((el) => {
          const caixa = el.getBoundingClientRect();
          return caixa.width > 0 && caixa.height > 0 && caixa.bottom > 0 && caixa.top < window.innerHeight;
        }),
      id,
      { timeout: 5000 },
    ).catch(() => {});
    const visivel = await pagina.evaluate(
      (ferramenta) =>
        [...document.querySelectorAll(`[data-ferramenta~="${ferramenta}"]`)].some((el) => {
          const caixa = el.getBoundingClientRect();
          return caixa.width > 0 && caixa.height > 0 && caixa.bottom > 0 && caixa.top < window.innerHeight;
        }),
      id,
    );
    conferir(visivel, `${MODO}: a apresentação de ${id} acha o alvo na tela`);
    await tocar(pagina, pagina.getByRole("button", { name: "Pular" }));
    await pagina.locator(`[data-apresentacao="${id}"]`).waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
  }
  const relevantes = errosRelevantes(erros);
  conferir(relevantes.length === 0, `${MODO} ${grupo.fase}: console limpo (${relevantes.join(" | ")})`);
  await navegador.close();
}
console.log(`apresentacoes-logica.mjs ${MODO}: ok`);
