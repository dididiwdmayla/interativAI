/*
 * Site-alvo da S2, Fase 2: "Vidraçaria Prisma".
 *
 * Os problemas de propósito: dois parágrafos de enchimento de palavra-chave
 * (um bem à vista, outro escondido no rodapé como "etiquetas") e dois
 * textos vagos onde a pessoa buscaria uma resposta (o que fazem e o horário).
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const VIDRACARIA_PRISMA: SiteAlvo = {
  url: "vidracariaprisma.exemplo",
  titulo: "Vidraçaria Prisma",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vidraçaria Prisma | Box, espelhos e vidro temperado em Campinas</title>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #1f3340; background: #eef6f9; }
  h1 { color: #14607a; }
  .enchimento { color: #3f5563; font-size: 14px; }
  footer { margin-top: 24px; border-top: 1px solid #b8d3dd; padding-top: 8px; }
</style>`,
  body: `<h1>Vidraçaria Prisma</h1>
<p id="resposta">Aqui você encontra tudo o que precisa para o seu vidro.</p>
<p id="enchimento-topo" class="enchimento">vidraçaria barata, vidraçaria em Campinas, vidraçaria 24 horas, vidraçaria perto de mim, vidraçaria boa e barata</p>
<h2>Horário</h2>
<p id="horario">Atendemos em horário comercial.</p>
<footer>
  <p id="enchimento-rodape" class="enchimento">vidro temperado barato vidro temperado Campinas vidro temperado orçamento vidro temperado grátis</p>
</footer>`,
};
