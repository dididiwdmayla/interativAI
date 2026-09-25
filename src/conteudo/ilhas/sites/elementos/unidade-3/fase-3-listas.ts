/*
 * Unidade 3, Fase 3: "Listas: soltas ou em ordem".
 *
 * O QUE ENSINA: ol numera porque a ordem dos itens importa (um passo a
 * passo); ul não numera porque a ordem não muda o sentido (materiais,
 * ingredientes).
 *
 * REVISÃO ESPAÇADA: a trilha e duplicar elemento (Unidade 2) voltam
 * misturados: subir da lista até a ul pela trilha, e duplicar um item para
 * ver que a lista continua fazendo sentido como ul.
 *
 * O SITE: o Blog da Horta já com a hierarquia e as ênfases certas (fases 1
 * e 2 feitas), pra o foco ficar só nas listas.
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado: sobe da lista de passos até a ul pela trilha (revisão) e troca
 *    para ol — a ordem dos passos muda o resultado da receita.
 * 2. Guiado, previsão: antes de duplicar um item da lista de materiais, o
 *    jogador aposta se ela ainda faz sentido como ul. Faz: a ordem dos
 *    materiais não muda nada.
 * 3. Sozinho: outra lista da página (cuidados da semana, por dia), sem
 *    dizer qual: o jogador decide sozinho que a ordem importa e numera.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_HORTA_LIMPO } from "./sites/blogDaHorta";

export const FASE_U3_F3: FasePratica = {
  id: "sites-elementos-u3-f3",
  tipo: "pratica",
  unidadeId: "sites-elementos-u3",
  titulo: "Listas: soltas ou em ordem",
  conceitos: ["lista-numerada"],
  revisa: ["duplicar-elemento"],
  prerequisitos: ["lista-e-itens", "selecionar-pela-arvore"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editar-duplo-clique", "trilha", "duplicar", "renomear-tag"],
  siteAlvo: SITE_HORTA_LIMPO,

  introducao: [
    { texto: "Hierarquia e ênfases já estão certas no post da horta. Falta só arrumar as listas!", expressao: "feliz" },
    { texto: "Uma lista pode ser solta (ul) ou numerada (ol): depende se a ordem dos itens importa.", expressao: "pensativo" },
    { texto: "Vamos descobrir qual lista precisa de números.", expressao: "curioso" },
  ],

  objetivos: [
    {
      id: "passos-numerados",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique num passo da lista e, pela trilha, suba até a ul. Troque ela para ol: a ordem dos passos importa.",
        toque: "Toque num passo da lista e, pela trilha, suba até a ul. Troque ela para ol: a ordem dos passos importa.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "evento", evento: "trilha" },
          { tipo: "tag", seletor: "#passos", nome: "ol" },
        ],
      },
      ajudas: {
        pergunta: "Se você trocasse a ordem desses passos, a receita ainda funcionaria igual?",
        dica: "Quando a ordem importa, use ol: ela numera os itens sozinha.",
        linha: {
          alvo: "arvore",
          seletor: "#passos",
          fala: "Essa é a lista dos passos, ainda uma ul. Dois cliques no nome da tag trocam para ol.",
        },
        solucao: {
          fala: "Troquei a ul por ol: agora os passos aparecem numerados, porque a ordem deles importa.",
          acoes: [
            { tipo: "selecionar", seletor: "#passos li" },
            { tipo: "selecionar", seletor: "#passos", via: "trilha" },
            { tipo: "renomearTag", seletor: "#passos", novaTag: "ol" },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Isso! Agora cada passo tem um número: ol é para quando a ordem importa.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: "#passos li" },
        { tipo: "selecionar", seletor: "#passos", via: "trilha" },
        { tipo: "renomearTag", seletor: "#passos", novaTag: "ol" },
      ],
    },
    {
      id: "prever-materiais",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Palpite: se a gente duplicar um item da lista de materiais e trocar o texto, ela ainda faz sentido sem números?",
        opcoes: ["Sim, a ordem dos materiais não importa", "Não, ela precisa virar ol", "Não, duplicar quebra a lista"],
        correta: 0,
        explicacao: "Materiais podem aparecer em qualquer ordem, então ul continua certo mesmo com mais itens. ol é só quando a ordem muda o sentido, como nos passos.",
      },
      enunciado: {
        mouse: "Agora confira: duplique um item da lista de materiais e escreva outro material.",
        toque: "Agora confira: duplique um item da lista de materiais e escreva outro material.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "contagem", seletor: "#materiais li", op: ">=", valor: 4 },
          { tipo: "textoDiferenteDoInicial", seletor: "#materiais li" },
          { tipo: "tag", seletor: "#materiais", nome: "ul" },
        ],
      },
      ajudas: {
        pergunta: "Duplicar funciona em qualquer elemento, até um item de lista?",
        dica: "Duplicar copia a peça com tudo dentro; edite o texto da cópia com dois cliques.",
        linha: { alvo: "arvore", seletor: "#materiais li", fala: "Essa é a lista de materiais. Duplique um item e troque o texto da cópia." },
        solucao: {
          fala: "Dupliquei um item e troquei o texto: a lista cresceu e continua fazendo sentido como ul.",
          acoes: [
            { tipo: "duplicar", seletor: "#materiais li" },
            { tipo: "definirTexto", seletor: "$0", valor: "Regador pequeno" },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Isso! ul serve numa lista assim: cresce à vontade, sem precisar de ordem.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "duplicar", seletor: "#materiais li" },
        { tipo: "definirTexto", seletor: "$0", valor: "Regador pequeno" },
      ],
    },
    {
      id: "lista-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Ache outra lista da página cuja ordem também importa, e numere ela.",
        toque: "Ache outra lista da página cuja ordem também importa, e numere ela.",
      },
      validador: { tipo: "tag", seletor: "#cuidados", nome: "ol" },
      ajudas: {
        pergunta: "Essa lista é sobre dias da semana em ordem. Isso muda algo?",
        dica: "Toda vez que a ordem dos itens muda o sentido, use ol.",
      },
      falaAoConcluir: { texto: "Perfeito! Você decidiu sozinho qual lista precisava de números.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#cuidados", novaTag: "ol" }],
    },
  ],

  conclusao: [
    { texto: "Agora você escolhe entre ul e ol olhando pro sentido: a ordem importa ou não?", expressao: "comemorando" },
    { texto: "No F12 de verdade é a mesma troca: botão direito na tag, Edit node type, e escreva ol.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de receitas de verdade, aperte F12 e veja se os ingredientes usam ul e o modo de preparo usa ol. Muitos sites erram isso!",

  falaFinal: {
    texto: "Desafio extra: ache uma lista numerada errada (deveria ser ul) num site real. Elas existem, prometo!",
    expressao: "curioso",
  },
};
