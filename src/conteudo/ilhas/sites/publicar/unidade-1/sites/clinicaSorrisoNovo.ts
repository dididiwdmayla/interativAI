/*
 * Site-alvo da P1, Fase 1: "Clínica Sorriso Novo".
 *
 * Problemas de propósito: a foto do consultório sem alt (a primeira
 * verificação que a fase ataca) e mais alguns que a auditoria acusa sem
 * a fase pedir ainda (nota baixa logo de cara, para a Fase 1 mostrar o
 * "antes").
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_CLINICA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Clínica Sorriso Novo</title>`;

const BODY_CLINICA = `<header>
  <h1>Clínica Sorriso Novo</h1>
  <p>Odontologia para toda a família</p>
</header>
<main>
  <img class="foto-consultorio" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240'%3E%3Crect width='400' height='240' fill='%230ea5e9'/%3E%3C/svg%3E">
  <section>
    <h2>Especialidades</h2>
    <p>Limpeza, clareamento e ortodontia.</p>
  </section>
</main>
<footer>
  <p>Rua dos Molares, 77</p>
</footer>`;

const CSS_CLINICA = `body {
  margin: 0;
  font-family: Arial, sans-serif;
  color: #0c4a6e;
  background-color: #f0f9ff;
}

header {
  padding: 20px 28px;
  background-color: #0284c7;
  color: white;
}

.foto-consultorio {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 16px 28px;
}

main {
  padding: 0 0 20px;
}

section {
  padding: 0 28px;
}

footer {
  padding: 14px 28px;
  background-color: #0c4a6e;
  color: #bae6fd;
}`;

export const CLINICA_SORRISO_NOVO: SiteAlvo = {
  url: "clinicasorrisonovo.com.br",
  titulo: "Clínica Sorriso Novo",
  head: HEAD_CLINICA,
  body: BODY_CLINICA,
  css: CSS_CLINICA,
};
