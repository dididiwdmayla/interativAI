/*
 * S3, Fase 1: "Os mesmos dados em todo lugar" (Salão Trança Fina).
 *
 * O QUE ENSINA: o perfil da empresa no Google (a ficha que faz o negócio
 * aparecer na busca local, com mapa e lista de empresas) e a regra de
 * ouro dele: nome, endereço e telefone iguais no site, no perfil e nas
 * redes. O passo a passo do perfil mora em
 * src/conteudo/plataformas-marketing.ts (conferido em 30/09/2026); a fase
 * só diz o caminho geral e mostra o "conferido em".
 *
 * REVISA: editar texto pela árvore (U1), agora com o motivo do negócio:
 * cada número diferente é um cliente que liga para o lugar errado.
 *
 * ORDEM: 1) guiado, com previsão sobre o que a busca mostra numa busca
 * local, depois corrigir o telefone do rodapé; 2) sozinho, o endereço do
 * contato, com um número de rua trocado.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SALAO_TRANCA_FINA } from "./sites/salaoTrancaFina";

export const FASE_S3_F1: FasePratica = {
  id: "sites-ser-encontrado-u3-f1",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u3",
  titulo: "Os mesmos dados em todo lugar",
  conceitos: ["perfil-da-empresa", "nome-endereco-telefone"],
  revisa: ["editar-texto"],
  prerequisitos: ["editar-texto", "titulo-na-busca"],
  usaFerramentas: ["arvore", "editar-duplo-clique"],
  siteAlvo: SALAO_TRANCA_FINA,
  introducao: [
    { texto: "Terceira unidade da zona: o seu negócio no mapa. Quem busca \"salão perto de mim\" vê um mapa e uma lista de empresas.", expressao: "curioso" },
    { texto: "Aquilo vem do perfil da empresa no Google: a ficha do negócio, com endereço, telefone, horário, fotos e avaliações.", expressao: "pensativo" },
    { texto: "No perfil da Trança Fina, o telefone é (21) 3555-0142 e o endereço é Rua das Acácias, 45, Niterói. O site precisa dizer o mesmo.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "telefone-igual",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Alguém busca \"salão de beleza em Niterói\". Além dos sites, o que a busca costuma mostrar?",
        opcoes: ["Um mapa e uma lista de empresas (o pacote local)", "Só os sites, sem mapa", "Só anúncios pagos"],
        correta: 0,
        explicacao: "Em busca local aparece o pacote local: um mapa e uma lista de empresas. Ele vem do perfil da empresa no Google, que o dono cuida.",
      },
      enunciado: {
        mouse: "O telefone do rodapé não é o do perfil, (21) 3555-0142. Troque o texto dele, na árvore (dois cliques), para ficar igual.",
        toque: "O telefone do rodapé não é o do perfil, (21) 3555-0142. Troque o texto dele, na árvore (toque no texto), para ficar igual.",
      },
      validador: { tipo: "textoIgual", seletor: "#tel-rodape", valor: "(21) 3555-0142" },
      ajudas: {
        pergunta: "Se um cliente achar o número do rodapé e ligar, para onde vai a ligação?",
        dica: "Nome, endereço e telefone precisam ser iguais em todo lugar: site, perfil e redes. Dado diferente confunde o cliente e a busca.",
        linha: { alvo: "arvore", seletor: "#tel-rodape", parte: "texto", fala: "Este é o telefone do rodapé, com dois números trocados. Deixe igual ao do perfil." },
        solucao: {
          fala: "Troquei o telefone do rodapé pelo do perfil, (21) 3555-0142: agora o site e a ficha do Google dizem a mesma coisa.",
          acoes: [{ tipo: "definirTexto", seletor: "#tel-rodape", valor: "(21) 3555-0142" }],
        },
      },
      falaAoConcluir: { texto: "Igual ao perfil! Dados iguais em todo lugar deixam a busca segura de que é o mesmo negócio.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "definirTexto", seletor: "#tel-rodape", valor: "(21) 3555-0142" },
      ],
    },
    {
      id: "endereco-igual",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O endereço do contato também não bate com o do perfil (Rua das Acácias, 45, Niterói). Corrija o texto dele.",
        toque: "O endereço do contato também não bate com o do perfil (Rua das Acácias, 45, Niterói). Corrija o texto dele.",
      },
      validador: { tipo: "textoIgual", seletor: "#endereco-contato", valor: "Rua das Acácias, 45, Niterói" },
      ajudas: {
        pergunta: "Compare o número da rua do contato com o do perfil. Eles batem?",
        dica: "Escreva o endereço do mesmo jeito que está no perfil, letra por letra: rua, número e cidade.",
      },
      falaAoConcluir: { texto: "Endereço igual ao do perfil. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#endereco-contato", valor: "Rua das Acácias, 45, Niterói" }],
    },
  ],
  conclusao: [
    { texto: "O caminho do perfil: entrar com uma Conta Google, achar a empresa, adicionar ou reivindicar, e informar nome, categoria, endereço e contato.", expressao: "feliz" },
    { texto: "Quem atende em domicílio, sem loja, usa a área de atendimento no lugar do endereço. Passo a passo conferido em 30/09/2026.", expressao: "pensativo" },
  ],
  missaoDeCampo:
    "Busque no Google o nome de um negócio do seu bairro e olhe a ficha dele no mapa. O telefone e o endereço são os mesmos do site dele? Anote qualquer diferença.",
  falaFinal: { texto: "Próxima fase: as avaliações dos clientes.", expressao: "feliz" },
};
