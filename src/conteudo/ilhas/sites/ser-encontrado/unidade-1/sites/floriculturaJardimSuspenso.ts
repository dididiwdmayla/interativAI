/*
 * Site-alvo da S1, Fase 2: "Floricultura Jardim Suspenso".
 *
 * O title já está bom (a Fase 1 ensinou); falta a meta description, então
 * a busca mostra o primeiro parágrafo, que fala do tempo de casa e não do
 * que a pessoa procura (entrega de flores).
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const FLORICULTURA_JARDIM_SUSPENSO: SiteAlvo = {
  url: "jardimsuspenso.exemplo",
  titulo: "Floricultura Jardim Suspenso",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Jardim Suspenso | Floricultura em Olinda</title>
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 20px; color: #20382a; background: #f3faf3; }
  h1 { color: #2f7a4a; }
</style>`,
  body: `<h1>Floricultura Jardim Suspenso</h1>
<p>Desde 1998 no mesmo endereço, com muito carinho.</p>
<p>Buquês, cestas e arranjos com entrega no mesmo dia em Olinda e Recife.</p>
<p>Telefone: (81) 3000-1234</p>`,
};
