/*
 * Site-alvo do desafio da R1: "Academia Corpo em Movimento".
 *
 * Site NOVO (academia, não padaria nem pet shop), com TRÊS problemas de
 * celular escondidos, para o jogador achar com o modo dispositivo e
 * consertar sem passo a passo:
 * 1. sem meta viewport (simulação de 980px) — modoDocumento: true na
 *    fase para poder consertar;
 * 2. a foto (.foto-academia) com width fixo de 600px, maior que o
 *    Celular 390: estoura a tela;
 * 3. a caixa de horários (.caixa-horarios) com width fixo de 500px,
 *    maior que o Celular 390: empurra a página para o lado.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_ACADEMIA = `<meta charset="utf-8">
<title>Academia Corpo em Movimento</title>`;

const BODY_ACADEMIA = `<header>
  <h1>Academia Corpo em Movimento</h1>
  <p>Musculação, funcional e muito mais</p>
</header>
<main>
  <img class="foto-academia" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='200'%3E%3Crect width='600' height='200' fill='%23334155'/%3E%3C/svg%3E" alt="Salão principal da academia, com aparelhos de musculação">
  <section class="caixa-horarios">
    <h2>Horários</h2>
    <p>Segunda a sexta: 6h às 22h</p>
    <p>Sábado: 8h às 14h</p>
  </section>
  <section>
    <h2>Planos</h2>
    <p>Mensal <span class="preco">R$ 99</span></p>
    <p>Trimestral <span class="preco">R$ 249</span></p>
  </section>
</main>
<footer>
  <p>Rua da Saúde, 300</p>
</footer>`;

const CSS_ACADEMIA = `body {
  margin: 0;
  font-family: Arial, sans-serif;
  color: #0f172a;
  background-color: #f1f5f9;
}

header {
  padding: 24px 32px;
  background-color: #16a34a;
  color: white;
}

h1 {
  margin: 0 0 6px;
}

main {
  padding: 20px 32px;
}

.foto-academia {
  width: 600px;
  display: block;
  margin-bottom: 16px;
}

.caixa-horarios {
  width: 500px;
  padding: 12px;
  border: 2px solid #16a34a;
  border-radius: 8px;
  margin-bottom: 16px;
}

.preco {
  font-weight: bold;
}

footer {
  padding: 14px 32px;
  background-color: #0f172a;
  color: #bbf7d0;
}`;

export const ACADEMIA_CORPO_EM_MOVIMENTO: SiteAlvo = {
  url: "corpoemmovimento.com.br",
  titulo: "Academia Corpo em Movimento",
  head: HEAD_ACADEMIA,
  body: BODY_ACADEMIA,
  css: CSS_ACADEMIA,
};
