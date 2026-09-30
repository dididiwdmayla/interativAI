/*
 * Site-alvo da S3, Fase 1: "Salão Trança Fina".
 *
 * O perfil da empresa no Google (dito nas falas) tem o telefone (21) 3555-0142
 * e o endereço Rua das Acácias, 45, Niterói. O site diz coisas diferentes em
 * dois lugares: o telefone do rodapé (dois números trocados) e o endereço do
 * contato (54 no lugar de 45).
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const SALAO_TRANCA_FINA: SiteAlvo = {
  url: "salaotrancafina.exemplo",
  titulo: "Salão Trança Fina",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Salão Trança Fina | Cabeleireiro em Niterói</title>
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 20px; color: #3a2634; background: #fbf1f5; }
  h1 { color: #a3306b; }
  footer { margin-top: 24px; border-top: 1px solid #e3bfd0; padding-top: 8px; font-size: 14px; }
</style>`,
  body: `<header>
  <h1 id="nome">Salão Trança Fina</h1>
  <p>Telefone: <span id="tel-topo">(21) 3555-0142</span></p>
</header>
<main>
  <p>Corte, escova e coloração, com hora marcada.</p>
  <h2>Onde estamos</h2>
  <p id="endereco-contato">Rua das Acácias, 54, Niterói</p>
</main>
<footer>
  <p>Trança Fina. Ligue: <span id="tel-rodape">(21) 3555-0124</span></p>
</footer>`,
};
