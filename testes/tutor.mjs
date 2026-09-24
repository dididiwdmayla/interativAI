// Servidor em dev com TUTOR_SIMULAR=sobrecarga-total (padrão deste teste),
// TUTOR_SIMULAR=sobrecarga (rode com RESERVA=1) ou sem chave (rode com SEM_CHAVE=1).
import { abrir, conferir, errosRelevantes } from "./util.mjs";

const { navegador, pagina, erros } = await abrir({ progresso: null });
for (let i = 0; i < 12; i++) {
  const botao = pagina.getByRole("button", { name: /Continuar|Vamos lá|Pular/ }).first();
  if (!(await botao.isVisible().catch(() => false))) break;
  await botao.click();
  await pagina.waitForTimeout(150);
}
const campo = pagina.getByPlaceholder("Pergunte ao computadorzinho...").first();
await campo.fill("o que é h1?");
await campo.press("Enter");
if (process.env.RESERVA) {
  await pagina.getByText("Resposta simulada do modelo reserva.").first().waitFor({ timeout: 20000 });
  conferir(true, "modelo reserva responde e o jogador nem percebe");
} else if (process.env.SEM_CHAVE) {
  await pagina.getByText("Meu chat ainda não foi ligado").first().waitFor({ timeout: 15000 });
  conferir(true, "sem chave mostra chat desligado");
} else {
  await pagina.getByText("Tem muita gente falando comigo agora").first().waitFor({ timeout: 20000 });
  conferir(true, "sobrecarga mostra a fala certa");
  const repetir = pagina.getByRole("button", { name: "Tentar de novo" }).first();
  conferir(await repetir.isVisible(), "botão Tentar de novo aparece");
  await repetir.click();
  await pagina.getByText("Hmm, deixa eu pensar").first().waitFor({ timeout: 3000 });
  conferir(true, "Tentar de novo reenvia a pergunta");
  await pagina.getByText("Tem muita gente falando comigo agora").first().waitFor({ timeout: 20000 });
}
conferir(errosRelevantes(erros).length === 0, `console limpo ${JSON.stringify(errosRelevantes(erros))}`);
await navegador.close();
