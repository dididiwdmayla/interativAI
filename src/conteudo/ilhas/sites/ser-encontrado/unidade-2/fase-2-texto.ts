/*
 * S2, Fase 2: "Texto para quem busca" (Vidraçaria Prisma).
 *
 * O QUE ENSINA: um texto que responde o que a pessoa foi buscar (preço,
 * prazo, horário), com as palavras que ela usaria, e o enchimento de
 * palavra-chave (repetir a mesma expressão sem sentido), que só piora a
 * página. Ataca a confusão "encher de palavra-chave ajuda".
 *
 * REVISA: editar texto pela árvore (U1) e apagar (U2).
 *
 * ORDEM: dois pares guiado + sozinho. 1) guiado, com previsão, reescrever
 * a resposta com preço e prazo; 2) sozinho, o mesmo com o horário (outra
 * pergunta da pessoa); 3) guiado, com previsão, apagar o enchimento à
 * vista; 4) sozinho, achar e apagar o enchimento escondido no rodapé.
 * O validador de texto só confere que o texto mudou: quem confere se ficou
 * bom é o jogador (e o computadorzinho, que pergunta).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { VIDRACARIA_PRISMA } from "./sites/vidracariaPrisma";

const RESPOSTA = "Box de banheiro a partir de R$ 480, instalado em 3 dias, com orçamento grátis.";
const HORARIO = "Abrimos de segunda a sexta, das 8h às 18h, e aos sábados, das 8h às 12h.";

export const FASE_S2_F2: FasePratica = {
  id: "sites-ser-encontrado-u2-f2",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u2",
  titulo: "Texto para quem busca",
  conceitos: ["texto-que-responde", "enchimento-de-palavra-chave"],
  revisa: ["editar-texto", "remover-do-documento"],
  prerequisitos: ["editar-texto", "h1-da-pagina"],
  usaFerramentas: ["arvore", "editar-duplo-clique", "apagar"],
  siteAlvo: VIDRACARIA_PRISMA,
  introducao: [
    { texto: "Quem busca tem uma dúvida na cabeça: quanto custa, quando abre, como funciona. A página boa responde isso logo.", expressao: "pensativo" },
    { texto: "A Vidraçaria Prisma tem textos vagos e dois parágrafos estranhos. Vamos ver o que a busca faria com eles.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "resposta-com-preco",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Alguém busca \"quanto custa box de vidro\". Que texto da página ajuda mais essa pessoa?",
        opcoes: ["Aqui você encontra tudo o que precisa", "Vidraçaria barata, vidraçaria boa, vidraçaria", "Box de banheiro a partir de R$ 480, instalado em 3 dias"],
        correta: 2,
        explicacao: "A pessoa quer o preço e o prazo. O texto que responde isso, com as palavras que ela usaria, serve a quem lê e à busca.",
      },
      enunciado: {
        mouse: "Reescreva o parágrafo \"Aqui você encontra tudo...\" (dois cliques na árvore) dizendo o preço e o prazo do box.",
        toque: "Reescreva o parágrafo \"Aqui você encontra tudo...\" (toque no texto, na árvore) dizendo o preço e o prazo do box.",
      },
      validador: { tipo: "textoDiferenteDoInicial", seletor: "#resposta" },
      ajudas: {
        pergunta: "Se a pessoa buscou o preço e o texto não fala de preço, ela fica na página?",
        dica: "Escreva o que a pessoa quer saber: quanto custa e em quanto tempo. Um valor e um prazo já bastam.",
        linha: { alvo: "arvore", seletor: "#resposta", parte: "texto", fala: "Este parágrafo é vago. Troque o texto dele por uma resposta." },
        solucao: {
          fala: "Troquei o texto vago por uma resposta com preço e prazo: quem busca sabe na hora se serve.",
          acoes: [{ tipo: "definirTexto", seletor: "#resposta", valor: RESPOSTA }],
        },
      },
      falaAoConcluir: { texto: "Agora o texto responde a dúvida da pessoa, com as palavras dela. É isso que a busca quer mostrar.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 2 },
        { tipo: "definirTexto", seletor: "#resposta", valor: RESPOSTA },
      ],
    },
    {
      id: "resposta-com-horario",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Alguém busca \"vidraçaria aberta sábado\". Reescreva o parágrafo do horário com os dias e as horas.",
        toque: "Alguém busca \"vidraçaria aberta sábado\". Reescreva o parágrafo do horário com os dias e as horas.",
      },
      validador: { tipo: "textoDiferenteDoInicial", seletor: "#horario" },
      ajudas: {
        pergunta: "\"Horário comercial\" responde se abre no sábado?",
        dica: "Diga os dias e as horas, do jeito que a pessoa perguntaria: de segunda a sexta, aos sábados.",
      },
      falaAoConcluir: { texto: "Horário claro, com dias e horas. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#horario", valor: HORARIO }],
    },
    {
      id: "apagar-enchimento",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Repetir \"vidraçaria barata\" e parecidos várias vezes no texto ajuda a página a subir na busca?",
        opcoes: ["Não: o texto fica chato de ler e a repetição sem sentido não ajuda", "Sim, quanto mais repetir, mais sobe", "Só ajuda se o texto ficar bem pequeno"],
        correta: 0,
        explicacao: "Isso é enchimento de palavra-chave. Não é truque que funciona: deixa o texto ruim de ler, e quem lê vai embora.",
      },
      enunciado: {
        mouse: "Apague o parágrafo de enchimento que fica logo abaixo do texto do box (o das várias \"vidraçaria\").",
        toque: "Apague o parágrafo de enchimento que fica logo abaixo do texto do box (o das várias \"vidraçaria\").",
      },
      validador: { tipo: "naoExiste", seletor: "#enchimento-topo" },
      ajudas: {
        pergunta: "Qual dos parágrafos só repete as mesmas palavras, sem dizer nada de novo?",
        dica: "Ele tem a classe enchimento. Selecione e apague: quem lê não perde nada, e a página fica melhor.",
        linha: { alvo: "arvore", seletor: "#enchimento-topo", fala: "Este parágrafo só repete palavras. Apague ele." },
        solucao: { fala: "Apaguei o parágrafo repetido: a página ficou mais limpa e continua dizendo tudo o que precisa.", acoes: [{ tipo: "apagar", seletor: "#enchimento-topo" }] },
      },
      falaAoConcluir: { texto: "Sem enchimento! Escreva para a pessoa que vai ler, não para enganar a busca.", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "apagar", seletor: "#enchimento-topo" },
      ],
    },
    {
      id: "achar-enchimento-escondido",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Ainda sobrou enchimento em algum lugar da página, num canto menos óbvio. Ache e apague.",
        toque: "Ainda sobrou enchimento em algum lugar da página, num canto menos óbvio. Ache e apague.",
      },
      validador: { tipo: "naoExiste", seletor: ".enchimento" },
      ajudas: {
        pergunta: "Onde numa página costumam ficar as listinhas de palavras que ninguém lê?",
        dica: "Olhe o fim do código, no rodapé (footer): tem um parágrafo com a classe enchimento.",
      },
      falaAoConcluir: { texto: "Achou o escondido! Enchimento no rodapé é igualzinho: ninguém lê e não ajuda.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "apagar", seletor: ".enchimento" }],
    },
  ],
  conclusao: [
    { texto: "Um texto que responde e nada de enchimento. É escrever para gente, e a busca gosta do que gente gosta.", expressao: "feliz" },
    { texto: "Agora os links e as fotos: eles também precisam dizer o que são.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Busque no Google uma dúvida sua (por exemplo, \"quanto custa ...\" ou \"que horas abre ...\"). Abra dois resultados: qual responde já no começo da página? Aperte F12 e veja em qual tag está a resposta.",
  falaFinal: { texto: "Próxima fase: links e fotos que se explicam.", expressao: "feliz" },
};
