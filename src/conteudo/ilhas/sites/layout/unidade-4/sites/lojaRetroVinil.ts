/*
 * Site-alvo dos micro-passos da L4: "Loja Retrô Vinil".
 *
 * Três cenários para os três atos da unidade: .aviso e .preco-disco
 * (relative, sem sair do fluxo), .card com .selo/.selo-topo (absolute
 * ancorado no pai relative) e #cabecalho/.topo/.selo+.fita (sticky, fixed
 * e z-index, com um conflito de sobreposição de propósito entre o selo e
 * a fita do primeiro card).
 *
 * Âncoras naturais: #cabecalho, .aviso, .card, .selo, .selo-topo, .fita,
 * .preco-disco, .topo.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_VINIL = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Loja Retrô Vinil</title>`;

const BODY_VINIL = `<header id="cabecalho">
  <h1>Loja Retrô Vinil</h1>
</header>
<main>
  <p class="aviso">Chegaram os lançamentos de setembro!</p>
  <section>
    <h2>Discos em destaque</h2>
    <div class="card">
      <span class="selo">Promoção</span>
      <span class="fita">Últimas unidades</span>
      <h3>Noites de Neon</h3>
      <p class="preco-disco">R$ 89</p>
    </div>
    <div class="card">
      <span class="selo-topo">Novo</span>
      <h3>Trilhas de Verão</h3>
      <p>R$ 75</p>
    </div>
  </section>
  <button class="topo">Voltar ao topo</button>
</main>
<footer>
  <p>Loja Retrô Vinil, Rua do Compasso, 33</p>
</footer>`;

export const CSS_VINIL = `body {
  font-family: Arial, sans-serif;
  color: #2a2a2a;
  background-color: #f7f3ee;
  margin: 0;
}

#cabecalho {
  background-color: #402e2e;
  color: white;
  padding: 16px 24px;
}

h1 {
  margin: 0;
  font-size: 24px;
}

main {
  padding: 8px 24px;
}

.aviso {
  background-color: #e0a96d;
  padding: 8px 12px;
  border-radius: 6px;
}

h2 {
  color: #402e2e;
  font-size: 20px;
}

.card {
  background-color: white;
  border: 2px solid #e6ddd3;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.card h3 {
  margin: 8px 0 4px;
  font-size: 16px;
}

.selo {
  background-color: #bb4430;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.fita {
  background-color: #402e2e;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.selo-topo {
  background-color: #2f9c95;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.preco-disco {
  color: #bb4430;
  font-weight: bold;
  margin: 0;
}

.topo {
  background-color: #402e2e;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 12px 20px;
  font-weight: bold;
}

footer {
  background-color: #402e2e;
  color: #e6ddd3;
  font-size: 14px;
  padding: 12px 24px;
}`;

export const LOJA_RETRO_VINIL: SiteAlvo = {
  url: "retrovinil.loja.site",
  titulo: "Loja Retrô Vinil",
  head: HEAD_VINIL,
  body: BODY_VINIL,
  css: CSS_VINIL,
};
