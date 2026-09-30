/*
 * Site-alvo da S3, Fase 3: "Café Grão Dourado" (modo documento).
 *
 * Um bloco de dados estruturados (JSON-LD) no head com dois problemas: uma
 * vírgula sobrando no fim (JSON inválido) e nenhum endereço. Depois de
 * consertar o JSON, o Teste de dados estruturados ainda avisa que falta o
 * address.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const CAFE_GRAO_DOURADO: SiteAlvo = {
  url: "cafegraodourado.exemplo",
  titulo: "Café Grão Dourado",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Café Grão Dourado | Cafés especiais em Vitória</title>
<script id="dados-cafe" type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Café Grão Dourado",
  "telephone": "(27) 3555-0188",
}
</script>
<style>
  body { font-family: Georgia, serif; margin: 0; padding: 20px; color: #3a2a1c; background: #f8efe3; }
  h1 { color: #7a4a1e; }
</style>`,
  body: `<h1>Café Grão Dourado</h1>
<p>Cafés especiais, bolos caseiros e pão de queijo quentinho.</p>
<p>Aberto todos os dias, das 8h às 19h.</p>`,
};
