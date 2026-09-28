/*
 * Site-alvo do desafio da P1: "Livraria Capítulo Final" (site novo).
 *
 * Nota baixa de propósito, juntando os quatro tipos de problema das
 * fases 1 e 2: imagem sem alt, título pulando nível ("Lançamentos da
 * semana" é h3, logo depois do h1, sem h2), texto de pouco contraste e
 * um botão sem texto (só um ícone). O título do livro já é h3 (não h4),
 * porque depois do conserto (h3 -> h2) ele fica logo abaixo, sem pular.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_LIVRARIA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Livraria Capítulo Final</title>`;

const BODY_LIVRARIA = `<header>
  <h1>Livraria Capítulo Final</h1>
  <p class="aviso-promocao">Segunda-feira é dia de 20% de desconto em toda a loja</p>
</header>
<main>
  <img class="foto-livraria" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='240'%3E%3Crect width='420' height='240' fill='%23854d0e'/%3E%3C/svg%3E">
  <h3>Lançamentos da semana</h3>
  <article>
    <h3>O Farol Distante</h3>
    <p>Romance <span class="preco">R$ 54,90</span></p>
    <button class="botao-comprar" type="button"><span class="icone-carrinho"></span></button>
  </article>
</main>
<footer>
  <p>Avenida dos Livros, 300</p>
</footer>`;

const CSS_LIVRARIA = `body {
  margin: 0;
  font-family: Georgia, serif;
  color: #292524;
  background-color: #fffbeb;
}

header {
  padding: 20px 28px;
  background-color: #854d0e;
  color: white;
}

.aviso-promocao {
  color: #d6b98c;
  margin: 4px 0 0;
}

main {
  padding: 20px 28px;
}

.foto-livraria {
  display: block;
  max-width: 100%;
  height: auto;
  margin-bottom: 16px;
}

article {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preco {
  font-weight: bold;
}

.botao-comprar {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background-color: #854d0e;
}

.icone-carrinho {
  display: block;
  width: 100%;
  height: 100%;
}

footer {
  padding: 14px 28px;
  background-color: #292524;
  color: #fde68a;
}`;

export const LIVRARIA_CAPITULO_FINAL: SiteAlvo = {
  url: "capitulofinal.com.br",
  titulo: "Livraria Capítulo Final",
  head: HEAD_LIVRARIA,
  body: BODY_LIVRARIA,
  css: CSS_LIVRARIA,
};
