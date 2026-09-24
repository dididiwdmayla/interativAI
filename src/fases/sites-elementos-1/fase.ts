import { formatarHtml } from "@/lib/formatarHtml";
import type { Fase } from "@/motor/tipos";
import { itensComTexto, tagSelecionada, textoLimpo } from "@/motor/validacao";
import { BODY_INICIAL_PADARIA, HEAD_PADARIA, URL_PADARIA } from "./siteAlvo";

const NOVO_PRODUTO = "Sonho de creme";
const NOVA_MANCHETE = "Aqui quem manda sou eu";

/** Insere um li depois do último li do código. */
function inserirProduto(html: string): string {
  const fim = html.lastIndexOf("</li>");
  if (fim < 0) return html;
  const corte = fim + "</li>".length;
  return formatarHtml(`${html.slice(0, corte)}\n<li>${NOVO_PRODUTO}</li>${html.slice(corte)}`);
}

export const FASE_SITES_ELEMENTOS_1: Fase = {
  id: "sites-elementos-1",
  ilha: "Ilha Sites",
  zona: "Elementos",
  numero: 1,
  titulo: "O site é seu",
  urlSiteAlvo: URL_PADARIA,
  tituloSiteAlvo: "Site da Padaria Pão Quentinho",
  headSiteAlvo: HEAD_PADARIA,
  bodyInicial: BODY_INICIAL_PADARIA,
  abasDesbloqueadas: ["elementos"],
  apresentar: ["painel", "previa", "me-ajuda", "tutor"],

  introducao: [
    {
      texto:
        "Oi! Eu sou o computadorzinho. Sabia que todo site é montado com pecinhas? Elas se chamam elementos.",
      expressao: "feliz",
    },
    {
      texto:
        "Este painel aqui em cima mostra essas peças, igualzinho ao F12 de qualquer navegador de verdade.",
      expressao: "apontando",
    },
    {
      texto:
        "E hoje você vai mexer num site que não é seu: a Padaria Pão Quentinho. Bora?",
      expressao: "curioso",
    },
  ],

  objetivos: [
    {
      id: "selecionar-manchete",
      enunciado:
        "Passe o mouse pela árvore e veja o que acende na tela. Depois clique na manchete principal.",
      enunciadoToque: "Toque nos itens da árvore e veja o que acende na tela. Depois toque na manchete principal.",
      apresentar: ["arvore"],
      validar: ({ selecionado }) => tagSelecionada(selecionado) === "h1",
      ajudas: {
        pergunta: "Qual peça da árvore acende o texto maior da página?",
        dica: "Manchetes costumam usar a tag h1, a de título mais importante.",
        linha: {
          alvo: "arvore",
          seletor: "h1",
          parte: "no",
          fala: "Olha esse nó piscando na árvore. Passe o mouse nele e veja o que acende na tela.",
        },
        solucao: {
          fala: "Selecionei o h1 pra você. Ele é a manchete principal: a peça que mostra o texto maior da página.",
          aplicar: (contexto) => contexto.selecionar("h1"),
        },
      },
      falaAoConcluir: {
        texto: "Isso! Essa é a manchete, a tag h1. Viu como ela acendeu lá na tela?",
        expressao: "comemorando",
      },
    },
    {
      id: "inspecionar-botao",
      enunciado:
        "Agora ao contrário: use o modo inspecionar (a setinha) e clique no botão Encomendar lá na tela.",
      enunciadoToque:
        "Agora ao contrário: toque na setinha do modo inspecionar e depois no botão Encomendar lá na tela.",
      apresentar: ["inspecionar"],
      validar: ({ eventos, selecionado }) =>
        eventos.some((evento) => evento.tipo === "inspecionou" && evento.tag === "button") &&
        tagSelecionada(selecionado) === "button",
      ajudas: {
        pergunta: "E se, em vez de procurar na árvore, você apontasse direto na tela?",
        dica: "A setinha no topo do painel faz o site te mostrar qual peça é qual.",
        linha: {
          alvo: "inspecionar",
          fala: "Tá vendo a setinha piscando no topo do painel? Clique nela e depois no botão Encomendar lá na tela.",
        },
        solucao: {
          fala: "Usei a setinha e cliquei no botão Encomendar. Repare que a árvore pulou direto para a tag button.",
          aplicar: (contexto) => contexto.selecionar("button", { comoInspecao: true }),
        },
      },
      falaAoConcluir: {
        texto:
          "Mandou bem! A setinha faz o caminho contrário: da tela para o código. No F12 de verdade é igualzinho.",
        expressao: "comemorando",
      },
    },
    {
      id: "trocar-manchete",
      enunciado:
        "Dê dois cliques no texto da manchete, na árvore, e troque por qualquer frase sua.",
      enunciadoToque:
        "Dê dois toques no texto da manchete, na árvore (ou toque em Editar), e troque por qualquer frase sua.",
      apresentar: ["editar-duplo-clique"],
      validar: ({ documento, inicial }) => {
        const atual = textoLimpo(documento.querySelector("h1"));
        const original = textoLimpo(inicial.querySelector("h1"));
        return atual.length > 0 && atual !== original;
      },
      ajudas: {
        pergunta: "Onde mora o texto que aparece na manchete?",
        dica: "Na árvore, o texto fica entre a tag de abertura e a de fechamento. Dois cliques nele deixam editar.",
        linha: {
          alvo: "arvore",
          seletor: "h1",
          parte: "texto",
          fala: "O texto piscando na árvore é o da manchete. Dê dois cliques bem em cima dele.",
        },
        solucao: {
          fala: `Troquei o texto do h1 por "${NOVA_MANCHETE}". Foi só dar dois cliques no texto, escrever e apertar Enter.`,
          aplicar: (contexto) => contexto.editarTexto("h1", NOVA_MANCHETE),
        },
      },
      falaAoConcluir: {
        texto: "Olha a manchete nova no site! Você acabou de editar a página de outra pessoa.",
        expressao: "comemorando",
      },
    },
    {
      id: "novo-produto",
      enunciado: "Agora pelo código: adicione um produto novo na lista.",
      apresentar: ["editor", "sincronia"],
      validar: ({ documento, inicial }) =>
        itensComTexto(documento.querySelector("ul")) > itensComTexto(inicial.querySelector("ul")),
      ajudas: {
        pergunta: "No código, que tag se repete uma vez pra cada produto?",
        dica: "Cada produto é um li dentro do ul. Copie uma linha de li e mude o texto.",
        linha: {
          alvo: "editor",
          buscarTexto: "<li",
          fala: "Essas linhas piscando no editor são os produtos. Repare no padrão que se repete.",
        },
        solucao: {
          fala: `Coloquei <li>${NOVO_PRODUTO}</li> depois do último li. Cada produto é uma linha li dentro do ul.`,
          aplicar: (contexto) => contexto.editarCodigo(inserirProduto),
        },
      },
      falaAoConcluir: {
        texto: "Produto novo na vitrine! Cada li é um item da lista, e você criou um do zero.",
        expressao: "comemorando",
      },
    },
  ],

  conclusao: [
    {
      texto: "Fase completa! Você mexeu num site do jeitinho que quem programa mexe.",
      expressao: "comemorando",
    },
    {
      texto: "E o melhor: isso funciona em qualquer site. Tenho uma missão de campo pra você.",
      expressao: "feliz",
    },
  ],

  missaoDeCampo:
    "Isso funciona em qualquer site. Abra um site de verdade, aperte F12 (ou Ctrl+Shift+I), use a setinha, clique num texto e dê dois cliques nele na aba Elements. Troque o que quiser: só você vê, e some quando recarregar.",

  falaFinal: {
    texto: "Ah, e este jogo também é um site... o que será que tem no F12 dele?",
    expressao: "curioso",
  },
};
