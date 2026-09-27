/*
 * Site-alvo do desafio da L4: "Confeitaria Doce Instante".
 *
 * Site NOVO: outro assunto (confeitaria) e outros nomes (.selo-bolo,
 * .fita-bolo, .card-bolo, .whatsapp), com o mesmo tipo de desafio anunciado
 * no mapa curricular: selo sobre o card e cabeçalho fixo.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_CONFEITARIA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Confeitaria Doce Instante</title>`;

const BODY_CONFEITARIA = `<header id="topo-confeitaria">
  <h1>Confeitaria Doce Instante</h1>
</header>
<main>
  <p class="aviso-confeitaria">Encomendas para o fim de semana até quinta-feira!</p>
  <section>
    <h2>Bolos da semana</h2>
    <div class="card-bolo">
      <span class="selo-bolo">Mais vendido</span>
      <span class="fita-bolo">Só hoje</span>
      <h3>Bolo de cenoura com brigadeiro</h3>
      <p class="preco-bolo">R$ 55</p>
    </div>
    <div class="card-bolo">
      <span class="selo-topo-bolo">Novidade</span>
      <h3>Bolo red velvet</h3>
      <p>R$ 68</p>
    </div>
  </section>
  <button class="whatsapp">Chamar no WhatsApp</button>
</main>
<footer>
  <p>Confeitaria Doce Instante, Rua do Açúcar, 21</p>
</footer>`;

const CSS_CONFEITARIA = `body {
  font-family: Arial, sans-serif;
  color: #3a2a2a;
  background-color: #fdf5f0;
  margin: 0;
}

#topo-confeitaria {
  background-color: #a4133c;
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

.aviso-confeitaria {
  background-color: #ffcad4;
  padding: 8px 12px;
  border-radius: 6px;
}

h2 {
  color: #a4133c;
  font-size: 20px;
}

.card-bolo {
  background-color: white;
  border: 2px solid #f6dde3;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.card-bolo h3 {
  margin: 8px 0 4px;
  font-size: 16px;
}

.selo-bolo {
  background-color: #a4133c;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.fita-bolo {
  background-color: #3a2a2a;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.selo-topo-bolo {
  background-color: #06a77d;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.preco-bolo {
  color: #a4133c;
  font-weight: bold;
  margin: 0;
}

.whatsapp {
  background-color: #06a77d;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 12px 20px;
  font-weight: bold;
}

footer {
  background-color: #3a2a2a;
  color: #f6dde3;
  font-size: 14px;
  padding: 12px 24px;
}`;

export const CONFEITARIA_DOCE_INSTANTE: SiteAlvo = {
  url: "doceinstante.confeitaria.site",
  titulo: "Confeitaria Doce Instante",
  head: HEAD_CONFEITARIA,
  body: BODY_CONFEITARIA,
  css: CSS_CONFEITARIA,
};
