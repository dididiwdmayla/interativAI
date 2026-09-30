/*
 * Site-alvo da S5, Fase 2: "Ótica Olhar Novo" (página de destino JÁ BOA:
 * title, meta description, foto com alt e rodapé legível). Assim a fase 2
 * isola o efeito do orçamento e da palavra-chave, sem a página atrapalhar.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const OTICA_OLHAR_NOVO: SiteAlvo = {
  url: "oticaolharnovo.exemplo",
  titulo: "Ótica Olhar Novo",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ótica Olhar Novo | Óculos de grau e de sol em Sorocaba</title>
<meta name="description" content="Óculos de grau e de sol com exame de vista na hora, em Sorocaba. Peça o orçamento pelo WhatsApp.">
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 16px; color: #33261a; background: #f2f7fb; }
  .foto { display: block; width: 100%; max-width: 320px; height: 120px; background: #d9b8a0; }
  .pedir { background: #2f8f5b; color: #ffffff; border: 0; border-radius: 999px; padding: 10px 16px; font-weight: bold; }
  .rodape { color: #e8d9cc; }
</style>`,
  body: `<main>
  <h1>Ótica Olhar Novo</h1>
  <p>Óculos de grau e de sol, com exame de vista na hora.</p>
  <img class="foto" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Vitrine com armações de óculos de grau">
  <button class="pedir" type="button" data-evento="clique_whatsapp">Pedir pelo WhatsApp</button>
</main>
<footer class="rodape" style="color: #4a3a2a">Rua Direita, 210. Aberta de segunda a sábado.</footer>`,
};
