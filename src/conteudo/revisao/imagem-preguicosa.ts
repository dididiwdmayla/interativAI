/*
 * Revisão: imagem preguiçosa (S2, Fase 4).
 *
 * Uma ação (loading lazy numa foto que fica no fim da página) e uma previsão
 * sobre o que o atributo faz.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_IMAGEM_PREGUICOSA: ItemRevisao[] = [
  {
    id: "imagem-preguicosa-1",
    conceito: "imagem-preguicosa",
    tipo: "acao",
    enunciado: {
      mouse: "A foto do fim da página não precisa baixar já. Adicione loading com o valor lazy nela.",
      toque: "A foto do fim da página não precisa baixar já. Adicione loading com o valor lazy nela (Adicionar atributo, no menu da tag).",
    },
    siteAlvo: {
      url: "ceramicabarrovivo.exemplo",
      titulo: "Ateliê Barro Vivo",
      body: `<h1>Ateliê Barro Vivo</h1>
<p>Cerâmica feita à mão, em Tiradentes.</p>
<p>Veja nossa última fornada:</p>
<img id="foto-final" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='100'%3E%3Crect width='160' height='100' fill='%23b5654a'/%3E%3C/svg%3E" alt="Vasos de cerâmica saindo do forno" width="160" height="100">`,
    },
    validador: { tipo: "atributo", seletor: "#foto-final", nome: "loading", valor: "lazy" },
    ajudas: {
      pergunta: "Qual atributo diz para a foto esperar a pessoa chegar perto?",
      dica: "loading=\"lazy\" na tag img. Lazy quer dizer preguiçoso.",
    },
    solucaoDeTeste: [{ tipo: "adicionarAtributo", seletor: "#foto-final", nome: "loading", valor: "lazy" }],
  },
  {
    id: "imagem-preguicosa-2",
    conceito: "imagem-preguicosa",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "sorveteriagelatto.exemplo",
      titulo: "Sorveteria Gelatto",
      body: `<h1>Sorveteria Gelatto</h1>
<p>Sorvete artesanal em 20 sabores.</p>
<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='100'%3E%3Crect width='160' height='100' fill='%23e8c4a0'/%3E%3C/svg%3E" alt="Casquinha de sorvete de morango" loading="lazy" width="160" height="100">`,
    },
    previsao: {
      pergunta: "Esta foto tem loading=\"lazy\" e fica no fim da página. Quando o navegador baixa ela?",
      opcoes: [
        "Só quando a pessoa rolar até perto dela",
        "Nunca, ela fica escondida",
        "Antes de todo o resto da página",
      ],
      correta: 0,
      explicacao: "Lazy é preguiçoso: a foto espera a pessoa chegar perto. A página abre mais rápido porque baixa menos no começo.",
    },
    ajudas: {
      pergunta: "O que quer dizer \"lazy\" em português?",
      dica: "Preguiçoso: a foto só baixa quando precisa.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];
