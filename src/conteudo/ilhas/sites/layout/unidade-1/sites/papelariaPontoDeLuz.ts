/*
 * Site-alvo dos micro-passos da L1: "Papelaria Ponto de Luz".
 *
 * Pensado para MOSTRAR o efeito do display com fundo colorido: cada peça
 * que muda de display ganha um background-color (ou já tinha), para o
 * jogador ver a caixa mudar de forma, não só ler o valor no painel.
 *
 * Âncoras naturais: #menu-principal, .etiqueta, .chegou, .preco,
 * #aviso-frete, .aviso-manutencao.
 *
 * Sem @media: a página funciona em 390px numa coluna só (nada empilha em
 * duas colunas para começo de conversa).
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_PAPELARIA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Papelaria Ponto de Luz</title>`;

const BODY_PAPELARIA = `<header>
  <h1>Papelaria Ponto de Luz</h1>
  <nav id="menu-principal">
    <ul>
      <li><a href="#cadernos">Cadernos</a></li>
      <li><a href="#canetas">Canetas</a></li>
      <li><a href="#brindes">Brindes</a></li>
    </ul>
  </nav>
</header>
<main>
  <p>Bem-vindo à papelaria! <span class="etiqueta">Novidade</span> toda semana.</p>
  <section id="cadernos">
    <h2>Cadernos</h2>
    <p>Caderno universitário de 10 matérias <span class="preco">R$ 32</span></p>
  </section>
  <section id="canetas">
    <h2>Canetas</h2>
    <p>Estojo com 12 canetas coloridas <span class="preco">R$ 18</span></p>
  </section>
  <section id="brindes">
    <h2>Brindes</h2>
    <p>Toda compra acima de R$ 50 ganha um marcador de página. <span class="chegou">Chegou!</span></p>
  </section>
  <p id="aviso-frete">Frete grátis em compras acima de R$ 100</p>
  <p class="aviso-manutencao">Fechado para balanço no último domingo do mês</p>
</main>
<footer>
  <p>Papelaria Ponto de Luz, Rua das Acácias, 45</p>
</footer>`;

export const CSS_PAPELARIA = `body {
  font-family: Arial, sans-serif;
  color: #333333;
  background-color: #fffaf0;
  margin: 0;
}

header {
  background-color: #4a4e69;
  color: white;
  padding: 16px 24px;
}

h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

#menu-principal ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

#menu-principal li {
  background-color: #22223b;
  margin-bottom: 2px;
}

#menu-principal a {
  color: white;
  padding: 8px 16px;
  text-decoration: none;
}

main {
  padding: 8px 24px;
}

h2 {
  color: #4a4e69;
  font-size: 20px;
}

.etiqueta {
  background-color: #f2545b;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
}

.chegou {
  background-color: #4a9d5f;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
}

.preco {
  background-color: #ffd166;
  width: 60px;
  font-weight: bold;
  padding: 2px 6px;
}

#aviso-frete {
  background-color: #d9ead3;
  padding: 8px 12px;
}

.aviso-manutencao {
  background-color: #f4cccc;
  padding: 8px 12px;
}

footer {
  background-color: #22223b;
  color: #c9c9d9;
  font-size: 14px;
  padding: 12px 24px;
}`;

export const PAPELARIA_PONTO_DE_LUZ: SiteAlvo = {
  url: "pontodeluz.papelaria.site",
  titulo: "Papelaria Ponto de Luz",
  head: HEAD_PAPELARIA,
  body: BODY_PAPELARIA,
  css: CSS_PAPELARIA,
};
