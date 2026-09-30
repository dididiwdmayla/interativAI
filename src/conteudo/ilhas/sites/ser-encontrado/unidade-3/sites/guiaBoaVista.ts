/*
 * Site-alvo da S3, Fase 4: "Guia do bairro Boa Vista" (modo documento).
 *
 * Uma página de guia com dois negócios, cada um com o seu bloco de dados
 * estruturados, os dois com o tipo genérico LocalBusiness. O primeiro é uma
 * sorveteria (IceCreamShop); o segundo, um encanador (Plumber).
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const GUIA_BOA_VISTA: SiteAlvo = {
  url: "guiaboavista.exemplo",
  titulo: "Guia do bairro Boa Vista",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Guia do bairro Boa Vista | Negócios perto de você</title>
<script id="dados-sorveteria" type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Sorveteria Gelato Bello",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Praça da Boa Vista, 8",
    "addressLocality": "Recife"
  },
  "telephone": "(81) 3555-0120"
}
</script>
<script id="dados-encanador" type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Hidráulica Seu Nilo",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua do Cais, 77",
    "addressLocality": "Recife"
  },
  "telephone": "(81) 3555-0177"
}
</script>
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 20px; color: #24303a; background: #eef4f7; }
  h1 { color: #1f5f7a; }
  li { margin-bottom: 6px; }
</style>`,
  body: `<h1>Guia do bairro Boa Vista</h1>
<p>Dois negócios do bairro que vale conhecer.</p>
<ul>
  <li>Sorveteria Gelato Bello: sorvete artesanal na Praça da Boa Vista.</li>
  <li>Hidráulica Seu Nilo: vazamentos e canos, atendimento no mesmo dia.</li>
</ul>`,
};
