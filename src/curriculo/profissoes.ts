/*
 * Profissões: o que faz cada tipo de programador, em palavras de leigo, e
 * que temas levam até lá (com peso de 1 a 3). Responde a dúvida "o que
 * faz cada tipo de programador?" e vira uma lente no mapa, igual à de
 * tema: acende as unidades que levam até a profissão.
 *
 * Os textos são honestos de propósito: sem glamour, com o lado chato do
 * trabalho, e sem jargão sem explicação.
 */
import type { IdTema } from "./temas";

export type Profissao = {
  /** "front-end", "back-end", "full-stack", "seguranca", "dados", "devops". */
  id: string;
  nome: string;
  /** Para leigo, 2 ou 3 frases. */
  oQueFaz: string;
  /** Um exemplo concreto, 2 ou 3 frases. */
  umDiaDeTrabalho: string;
  temas: { tema: IdTema; peso: 1 | 2 | 3 }[];
};

export const PROFISSOES: readonly Profissao[] = [
  {
    id: "front-end",
    nome: "Front-end",
    oQueFaz:
      "Constrói a parte do site ou do aplicativo que a pessoa vê e usa: telas, botões, formulários. Transforma o desenho feito pelo time de design em página de verdade, que funciona no celular e no computador e que todo mundo consegue usar.",
    umDiaDeTrabalho:
      "De manhã, ajusta um formulário de cadastro que quebrava na tela pequena. À tarde, liga a página de produtos aos dados que vêm do servidor e descobre, no F12, por que uma regra de CSS não pegava. Boa parte do dia é testar em vários tamanhos de tela e corrigir detalhes.",
    temas: [
      { tema: "interfaces", peso: 3 },
      { tema: "acessibilidade", peso: 2 },
      { tema: "logica", peso: 2 },
      { tema: "desempenho", peso: 2 },
      { tema: "apis", peso: 1 },
      { tema: "ferramentas", peso: 1 },
    ],
  },
  {
    id: "back-end",
    nome: "Back-end",
    oQueFaz:
      "Cuida da parte que a pessoa não vê: o servidor que recebe os pedidos, guarda os dados e aplica as regras do negócio. Quando você faz login ou finaliza uma compra, é o código de back-end que confere, salva e responde.",
    umDiaDeTrabalho:
      "Cria o endereço (a API) que o aplicativo chama para listar os pedidos de um cliente, escreve a consulta ao banco de dados e testa o que acontece com dados errados. Depois investiga por que uma página ficou lenta e descobre uma consulta que buscava coisa demais.",
    temas: [
      { tema: "servidores", peso: 3 },
      { tema: "apis", peso: 3 },
      { tema: "dados", peso: 3 },
      { tema: "seguranca", peso: 2 },
      { tema: "logica", peso: 2 },
      { tema: "desempenho", peso: 1 },
    ],
  },
  {
    id: "full-stack",
    nome: "Full-stack",
    oQueFaz:
      "Trabalha dos dois lados: a tela e o servidor. Não precisa ser o maior especialista em cada parte, mas entende o caminho inteiro de um clique até o banco de dados e de volta. É comum em empresas pequenas e em projetos próprios.",
    umDiaDeTrabalho:
      "Recebe a tarefa de criar a página de avaliações de um produto: desenha a tela, cria a API que guarda cada avaliação e a tabela no banco. No fim do dia, publica a novidade e confere se tudo funciona no site de verdade.",
    temas: [
      { tema: "interfaces", peso: 2 },
      { tema: "apis", peso: 3 },
      { tema: "servidores", peso: 2 },
      { tema: "dados", peso: 2 },
      { tema: "logica", peso: 2 },
      { tema: "seguranca", peso: 1 },
      { tema: "ferramentas", peso: 1 },
    ],
  },
  {
    id: "seguranca",
    nome: "Segurança",
    oQueFaz:
      "Procura as brechas antes que alguém mal-intencionado ache: senhas mal guardadas, dados expostos, formulários que aceitam comandos escondidos. Também ensina o resto do time a escrever código mais seguro e responde quando algo dá errado.",
    umDiaDeTrabalho:
      "Revisa o código novo do login e aponta que uma senha ia parar no registro do servidor. Depois roda uma ferramenta que testa o site atrás de falhas conhecidas e escreve um relatório com o que precisa ser corrigido primeiro. É um trabalho de muita leitura e paciência.",
    temas: [
      { tema: "seguranca", peso: 3 },
      { tema: "servidores", peso: 2 },
      { tema: "apis", peso: 2 },
      { tema: "ferramentas", peso: 2 },
      { tema: "dados", peso: 1 },
    ],
  },
  {
    id: "dados",
    nome: "Dados",
    oQueFaz:
      "Transforma um monte de informação solta em respostas: quantas vendas vieram de cada cidade, que produto encalhou, o que muda se o preço cair. Organiza e limpa os dados, faz as contas e mostra o resultado de um jeito que outras pessoas entendam.",
    umDiaDeTrabalho:
      "Junta a planilha de vendas com os dados do site, descobre que metade das datas estava num formato diferente e arruma isso primeiro. Depois monta um gráfico para a reunião e explica o que ele mostra, e também o que ele não prova.",
    temas: [
      { tema: "dados", peso: 3 },
      { tema: "logica", peso: 2 },
      { tema: "ia", peso: 2 },
      { tema: "apis", peso: 1 },
      { tema: "desempenho", peso: 1 },
    ],
  },
  {
    id: "devops",
    nome: "DevOps",
    oQueFaz:
      "Cuida de como o código sai do computador de quem programou e chega no ar, e de como ele fica no ar. Automatiza testes e publicação, vigia os servidores e age rápido quando algo cai.",
    umDiaDeTrabalho:
      "Monta a esteira que, a cada mudança aprovada, roda os testes e publica o site sozinha. À tarde, um alerta avisa que o servidor está sem memória: acha a causa nos registros e ajusta a configuração. Às vezes o plantão cai de madrugada.",
    temas: [
      { tema: "ferramentas", peso: 3 },
      { tema: "servidores", peso: 3 },
      { tema: "seguranca", peso: 2 },
      { tema: "desempenho", peso: 2 },
    ],
  },
];

export function profissaoDoId(id: string): Profissao | undefined {
  return PROFISSOES.find((profissao) => profissao.id === id);
}
