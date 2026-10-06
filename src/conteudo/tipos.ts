/*
 * Formato declarativo do conteúdo do jogo.
 *
 * Tudo aqui é DADO: nenhuma função mora dentro de uma fase. O motor lê
 * estes dados e sabe validar, ajudar, roteirizar e testar sozinho.
 * Isso deixa o conteúdo seguro de produzir em massa: o TypeScript reclama
 * de campo faltando, e `npm run testar:conteudo` reclama de conteúdo que
 * não funciona (seletor que não acha nada, solução que não resolve, texto
 * grande demais, ferramenta não apresentada...).
 *
 * Guia completo de como escrever: docs/GUIA-DE-CONTEUDO.md
 * Template anotado de fase: docs/TEMPLATE-FASE.ts
 */
import type { CategoriaAuditoria, IdRegraAuditoria } from "@/motor/auditoria";
import type { DadosCampanha, MetricaCampanha } from "@/motor/campanha";
import type { Utm } from "@/motor/medicao";
import type { IdFerramenta } from "@/ferramentas/ids";
import type { TipoEvento } from "@/motor/eventos";
import type { Fala } from "@/motor/tipos";
import type { IdConceito } from "./conceitos";
import type { SintaxeJs } from "@/motor/executor/instrumentar";
import type { CasoFuncao, ValorEsperado } from "@/motor/executor/tipos";
import type { Circuito, TipoPortao } from "@/motor/circuito/modelo";
import type { ControleDepurador } from "@/motor/depurador";
import type { DadosOrdenar } from "@/motor/ordenar/modelo";
import type { DadosExposicao } from "@/motor/exposicao/modelo";
import type { LinhaEsperada, MudancaCircuito } from "@/motor/exposicao/circuitoMuseu";
import type { Linguagem } from "@/motor/linguagens/tipos";
import type { AreaTrabalho } from "@/motor/composicao";
import type { CasoExigido, DadosCasos } from "@/motor/casos/modelo";
import type { AcontecimentoCena, DadosCena, ValorCena } from "@/motor/cena/modelo";
import type { DadosContrato } from "@/motor/contrato/modelo";

export type { Fala } from "@/motor/tipos";
export type { IdConceito } from "./conceitos";
export type { IdFerramenta } from "@/ferramentas/ids";

/* ------------------------------------------------------------------ */
/* Validadores: perguntas de sim ou não sobre a página e o que o      */
/* jogador fez. Textos são comparados normalizados (sem espaços nas   */
/* pontas e com espaços repetidos virando um só).                     */
/*                                                                    */
/* Regra dos seletores: quando o seletor acha vários elementos, basta */
/* UM deles cumprir (existe, textoIgual, textoNaoVazio, atributo,     */
/* escondido, selecionado). "contagem" conta todos e                  */
/* "textoDiferenteDoInicial" compara os conjuntos de textos.          */
/* ------------------------------------------------------------------ */

/** Por onde o jogador escolheu o elemento selecionado. */
export type ViaSelecao = "arvore" | "inspecionar" | "trilha" | "editor";

export type OperadorContagem = "==" | ">=" | "<=" | ">" | "<";

export type Validador =
  /** Algum elemento casa com o seletor. */
  | { tipo: "existe"; seletor: string }
  /** Nenhum elemento casa com o seletor (foi apagado, por exemplo). */
  | { tipo: "naoExiste"; seletor: string }
  /**
   * Quantos elementos casam com o seletor, comparado com `valor`.
   * `comTexto: true` só conta os que têm algum texto (um <li></li> vazio não conta).
   */
  | { tipo: "contagem"; seletor: string; op: OperadorContagem; valor: number; comTexto?: boolean }
  /** Algum elemento do seletor tem exatamente este texto. */
  | { tipo: "textoIgual"; seletor: string; valor: string }
  /**
   * Existe texto NOVO: algum elemento do seletor tem um texto (não vazio)
   * que nenhum elemento do mesmo seletor tinha no começo da fase.
   * `minimo` pede pelo menos N textos novos e diferentes entre si (padrão 1).
   */
  | { tipo: "textoDiferenteDoInicial"; seletor: string; minimo?: number }
  /** Algum elemento do seletor tem texto (não está vazio). */
  | { tipo: "textoNaoVazio"; seletor: string }
  /** Algum elemento do seletor tem o atributo (e, se `valor` vier, com esse valor). */
  | { tipo: "atributo"; seletor: string; nome: string; valor?: string }
  /**
   * Algum elemento do seletor está escondido MANTENDO o espaço
   * (visibility: hidden, como a tecla H do F12 faz). Apagado não conta:
   * para isso use naoExiste.
   */
  | { tipo: "escondido"; seletor: string }
  /**
   * O elemento selecionado agora casa com o seletor. Se o selecionado for
   * um texto, vale o elemento dono dele. `via` exige o caminho usado.
   */
  | { tipo: "selecionado"; seletor: string; via?: ViaSelecao }
  /**
   * O evento aconteceu pelo menos `minimo` vezes (padrão 1) desde que o
   * objetivo começou. Com `evento: "clicouLink"`, `href` só conta os
   * cliques em links com esse href (ex.: "#rodape").
   */
  | { tipo: "evento"; evento: TipoEvento; minimo?: number; href?: string }
  /**
   * Algum elemento do seletor tem esta tag (em minúsculas). Renomear
   * preserva os atributos, então um seletor por id continua achando a peça
   * depois de h2 virar h4.
   */
  | { tipo: "tag"; seletor: string; nome: string }
  /**
   * (Modo documento) O título da aba do navegador, que vem do <title>:
   * igual a `valor` (sem os espaços das pontas) ou, sem `valor`, qualquer
   * título que não esteja vazio.
   */
  | { tipo: "tituloDaAba"; valor?: string }
  /*
   * Validadores de CSS: usam o motor de cascata do jogo (src/motor/css),
   * o mesmo que o painel Estilos mostra. Ver "Como escrever fases de CSS"
   * no guia.
   */
  /**
   * O valor que VENCE a cascata para a propriedade, em algum elemento do
   * seletor: a declaração vencedora, a herdada do ancestral ou a inicial.
   * Compara normalizado: cores em qualquer formato (red = #f00 =
   * rgb(255, 0, 0)), números (16.0px = 16px, 0px = 0), espaços e aspas de
   * fonte. Compara o valor DECLARADO, não os pixels calculados (2em
   * continua 2em). Atalho (margin) confere cada propriedade longa. Se o
   * motor não tem certeza, não passa (e o detalhe diz por quê). As
   * variáveis (var()) já vêm trocadas pelo valor delas.
   *
   * `larguraTela` (px, opcional) avalia as @media como numa tela dessa
   * largura (a altura vem do modelo do modo dispositivo com essa largura,
   * ou de `alturaTela`); sem ela, vale a largura atual da prévia (no
   * testar:conteudo, 1280 x 800). Para conferir o site em várias larguras,
   * use um `todos` com um validador por largura.
   */
  | { tipo: "valorEfetivo"; seletor: string; propriedade: string; valor: string; larguraTela?: number; alturaTela?: number }
  /**
   * A regra `seletorRegra` (nas folhas do site) tem a declaração da
   * propriedade. `valor` confere o valor (normalizado); `ativa: true` pede
   * ligada, `ativa: false` pede desligada (a checkbox); sem `ativa`, vale
   * de qualquer jeito.
   */
  | { tipo: "declaracao"; seletorRegra: string; propriedade: string; valor?: string; ativa?: boolean }
  /** Existe uma regra com esse seletor nas folhas do site (espaços não importam). */
  | { tipo: "regraExiste"; seletorRegra: string }
  /**
   * Em algum elemento do seletor, a declaração da propriedade que mora na
   * regra `seletorRegra` PERDE para outra (fica riscada no painel).
   * `seletorRegra: "element.style"` fala do estilo inline. Desligada não
   * conta: aqui é perder a briga. `larguraTela` e `alturaTela`: como no
   * `valorEfetivo`.
   */
  | { tipo: "riscada"; seletor: string; propriedade: string; seletorRegra: string; larguraTela?: number; alturaTela?: number }
  /**
   * (CSS) A variável `nome` (`--cor-primaria`) vale alguma coisa no
   * elemento do `seletor` (padrão `:root`, o `<html>`): declarada nele ou
   * herdada, com os var() de dentro já trocados. Com `valor`, compara (cores
   * em qualquer formato); com `diferenteDoInicial: true`, pede um valor
   * diferente do que ela tinha quando a fase abriu (bom para "troque por
   * uma cor qualquer" quando o valor inicial depende do tema do jogador).
   */
  | { tipo: "variavelCss"; nome: string; valor?: string; seletor?: string; diferenteDoInicial?: boolean }
  /**
   * (E5) O jogador salvou a maquete como "Meu tema" desde que o objetivo
   * começou (evento `temaSalvo`). Trava no checklist, como `evento`.
   */
  | { tipo: "temaSalvo" }
  /**
   * (Modo dispositivo) A barra de dispositivo está ligada, com a largura
   * do aparelho na tela (já girado) igual a `largura` e na `orientacao`,
   * quando vierem. Olha o estado de agora (não trava no checklist).
   */
  | { tipo: "dispositivo"; largura?: number; orientacao?: "retrato" | "paisagem" }
  /**
   * (Lighthouse) A nota da categoria na auditoria simplificada do jogo
   * (src/motor/auditoria.ts) é pelo menos `minimo` (0 a 100). Calcula na
   * hora, sobre a página de agora (não precisa ter clicado em Analisar).
   */
  | { tipo: "notaAuditoria"; categoria: CategoriaAuditoria; minimo: number }
  /** (Lighthouse) A verificação `regra` não acha nenhum problema na página agora. */
  | { tipo: "semProblema"; regra: IdRegraAuditoria }
  /**
   * (CSS) As folhas da página (a editável e os <style> do head) têm pelo
   * menos `minimo` (padrão 1) regras @media.
   */
  | { tipo: "temMediaQuery"; minimo?: number }
  /**
   * (Responsivo) A página cabe numa tela de `largura` px sem rolar de lado,
   * pelo motor (sem layout): tem meta viewport e, com as @media dessa
   * largura, nenhuma peça tem width ou min-width fixos (px) maiores que a
   * tela, nem colunas de grid em px que somem mais que ela. É uma
   * simplificação honesta: não mede o texto nem as margens.
   */
  | { tipo: "cabeNaTela"; largura: number }
  /*
   * Busca simulada (zona "Ser encontrado"): src/motor/busca.ts. Olham o
   * documento de agora; pedem a ferramenta do painel em usaFerramentas.
   */
  /**
   * (Resultado na busca) O título (o <title>) ou a descrição (a meta
   * description) DECLARADOS pela página: sem eles, não passa (o que a busca
   * inventa não conta). `contem` confere um trecho (sem diferenciar
   * maiúsculas); `semCorte: true` pede que caibam sem "..." no computador.
   */
  | { tipo: "resultadoBusca"; campo: "titulo" | "descricao"; contem?: string; semCorte?: boolean }
  /** (Resultado na busca) A página pode (true) ou não (false, noindex) aparecer na busca. */
  | { tipo: "indexavel"; valor: boolean }
  /**
   * (Teste de dados estruturados) Algum <script type="application/ld+json">
   * válido tem um item com o @type `tipoSchema` ("LocalBusiness" aceita os
   * subtipos conhecidos, como Bakery) e todos os `campos` preenchidos
   * (caminhos com ponto valem: "address.streetAddress").
   */
  | { tipo: "dadosEstruturados"; tipoSchema: string; campos: string[] }
  /*
   * Medição simulada e campanha (S4 e S5): src/motor/medicao.ts e
   * src/motor/campanha.ts.
   */
  /**
   * (Medição) Um clique num elemento com `data-evento="<nome>"` gerou o
   * evento desde que o objetivo começou. Trava no checklist, como `evento`.
   */
  | { tipo: "eventoMedido"; nome: string }
  /**
   * (Medição) Algum elemento do seletor (um link) tem no href os três
   * parâmetros utm_source, utm_medium e utm_campaign, com os valores de
   * `utm` (os que vierem; sem diferenciar maiúsculas).
   */
  | { tipo: "linkRastreavel"; seletor: string; utm: Partial<Utm> }
  /**
   * (Simulador de campanha) Uma métrica do dia simulado, com a página de
   * agora e a campanha configurada: cliques, clientes, custoPorCliente (R$),
   * posicao (1 = primeiro), taxaConversao (%), qualidade (1 a 10) ou
   * notaPagina (0 a 100). Só numa fase `simulador-campanha`.
   */
  | { tipo: "simulacao"; metrica: MetricaCampanha; op: OperadorContagem; valor: number }
  /*
   * Validadores de código (Ilha Lógica, fases com `programa`): olham o
   * que o executor devolveu (src/motor/executor). Ver o guia, seção 25.
   */
  /**
   * (Código) A variável global `nome` existe na memória agora e vale
   * `valor` (JSON: número, texto, booleano, null, lista ou objeto; números
   * com tolerância de arredondamento). Olha o estado de agora.
   */
  | { tipo: "valorVariavel"; nome: string; valor: ValorEsperado }
  /**
   * (Código) Alguma entrada do Console, desde que o objetivo começou,
   * RESPONDEU este valor (a linha que o Console escreve depois de uma
   * expressão, como 14 para 2 + 3 * 4). Não é o console.log: é a resposta
   * do Console. Trava no checklist.
   */
  | { tipo: "respostaDoConsole"; valor: ValorEsperado }
  /**
   * (Código) O que o console mostrou desde que o objetivo começou. `contem`:
   * alguma linha tem esse trecho. `igual`: numa mesma execução, as linhas
   * foram exatamente estas, em ordem (o texto como o Console mostra:
   * console.log('oi', 1) vira "oi 1"). Trava no checklist, como `evento`.
   */
  | { tipo: "saida"; contem?: string; igual?: string[] }
  /** (Código) Rodou alguma coisa desde que o objetivo começou e a última execução não deu erro. Trava no checklist. */
  | { tipo: "semErro" }
  /**
   * (Código) Alguma execução desde que o objetivo começou terminou com um
   * erro deste tipo ("ReferenceError", "TypeError", "SyntaxError"...). Para
   * fases que ensinam a LER o erro. Trava no checklist.
   */
  | { tipo: "erroDoTipo"; nome: string }
  /**
   * (Código) O código que o jogador RODOU desde que o objetivo começou usa
   * a sintaxe (lida da árvore do código, não do texto: "if" dentro de aspas
   * não conta): if, else, for, for-of, while, funcao, arrow, template,
   * return, let, const, e-logico, ou-logico, nao-logico, igualdade-estrita,
   * console-log, metodo:push... (lista em src/motor/executor/instrumentar.ts).
   * Trava no checklist.
   */
  | { tipo: "usouSintaxe"; sintaxe: SintaxeJs }
  /**
   * (Código) A função global `nome` do jogador, chamada com os `args` de
   * cada caso, DEVOLVE (return) o `esperado`. É o jeito certo de validar
   * uma função: console.log no lugar do return não passa. Olha o estado de
   * agora (roda de novo a cada execução).
   */
  | { tipo: "funcaoPassa"; nome: string; casos: CasoFuncao[] }
  /*
   * Circuito lógico (fase do tipo circuito-logico): src/motor/circuito.
   */
  /**
   * (Circuito) O circuito do jogador produz esta tabela verdade, do jeito
   * que ele montou (o validador simula todas as combinações das entradas).
   * `entradas` pelo nome no código (temCliente); `saida` é o valor da saída
   * (com mais de uma saída, um objeto { nomeDaSaida: valor }). Linhas que
   * não aparecem não são conferidas.
   */
  | { tipo: "circuitoTabela"; esperado: { entradas: Record<string, boolean>; saida: boolean | Record<string, boolean> }[] }
  /** (Circuito) Pelo menos `minimo` (padrão 1) portões desse tipo com a saída ligada em alguma coisa. */
  | { tipo: "usouPortao"; portao: TipoPortao; minimo?: number }
  /*
   * Depurador da aba Fontes (fase com programa.snippet e alguma ferramenta
   * do depurador): src/motor/depurador.ts. Ver o guia, seção 26.
   */
  /** (Depurador) Tem um ponto de parada nesta linha do Snippet (a partir de 1) agora. Olha o estado de agora. */
  | { tipo: "pontoDeParada"; linha: number }
  /**
   * (Depurador) O depurador pausou nesta linha desde que o objetivo começou
   * (ponto de parada, `debugger;` ou um controle). Trava no checklist.
   */
  | { tipo: "pausouNaLinha"; linha: number }
  /**
   * (Depurador) A expressão está no painel Observar (espaços não contam).
   * Com `valor`, ela mostrou esse valor num momento pausado desde que o
   * objetivo começou (trava, como `evento`).
   */
  | { tipo: "observou"; expressao: string; valor?: ValorEsperado }
  /**
   * (Depurador) Usou o controle (retomar, passar-por-cima, entrar, sair)
   * pelo menos `minimo` vezes (padrão 1) desde que o objetivo começou. Trava.
   */
  | { tipo: "usouControle"; controle: ControleDepurador; minimo?: number }
  /*
   * Ordenar passos (fase do tipo ordenar-passos): src/motor/ordenar/modelo.ts.
   * Olham o quadro de agora (desfazer desmarca a parte de um desafio).
   */
  /**
   * (Ordenar) O plano vale: todos os passos necessários estão nele, nenhum
   * que sobra, cada subpasso no seu passo grande (agrupar) e cada passo
   * depois dos que ele depende. QUALQUER ordem que respeite as dependências
   * passa (não existe uma ordem decorada).
   */
  | { tipo: "ordemValida" }
  /** (Ordenar) O cartão está no plano (em qualquer posição; no agrupar, com `grupo`, dentro desse passo grande). */
  | { tipo: "passoNoPlano"; passo: string; grupo?: string }
  /** (Ordenar) Os dois cartões estão no plano e `passo` vem antes de `antesDe`. */
  | { tipo: "passoAntes"; passo: string; antesDe: string }
  /** (Ordenar) Nenhum cartão que sobra (distração) está no plano. */
  | { tipo: "semSobras" }
  /**
   * (Fase composta, áreas plano e snippet) O plano está no código como
   * comentários, na ordem certa pelas dependências: os comentários de linha
   * inteira que batem com o texto dos cartões (o "Levar o plano pro código"
   * escreve assim), lidos na ordem do código, formam um plano que vale (os
   * passos todos, nenhum que sobra, cada um depois do que ele precisa). É o
   * que garante, no desafio, que o aluno planejou. Olha o código de agora.
   */
  | { tipo: "planoComentado" }
  /**
   * (Fase composta, área testes) O aluno escreveu pelo menos `minimo` casos
   * de teste que dá para ler (entrada e saída esperada), incluindo os casos
   * de borda que o conteúdo exige (`incluir`: pelos argumentos, pela saída
   * esperada, ou pelos dois; `rotulo` diz como ele aparece no detalhe, como
   * "a lista vazia"). Com `passando: true`, só contam os casos que passaram
   * na última vez que os casos rodaram (junto com um `funcaoPassa`, isso
   * prova que as saídas que o aluno escreveu estão certas). Olha os casos de
   * agora.
   */
  | { tipo: "casosDoAluno"; minimo: number; incluir?: CasoExigido[]; passando?: boolean }
  /*
   * Exposições do museu (área exposicao): src/motor/exposicao/modelo.ts.
   * Olham a exposição de agora (desfazer a mudança desmarca a parte de um
   * desafio). `estacao` é o id da estação.
   */
  /** (Exposição, tear) O tecido está igual ao desenho pedido (cada furo no lugar). Com `linhas`, só esses cartões (a partir de 0). */
  | { tipo: "tecidoIgual"; estacao: string; linhas?: number[] }
  /** (Exposição, bits) As lâmpadas mostram este número. */
  | { tipo: "bitsValem"; estacao: string; valor: number }
  /** (Exposição, camadas) A camada já foi aberta (o aluno desceu até ela). */
  | { tipo: "camadaAberta"; estacao: string; camada: string }
  /** (Exposição, camadas) A linha escolhida agora é esta (ou, com `ou`, uma destas). */
  | { tipo: "linhaEscolhida"; estacao: string; linha: string; ou?: string[] }
  /**
   * (Exposição, cor) A cor montada é `valor` (hexadecimal, maiúscula ou
   * minúscula, com 3 ou 6 dígitos) ou, com `canais`, cada canal (de 0 a
   * 255) dentro da faixa pedida: `{ r: [200, 255], g: [0, 60] }`.
   */
  | { tipo: "corHex"; estacao: string; valor?: string; canais?: Partial<Record<"r" | "g" | "b", [number, number]>> }
  /** (Exposição, linha do tempo) Os eventos (todos, sem a lista) estão na linha, na ordem certa entre eles. */
  | { tipo: "linhaEmOrdem"; estacao: string; eventos?: string[] }
  /** (Exposição, linha do tempo com plaquinhas) Cada plaquinha do "o que mudou" está no cartão certo. Com `eventos`, só nesses cartões. */
  | { tipo: "plaquinhasCertas"; estacao: string; eventos?: string[] }
  /*
   * Salas 3 a 6 (rodada 38). Os validadores de saída (saida, semErro,
   * erroDoTipo) também valem no comparador: rodar JavaScript ou Python gera
   * executouCodigo com a saída de verdade (as simuladas, com a declarada).
   */
  /** (Comparador) Estas linguagens (sem a lista: todas) já rodaram. */
  | { tipo: "linguagensRodadas"; estacao: string; linguagens?: Linguagem[] }
  /** (Comparador) A parte acesa agora é esta (com `linguagens`: tocada numa destas). */
  | { tipo: "parteVista"; estacao: string; parte: string; linguagens?: Linguagem[] }
  /** (Ligar) Os cartões (sem a lista: todos) estão no alvo certo. */
  | { tipo: "cartoesLigados"; estacao: string; cartoes?: string[] }
  /** (Ordem) Os itens (sem a lista: todos) estão na fila, na ordem certa entre eles. */
  | { tipo: "ordemCerta"; estacao: string; itens?: string[] }
  /**
   * (Circuito do museu) O circuito dá a tabela `esperado` (só as saídas
   * citadas) e, com `agora`, as chaves e as lâmpadas de agora batem.
   */
  | { tipo: "circuitoNaEstacao"; estacao: string; esperado?: LinhaEsperada[]; agora?: { entradas: Record<string, boolean>; saidas: Record<string, boolean> } }
  /** (Circuito do museu) A memória com realimentação: `liga` acende a `saida` e ela fica acesa sozinha; `desliga` apaga. */
  | { tipo: "circuitoLembra"; estacao: string; saida: string; liga: string; desliga: string }
  /** (Simulação do museu) A estação tem este marco agora (cada tipo diz os seus: src/motor/exposicao/simulacoes). */
  | { tipo: "marcoNaEstacao"; estacao: string; marco: string }
  /*
   * Estruturas e desempenho (fase de programa): src/motor/estruturas.ts e
   * src/motor/desempenho.ts. Ver o guia, seção 28.
   */
  /**
   * (Desempenho) Sem `tamanho`: a última execução desde que o objetivo
   * começou deu no máximo `valor` passos (trava). Com `tamanho`: a função
   * (`funcao`, padrão a primeira de `programa.desempenho.funcoes`), rodando
   * com uma lista desse tamanho, dá no máximo `valor` passos (medida de
   * novo a cada execução, como o funcaoPassa). Conta o total: os passos do
   * código e os escondidos dos métodos nativos (shift, includes...: guia,
   * seção 28.1); `contarEscondidos: false` conta só os do código.
   */
  | { tipo: "passosNoMaximo"; valor: number; tamanho?: number; funcao?: string; contarEscondidos?: boolean }
  /**
   * (Estruturas) A variável global `nome` foi usada como pilha (entra e sai
   * pelo mesmo lado: push e pop) ou como fila (entra por um lado e sai pelo
   * outro: push e shift) desde que o objetivo começou (trava); ou é uma
   * árvore agora (um objeto com filhos objetos).
   */
  | { tipo: "formaDaEstrutura"; nome: string; forma: "pilha" | "fila" | "arvore" }
  /*
   * Cenas programáveis (área cena): src/motor/cena. Olham a simulação de
   * agora (desde o último Executar); não travam. Ver o guia, seção 30.
   */
  /**
   * (Cena) O dispositivo (o id dele na cena) tem a `propriedade` igual a
   * `valor` no instante `noTempo` (ms desde o começo da cena; sem ele, no
   * fim). Ex.: a lâmpada acesa no fim, o portão aberto no segundo 4.
   */
  | { tipo: "estadoNaCena"; dispositivo: string; propriedade: string; valor: ValorCena; noTempo?: number }
  /**
   * (Cena) O dispositivo fez esta sequência de ações, uma depois da outra
   * (só mudanças de verdade: ligar o que já está ligado não conta). `aposMs`
   * é o tempo desde a ação anterior (na primeira, desde o começo da cena),
   * com folga de `toleranciaMs` (padrão 100). Com `exata`, ele não fez
   * nenhuma outra dessas ações (piscou 3 vezes, e não 4).
   */
  | { tipo: "sequenciaNaCena"; dispositivo: string; eventos: { acao: string; aposMs?: number; toleranciaMs?: number }[]; exata?: boolean }
  /**
   * (Cena) Toda vez que `quando` acontece (a propriedade do dispositivo
   * passa a valer `valor`: o sensor vê gente), `entao` acontece em até
   * `prazoMs` (a luz faz "ligar"). É como se prova um loop de controle.
   */
  | {
      tipo: "reagiu";
      quando: { dispositivo: string; propriedade: string; valor: ValorCena };
      entao: { dispositivo: string; acao: string };
      prazoMs: number;
    }
  /**
   * (Cena) O código passa no `validador` (de cena) com cada uma destas
   * linhas do tempo: ele roda de novo com cada uma a cada Executar, como os
   * casos escondidos do funcaoPassa. Assim o aluno não programa "decorado"
   * pro horário exato em que a pessoa chega.
   */
  | {
      tipo: "variosCenarios";
      linhasDoTempo: AcontecimentoCena[][];
      validador: Validador;
      /**
       * (Opcional) Um validador de cena a mais para cada linha do tempo, na
       * mesma ordem: o que muda de um dia para o outro (quantas pessoas
       * passaram, quando a luz apaga). Vale junto com `validador`.
       */
      porLinha?: Validador[];
    }
  | { tipo: "todos"; validadores: Validador[] }
  | { tipo: "algum"; validadores: Validador[] }
  | { tipo: "nao"; validador: Validador }
  /**
   * Raro: validação escrita em código, registrada em
   * src/conteudo/validadoresCustom.ts com um comentário explicando por que
   * nenhum validador declarativo serve. Veja o guia antes de usar.
   */
  | { tipo: "custom"; id: string };

/* ------------------------------------------------------------------ */
/* Ações: o que o jogador faz, escrito como dado. Servem para a       */
/* solução do "Me ajuda", para os eventos roteirizados e para os      */
/* testes. O executor chama as MESMAS funções que a interface chama   */
/* quando o jogador faz a ação à mão.                                 */
/*                                                                    */
/* Seletores de ação usam o primeiro elemento que casar. "$0" é o     */
/* elemento selecionado (igual ao $0 do F12) e "$0 h3" é um h3 dentro */
/* dele. Com via "trilha", o seletor escolhe o ancestral mais próximo */
/* do selecionado, como a trilha de verdade.                          */
/* ------------------------------------------------------------------ */

export type PosicaoInsercao = "antes" | "depois" | "inicio" | "fim";

export type Acao =
  /** Seleciona o elemento (padrão: pela árvore). */
  | { tipo: "selecionar"; seletor: string; via?: ViaSelecao }
  /** Troca o texto, como os dois cliques na árvore (seleciona o elemento antes). */
  | { tipo: "definirTexto"; seletor: string; valor: string }
  /** Troca o valor de um atributo pela árvore (seleciona o elemento antes). */
  | { tipo: "definirAtributo"; seletor: string; nome: string; valor: string }
  /**
   * Cria um atributo novo pelo menu do nó ("Adicionar atributo", como o
   * Chrome). Se o elemento já tem o atributo, o valor é trocado.
   */
  | { tipo: "adicionarAtributo"; seletor: string; nome: string; valor: string }
  /** Esconde mantendo o espaço, como a tecla H (seleciona o elemento antes). */
  | { tipo: "esconder"; seletor: string }
  /** Apaga o elemento, como a tecla Delete (seleciona o elemento antes). */
  | { tipo: "apagar"; seletor: string }
  /** Duplica o elemento logo depois dele; a cópia fica selecionada. */
  | { tipo: "duplicar"; seletor: string }
  /** Troca o nome da tag pela árvore (dois cliques no nome); atributos e filhos ficam. */
  | { tipo: "renomearTag"; seletor: string; novaTag: string }
  /** Clica num link da prévia (a prévia não navega; ver src/lib/linksPrevia.ts). */
  | { tipo: "clicarLink"; seletor: string }
  /** Desfaz a última mudança feita pelo painel. */
  | { tipo: "desfazer" }
  /** Escreve HTML novo perto de um elemento (o que o jogador faria no editor de código). */
  | { tipo: "inserirHTML"; seletor: string; posicao: PosicaoInsercao; html: string }
  /** Responde o card de previsão (índice a partir de 0). */
  | { tipo: "responderPrevisao"; opcao: number }
  /**
   * Define uma propriedade numa regra, como a edição do painel Estilos: se
   * a regra já tem a propriedade ligada, troca o valor; se não, acrescenta.
   */
  | { tipo: "definirPropriedade"; seletorRegra: string; propriedade: string; valor: string }
  /** Liga ou desliga (a checkbox) a declaração da propriedade na regra. */
  | { tipo: "alternarDeclaracao"; seletorRegra: string; propriedade: string }
  /** Cria uma regra nova no fim da folha (o botão de regra nova do painel Estilos). */
  | { tipo: "adicionarRegra"; seletorRegra: string; declaracoes?: { propriedade: string; valor: string }[] }
  /** Escreve CSS no começo ou no fim da folha (o que o jogador digitaria no editor CSS). */
  | { tipo: "editarCss"; posicao: "inicio" | "fim"; texto: string }
  /**
   * (E5) "Salvar como Meu tema": guarda as cores da maquete do jogo como o
   * quarto tema. Nos testes e no lab, salva direto (sem a conversa sobre
   * contraste). Gera `temaSalvo`.
   */
  | { tipo: "salvarTema" }
  /**
   * (Modo dispositivo) Liga a barra de dispositivo (se estava desligada) e
   * escolhe um modelo pronto, ou `"livre"` com a `largura` (como arrastar
   * as bordas). Gera `trocouDispositivo`.
   */
  | { tipo: "trocarDispositivo"; modelo: "celular-360" | "celular-390" | "tablet-768" | "notebook-1280" | "livre"; largura?: number }
  /** (Modo dispositivo) O botão de girar: em pé vira deitado e vice-versa. Gera `girou`. */
  | { tipo: "girarDispositivo" }
  /** (Modo dispositivo) Desliga a barra (Ctrl+Shift+M de novo). Gera `trocouDispositivo` com `ligado: false`. */
  | { tipo: "desligarDispositivo" }
  /** (Lighthouse) O botão Analisar do painel Lighthouse. Gera `auditou`, com as notas. */
  | { tipo: "analisarAuditoria" }
  /**
   * (Publicar) O "Levar pro mundo": monta o index.html e o style.css e baixa
   * o .zip (nos testes, só monta). Gera `exportouProjeto`.
   */
  | { tipo: "levarProMundo" }
  /**
   * (Medição) Clica num elemento da prévia, como o jogador clicaria. Um
   * `data-evento` nele (ou num ancestral) gera `eventoMedido`; num link, a
   * prévia segura a navegação como sempre. Pede a ferramenta medicao.
   */
  | { tipo: "clicarNaPrevia"; seletor: string }
  /**
   * (Medição) "Simular uma visita por este link", no construtor de link
   * rastreável: as próximas medições contam com essa origem. Gera
   * `visitaSimulada`. Pede a ferramenta link-rastreavel.
   */
  | { tipo: "simularVisita"; utm: Utm }
  /**
   * (Simulador de campanha) Muda o orçamento do dia (R$), a palavra-chave
   * (o id) ou o lance máximo por clique (R$). Gera `configurouCampanha`.
   */
  | { tipo: "configurarCampanha"; orcamento?: number; palavraChave?: string; lance?: number }
  /**
   * (Código) Digita no Console e aperta Enter: roda como uma entrada do
   * Console (a resposta, as saídas e o erro aparecem lá). Gera
   * `executouCodigo`. Pede a ferramenta console.
   */
  | { tipo: "executarNoConsole"; codigo: string }
  /** (Código) Troca o texto do Snippet (aba Fontes), sem rodar. Pede a ferramenta snippet. */
  | { tipo: "definirSnippet"; codigo: string }
  /** (Código) O botão Executar do Snippet (Ctrl+Enter). Gera `executouCodigo`. Pede a ferramenta snippet. */
  | { tipo: "executarSnippet" }
  /** (Circuito) Tira um portão da paleta e põe na bancada, com o id dado (as ações seguintes usam o id). */
  | { tipo: "adicionarPortao"; portao: TipoPortao; id: string; x?: number; y?: number }
  /** (Circuito) Liga a saída da peça `de` na porta `porta` (padrão 0) da peça `para`. */
  | { tipo: "ligarFio"; de: string; para: string; porta?: number }
  /** (Circuito) Liga ou desliga uma entrada (sem `ligada`, troca). */
  | { tipo: "alternarEntrada"; entrada: string; ligada?: boolean }
  /** (Circuito) Tira uma peça da bancada (a que veio pronta na fase não sai). */
  | { tipo: "apagarPeca"; id: string }
  /** (Circuito) O botão "Ver como código". */
  | { tipo: "verComoCodigo" }
  /**
   * (Depurador) Clica no número da linha do Snippet: liga ou desliga o ponto
   * de parada (numa linha sem código, ele escorrega para a próxima, como no
   * Chrome). Gera `alternouPontoDeParada`. Pede a ferramenta pontos-de-parada.
   */
  | { tipo: "alternarPontoDeParada"; linha: number }
  /**
   * (Depurador) Um controle com o programa pausado: retomar (F8),
   * passar-por-cima (F10), entrar (F11) ou sair (Shift+F11). Gera
   * `usouControleDepurador` e `pausouNoDepurador` (ou, se o programa
   * terminou, `executouCodigo`). Pede a ferramenta controles-depurador.
   */
  | { tipo: "controlarDepurador"; controle: ControleDepurador }
  /**
   * (Depurador) Põe a expressão no painel Observar. Gera `adicionouObservacao`
   * e, se estiver pausado, `observouValor`. Pede a ferramenta painel-observar.
   */
  | { tipo: "observar"; expressao: string }
  /**
   * (Ordenar) Arrasta o cartão para o plano (ou, no agrupar, para o passo
   * grande `grupo`), na `posicao` (a partir de 0; padrão: no fim). Se ele já
   * está no plano, muda de lugar. Gera `moveuPasso`. Pede quadro-de-passos.
   */
  | { tipo: "porPasso"; passo: string; posicao?: number; grupo?: string }
  /** (Ordenar) Tira o cartão do plano (volta para a pilha). Gera `moveuPasso`. */
  | { tipo: "tirarPasso"; passo: string }
  /** (Ordenar, com `rodar`) O botão Rodar: executa o código do plano, na ordem. Gera `executouCodigo`. */
  | { tipo: "rodarPlano" }
  /**
   * (Fase composta, área plano) O botão "Levar o plano pro código": escreve
   * os passos do plano, na ordem do aluno, como comentários numerados no
   * topo do Snippet (ou atualiza o bloco que já está lá), sem apagar o
   * código. Gera `levouPlanoProCodigo`. Pede plano-no-codigo.
   */
  | { tipo: "levarPlanoProCodigo" }
  /**
   * (Fase composta, área plano) Toca no cartão do plano: se o passo já está no
   * código como comentário, a linha dele acende no Snippet. Gera
   * `apontouPasso`. Pede quadro-de-passos.
   */
  | { tipo: "verPassoNoCodigo"; passo: string }
  /**
   * (Fase composta, área testes) Escreve um caso novo, como o aluno digita:
   * a entrada como os argumentos de uma chamada ("[8, 6]", "10, 7") e a saída
   * esperada ("7"). Gera `editouCasos`. Pede casos-de-teste.
   */
  | { tipo: "escreverCaso"; entrada: string; esperado: string }
  /** (Área testes) Apaga o caso da posição `indice` (a partir de 0). Gera `editouCasos`. Pede casos-de-teste. */
  | { tipo: "apagarCaso"; indice: number }
  /**
   * (Área testes) O botão "Rodar os casos": roda o código do Snippet e chama
   * a função com cada caso. Gera `executouCodigo` e `rodouCasos`. Pede casos-de-teste.
   */
  | { tipo: "rodarCasos" }
  /** (Estruturas) O botão "Ver como árvore" da caixinha da variável global `nome`. Gera `viuComoArvore`. Pede arvore-palco. */
  | { tipo: "verComoArvore"; nome: string }
  /** (Desempenho) O botão Medir da aba Desempenho (o gráfico passos x tamanho). Gera `mediuDesempenho`. Pede grafico-passos. */
  | { tipo: "medirDesempenho" }
  /** (Área cena) Toca no dispositivo `dispositivo` (o id dele na cena) e abre a ficha. Gera `abriuFicha`. Pede ficha-dispositivo. */
  | { tipo: "abrirFicha"; dispositivo: string }
  /** (Área cena) O botão "Por dentro" da ficha do dispositivo. Gera `viuPorDentro`. Pede ficha-dispositivo. */
  | { tipo: "verPorDentro"; dispositivo: string }
  /** (Área cena) Escolhe a velocidade da simulação (1x, 2x ou 4x). Gera `mudouVelocidade`. Pede velocidade-simulacao. */
  | { tipo: "velocidadeCena"; velocidade: 1 | 2 | 4 }
  /*
   * Exposições do museu (área exposicao). Cada uma pede a ferramenta da
   * estação (tear-de-cartoes, lampadas-de-bits, camadas-da-maquina,
   * mesa-de-cores, linha-do-tempo-museu) e gera `mexeuNaExposicao`.
   */
  /** (Exposição) Abre a estação (no desafio, as estações ficam em abas). */
  | { tipo: "abrirEstacao"; estacao: string }
  /** (Tear) Fura (ou tapa) o furo `coluna` do cartão `linha` (a partir de 0). Sem `furado`, alterna. */
  | { tipo: "furarCartao"; estacao: string; linha: number; coluna: number; furado?: boolean }
  /** (Bits) Liga ou desliga a lâmpada `indice` (0 é a da esquerda, a de maior peso). Sem `ligado`, alterna. */
  | { tipo: "alternarBit"; estacao: string; indice: number; ligado?: boolean }
  /** (Camadas) O botão "Descer uma camada": traduz para a camada de baixo. */
  | { tipo: "descerCamada"; estacao: string }
  /** (Camadas) Toca numa linha de uma camada aberta: ela e as ligadas acendem. */
  | { tipo: "escolherLinha"; estacao: string; linha: string }
  /** (Cor) A cor da mesa de cores, em hexadecimal (os botões dos dígitos chegam no mesmo lugar). */
  | { tipo: "definirCor"; estacao: string; valor: string }
  /** (Linha do tempo) Põe (ou muda de lugar) o cartão na linha, na `posicao` (a partir de 0; padrão: no fim). */
  | { tipo: "porNaLinha"; estacao: string; evento: string; posicao?: number }
  /** (Linha do tempo) Tira o cartão da linha (volta para a caixa). */
  | { tipo: "tirarDaLinha"; estacao: string; evento: string }
  /** (Linha do tempo com plaquinhas) Pendura a plaquinha do "o que mudou" do evento `plaquinha` no cartão `evento`. */
  | { tipo: "pendurarPlaquinha"; estacao: string; evento: string; plaquinha: string }
  /*
   * Salas 3 a 6 (rodada 38): comparador-de-linguagens, cartoes-de-ligar,
   * ordem-dos-cartoes, painel-de-cabos e uma ferramenta por simulação.
   */
  /**
   * (Comparador) O Rodar de uma linguagem: JavaScript e Python rodam de
   * verdade, as outras mostram a saída declarada. Gera executouCodigo (com a
   * saída) e mexeuNaExposicao quando termina.
   */
  | { tipo: "rodarLinguagem"; estacao: string; linguagem: Linguagem }
  /** (Comparador) O coral: todas as linguagens cantam o programa, na voz da época. */
  | { tipo: "cantarCoral"; estacao: string }
  /** (Comparador) Toca numa linha da parte `parte` na linguagem dada: a parte acende em todas (null apaga). */
  | { tipo: "tocarParte"; estacao: string; parte: string | null; linguagem: Linguagem }
  /** (Comparador) Escreve o código da linguagem editável. */
  | { tipo: "escreverNaLinguagem"; estacao: string; linguagem: Linguagem; codigo: string }
  /** (Ligar) Põe o cartão no alvo (null: devolve para a mesa). */
  | { tipo: "ligarCartao"; estacao: string; cartao: string; alvo: string | null }
  /** (Ordem) Põe (ou muda de lugar) o item na fila, na `posicao` (a partir de 0; padrão: no fim). */
  | { tipo: "porNaOrdem"; estacao: string; item: string; posicao?: number }
  /** (Ordem) Tira o item da fila. */
  | { tipo: "tirarDaOrdem"; estacao: string; item: string }
  /** (Circuito do museu) Uma mudança no circuito: portão, fio, soltar, chave, apagar ou mover. */
  | { tipo: "mexerNoCircuito"; estacao: string; mudanca: MudancaCircuito }
  /** (Simulação do museu) Um comando ("passo", "vez:musica", "pular:roteador-1"; cada tipo diz os seus). */
  | { tipo: "comandoNaEstacao"; estacao: string; comando: string };

/* ------------------------------------------------------------------ */
/* Objetivos                                                          */
/* ------------------------------------------------------------------ */

/** Degrau 3 da escada de ajuda: mostra ONDE olhar. */
export type AjudaLinha =
  /** Pisca um nó da árvore (ou só o texto dele, com parte: "texto"). */
  | { alvo: "arvore"; seletor: string; parte?: "no" | "texto"; fala: string }
  /** Pisca no editor as linhas de todos os elementos do seletor. */
  | { alvo: "editor"; seletor: string; fala: string }
  /** Pisca o botão ou a área de uma ferramenta (a setinha, a trilha...). */
  | { alvo: "ferramenta"; ferramenta: IdFerramenta; fala: string }
  /** Pisca no editor CSS as linhas da regra (e, com `propriedade`, só a declaração). */
  | { alvo: "css"; seletorRegra: string; propriedade?: string; fala: string }
  /** Pisca a regra no painel Estilos (e, com `propriedade`, só a declaração). */
  | { alvo: "estilos"; seletorRegra: string; propriedade?: string; fala: string }
  /** (Código) Pisca linhas do Snippet (a partir de 1). */
  | { alvo: "snippet"; linhas: number[]; fala: string }
  /** (Código) Pisca a linha de digitar do Console. */
  | { alvo: "console"; fala: string }
  /** (Circuito) Pisca uma peça da bancada (ou, sem `peca`, a paleta de portões). */
  | { alvo: "circuito"; peca?: string; fala: string }
  /** (Ordenar) Pisca um cartão (onde ele estiver) ou, sem `passo`, o plano. */
  | { alvo: "ordenar"; passo?: string; fala: string }
  /** (Exposição) Pisca a estação (ou, com `peca`, uma peça dela: "1-3" é o furo da linha 1, coluna 3; "2" a lâmpada 2; o id de uma linha da camada ou de um cartão; "descer"; "r", "g" ou "b" na cor). */
  | { alvo: "exposicao"; estacao: string; peca?: string; fala: string };

/** Degrau 4: a solução aplicada na frente do jogador (custa 1 estrela). */
export type SolucaoAjuda = {
  /** Explica O QUE foi feito e POR QUÊ. */
  fala: string;
  acoes: Acao[];
};

/** Guiado: ajuda completa, os 4 degraus. */
export type AjudasGuiado = {
  /** Degrau 1: pergunta socrática, que faz pensar e não entrega. */
  pergunta: string;
  /** Degrau 2: o conceito. */
  dica: string;
  linha: AjudaLinha;
  solucao: SolucaoAjuda;
};

/** Sozinho: ajuda limitada, só os degraus 1 e 2. */
export type AjudasSozinho = {
  pergunta: string;
  dica: string;
};

/** Momento roteirizado (ex.: o computadorzinho esbarra e apaga algo). */
export type EventoRoteirizado = {
  acoes: Acao[];
  /** Fala mostrada depois das ações. */
  fala?: Fala;
  /** Animação do computadorzinho antes das ações. */
  animacao?: "esbarrao";
};

export type Previsao = {
  pergunta: string;
  /** 2 a 4 opções curtas. */
  opcoes: string[];
  /** Índice da certa (a partir de 0). */
  correta: number;
  /** Mostrada depois da resposta, certa ou errada. */
  explicacao: string;
};

type ObjetivoBase = {
  /** Único dentro da fase, kebab-case. */
  id: string;
  /** Até 140 caracteres cada. `toque` troca "clique" por "toque" e afins. */
  enunciado: { mouse: string; toque: string };
  /** Quando passa, o objetivo está cumprido (numa previsão: depois de responder). */
  validador: Validador;
  /** Ferramentas apresentadas quando este objetivo começa. */
  apresentar?: IdFerramenta[];
  /** Momento roteirizado que roda quando o objetivo começa. */
  eventoAoComecar?: EventoRoteirizado;
  falaAoConcluir: Fala;
  /**
   * Obrigatória: ações que cumprem o objetivo, usadas pelos testes e pelo
   * /lab/fases. Num objetivo de previsão, comece com responderPrevisao.
   */
  solucaoDeTeste: Acao[];
  /**
   * Opcional (precisão futura da Revisão do dia): os conceitos que ESTE
   * objetivo ensina ou treina. Hoje a revisão usa os conceitos da fase e a
   * ajuda registrada por fase (as estrelas) como aproximação; com este
   * campo, um dia dá para agendar por objetivo. Não muda nenhum id.
   */
  conceitos?: IdConceito[];
};

type ObjetivoPorModo =
  | { modo: "guiado"; ajudas: AjudasGuiado }
  | { modo: "sozinho"; ajudas: AjudasSozinho };

type ObjetivoPorTipo =
  /** Fazer algo na página. */
  | { tipo: "acao" }
  /** Primeiro prever (card com opções), depois fazer e ver acontecer. */
  | { tipo: "previsao"; previsao: Previsao };

export type Objetivo = ObjetivoBase & ObjetivoPorModo & ObjetivoPorTipo;

export type ModoObjetivo = Objetivo["modo"];

/* ------------------------------------------------------------------ */
/* Fases                                                              */
/* ------------------------------------------------------------------ */

/**
 * O site de outra pessoa que o jogador vai mexer. Única exceção à regra
 * das cores: o CSS dele tem cores próprias. Mora em `sites/` da unidade.
 */
export type SiteAlvo = {
  /**
   * Opcional. `"jogo"`: o site-alvo é uma maquete do PRÓPRIO jogo (E5),
   * pintada só com as variáveis `--cor-*` do tema. Use o objeto pronto
   * `SITE_ALVO_DO_JOGO` (src/motor/siteDoJogo.ts), sem `css`: a folha
   * editável (um `:root` com os tokens reais do tema do jogador) é montada
   * quando a fase abre. Nos testes, com o tema Doce.
   */
  tipo?: "jogo";
  /** Endereço de mentirinha mostrado na barra do navegador. */
  url: string;
  /** Título acessível do iframe. */
  titulo: string;
  /**
   * <head> fixo (estilos). Não aparece no editor. Numa fase com
   * `modoDocumento`, é o head INICIAL, editável como o resto.
   */
  head: string;
  /** <body> inicial: é o que aparece na árvore e no editor. */
  body: string;
  /**
   * Opcional: a folha de estilo EDITÁVEL do site (a aba CSS do editor e o
   * painel Estilos mexem nela; no painel ela se chama "estilo.css"). Vai
   * num <style data-folha-jogo> depois do head. Sem ela, a fase funciona
   * como sempre (só o head fixo).
   */
  css?: string;
};

/** A bancada de uma fase de programa (Console, Snippet e palco da memória). */
export type BancadaPrograma = {
  /**
   * O Snippet (Fontes > Snippets, no Chrome): um editor de programas maiores
   * com Executar. Sem o campo, a fase só tem o Console. `codigoInicial`: o
   * que já vem escrito (pode ser vazio).
   */
  snippet?: { codigoInicial: string; nome?: string };
  /**
   * Código que roda quietinho quando a fase abre (sem aparecer no Console),
   * para a memória já começar com algo (ex.: a lista de preços do desafio).
   */
  preparo?: string;
  /**
   * (Desempenho) O gráfico passos x tamanho da aba Desempenho: as funções
   * globais do jogador medidas (até 2, uma linha cada), com os argumentos
   * ("$lista" vira a lista do tamanho; "$tamanho", o número; padrão
   * ["$lista"]), os tamanhos (padrão 10, 100, 500 e 1000) e como a lista é
   * gerada (padrão crescente: 1, 2, 3...). Pede a ferramenta grafico-passos.
   */
  desempenho?: {
    funcoes: { nome: string; args?: ValorEsperado[] }[];
    tamanhos?: number[];
    lista?: "crescente" | "decrescente" | "embaralhada";
  };
};

/** Sub-painéis da aba Elementos, como no Chrome (Styles e Computed). */
export type PainelElementos = "estilos" | "calculado";

/** Uma parte do desafio: a validação do desafio é a soma das partes. */
export type ParteDesafio = {
  id: string;
  /** Aparece no checklist. Até 140 caracteres. */
  descricao: string;
  validador: Validador;
  /**
   * Id da fase (da mesma unidade) onde isso foi ensinado de forma GUIADA:
   * abre no "Rever". A fase apontada tem pelo menos 1 objetivo guiado
   * (a escada de ajuda completa socorre quem travou).
   *
   * (Contrato) Pode ser uma fase de outra unidade, antes do contrato, onde a
   * habilidade foi ensinada (o contrato junta a ilha inteira).
   */
  revisarEm: string;
  /**
   * (Contrato, obrigatória lá) A pergunta do colega de trabalho para esta
   * parte: ele só pergunta e lembra do processo ("você já testou com a
   * vitrine vazia?"), nunca diz a resposta.
   */
  pergunta?: string;
  /** Ações que cumprem esta parte (testes, /lab/fases e a prévia do "depois"). */
  solucaoDeTeste: Acao[];
};

type FaseBase = {
  /** Formato: "<ilha>-<zona>-u<unidade>-f<fase>", ex.: "sites-elementos-u2-f1". */
  id: string;
  unidadeId: string;
  titulo: string;
  /** O que esta fase ENSINA (no desafio: o que ele PRATICA). */
  conceitos: IdConceito[];
  /** O que ela REVISITA de fases anteriores, misturado na tarefa. */
  revisa: IdConceito[];
  /** O que o jogador precisa saber antes. */
  prerequisitos: IdConceito[];
  /** Toda ferramenta que a fase usa (inclusive nas soluções). */
  usaFerramentas: IdFerramenta[];
  /** Ferramentas apresentadas logo depois da introdução. */
  apresentar?: IdFerramenta[];
  introducao: Fala[];
  /** Momentos roteirizados logo depois da introdução. */
  eventosIniciais?: EventoRoteirizado[];
  siteAlvo: SiteAlvo;
  /**
   * Sub-painéis liberados dentro de Elementos (o painel Estilos e o
   * Calculado). Sem o campo, a fase não mostra nenhum.
   */
  paineisElementos?: PainelElementos[];
  /**
   * Modo documento: o jogador edita o documento INTEIRO (doctype, html,
   * head e body). O editor mostra tudo, a árvore começa no <html> (com o
   * head, o title e os meta, como no Chrome), a aba do navegador falso
   * mostra o <title> ao vivo e, sem <meta charset>, a prévia simula os
   * acentos quebrados. O documento inicial é montado de siteAlvo.head e
   * siteAlvo.body.
   */
  modoDocumento?: true;
  /**
   * Fase de programa (Ilha Lógica): o jogador escreve JavaScript no
   * Console e, se a fase quiser, no Snippet (aba Fontes). A tela do site
   * vira o palco da memória. Use `siteAlvo: SITE_DO_PROGRAMA`
   * (src/motor/programa.ts). Ver o guia, seção 25.
   */
  programa?: BancadaPrograma;
  conclusao: Fala[];
  /** Algo para o jogador fazer num site de verdade, pelo F12. */
  missaoDeCampo?: string;
  /** Última fala, depois da missão de campo. */
  falaFinal?: Fala;
};

/**
 * Composição de áreas de trabalho (motor de resolução de problemas): a fase
 * declara as áreas que usa e o motor monta a tela com elas, em vez de mais
 * um tipo fechado de fase. Vale para a prática e para o desafio. Ver
 * src/motor/composicao.ts e o guia, seção 29.
 */
export type ComposicaoDaFase = {
  /**
   * As áreas de trabalho na mesma tela: "cena" (o mundo que o código
   * controla, campo `cena`), "plano" (o quadro de passos, campo `plano`),
   * "snippet" (o código: aba Fontes com o Snippet e o Console, pede
   * programa.snippet), "palco" (o palco da memória com a linha do tempo) e
   * "testes" (os casos de teste do aluno, campo `testes`) e "exposicao" (a
   * sala do museu, campo `exposicao`, sempre sozinha). Sem o campo, a fase
   * usa a tela de sempre do tipo dela.
   */
  areas?: AreaTrabalho[];
  /**
   * (Área cena) A cena programável: o cenário (peças do kit), os
   * dispositivos que o código usa (`lampada.ligar()`, `sensor.temGente`) e
   * a linha do tempo dos acontecimentos. Ver src/motor/cena e o guia, seção 30.
   */
  cena?: DadosCena;
  /**
   * (Área plano) Os cartões do problema, como no ordenar-passos (ordenar ou
   * agrupar, validação pelas dependências), sem `rodar`: o plano vira
   * comentários no Snippet e o código é o aluno que escreve.
   */
  plano?: DadosOrdenar;
  /**
   * (Área testes) A função que os casos do aluno chamam (`funcao`, a do
   * Snippet), os nomes dos parâmetros (o rótulo da entrada) e, se quiser,
   * exemplos que já vêm escritos (`inicial`, como o aluno escreveria:
   * `{ entrada: "[8, 6]", esperado: "7" }`).
   */
  testes?: DadosCasos;
  /**
   * (Área exposicao) A exposição do Museu das Origens: o antepassado que
   * recebe o aluno, a placa e as estações interativas (tear, bits, camadas,
   * cor, linha do tempo). Ver src/motor/exposicao e o guia, seção 32.
   */
  exposicao?: DadosExposicao;
};

/** Micro-passos: objetivos guiados e sozinho, em sequência. */
export type FasePratica = FaseBase & ComposicaoDaFase & {
  tipo: "pratica";
  objetivos: Objetivo[];
  /**
   * O que a fase TREINA: conceitos já ensinados (com objetivo guiado) numa
   * fase anterior e que aqui voltam só para o jogador fazer sozinho. Uma
   * fase de prática precisa ter `conceitos` ou `pratica` não vazio; uma
   * fase só de objetivos sozinho deixa `conceitos` vazio e põe tudo aqui.
   */
  pratica?: IdConceito[];
};

/**
 * Desafio: sem passo a passo, só o checklist das partes. Com `circuito`, a
 * bancada do circuito lógico é a tela (validadores circuitoTabela e
 * usouPortao nas partes); com `circuito` e `programa` juntos, é a ponte
 * circuito/Console: a bancada na tela e, no painel, a tabela verdade em
 * cima e o Console embaixo. Com `areas`, a tela é composta como numa
 * prática composta (plano, código e palco), e as partes podem ser de cada
 * área.
 */
export type FaseDesafio = FaseBase &
  ComposicaoDaFase & {
    tipo: "desafio";
    partes: ParteDesafio[];
    circuito?: DadosCircuito;
    /**
     * O desafio é um CONTRATO (o trabalho de fim de ilha): briefing do
     * cliente, requisitos escolhidos entre distrações, o checklist ao vivo,
     * a mudança de pedido no meio, a entrega e o Levar pro mundo. Ver
     * src/motor/contrato/modelo.ts e o guia, seção 31.
     */
    contrato?: DadosContrato;
  };

/**
 * Um requisito do projeto-ponte: marca sozinho quando o validador passa
 * (ao vivo, como as partes de estado do desafio).
 */
export type RequisitoProjeto = {
  id: string;
  /** Aparece no checklist. Até 140 caracteres. */
  descricao: string;
  validador: Validador;
  /**
   * A pergunta do computadorzinho quando o jogador pede ajuda (no projeto o
   * tutor só pergunta: nada de dica pronta nem solução). Até 160.
   */
  pergunta: string;
  /** Ações que cumprem o requisito (testes e /lab/fases). */
  solucaoDeTeste: Acao[];
};

/**
 * Projeto-ponte: o jogador constrói o PRÓPRIO site no modo documento, com
 * HTML e CSS livres e as ferramentas que já conhece. Sem passo a passo:
 * um checklist de requisitos que se marcam sozinhos e o tutor que só
 * pergunta. O projeto fica salvo (Meus projetos), pode ser reaberto e
 * editado depois e, com a ferramenta `levar-pro-mundo`, vira um .zip com
 * index.html e style.css, com o guia de publicação.
 */
export type FaseProjetoPonte = FaseBase & {
  tipo: "projeto-ponte";
  modoDocumento: true;
  requisitos: RequisitoProjeto[];
  /** O nome do projeto no painel Meus projetos e no .zip ("Meu primeiro site"). */
  nomeDoProjeto: string;
};

/**
 * Simulador de campanha (S5): objetivos como numa fase de prática
 * (guiados, sozinho, previsões), mais a aba Campanha, onde o jogador
 * escolhe orçamento, palavra-chave e lance e vê o leilão e o dia simulado.
 * A página de destino é o site-alvo: melhorar a página (no painel, como
 * sempre) melhora o resultado. Números fictícios, declarados na tela.
 */
export type FaseSimuladorCampanha = FaseBase & {
  tipo: "simulador-campanha";
  objetivos: Objetivo[];
  /** Como na prática: conceitos que a fase só treina. */
  pratica?: IdConceito[];
  campanha: DadosCampanha;
};

/** A bancada de uma fase de circuito lógico. */
export type DadosCircuito = {
  /** O circuito que a fase já traz: as entradas (chaves) e as saídas, às vezes portões e fios. */
  inicial: Circuito;
  /** Os portões que o jogador pode tirar da paleta. O OU exclusivo ("xou") é extra. */
  paleta: TipoPortao[];
};

/**
 * Circuito lógico: objetivos como numa prática, numa bancada onde o jogador
 * arrasta portões E, OU e NÃO, liga fios, alterna as entradas e vê a
 * corrente acender; a tabela verdade fica ao lado e "Ver como código"
 * mostra o circuito com &&, || e !. Use `siteAlvo: SITE_DO_PROGRAMA`.
 */
export type FaseCircuitoLogico = FaseBase & {
  tipo: "circuito-logico";
  objetivos: Objetivo[];
  pratica?: IdConceito[];
  circuito: DadosCircuito;
};

/**
 * Ordenar passos (zona Resolvendo problemas): objetivos como numa prática,
 * num quadro com cartões de passos (em português ou em código) que o
 * jogador arrasta para o plano. A validação é pelas dependências entre os
 * passos (`depoisDe`): qualquer ordem que as respeite vale. Cartões que
 * sobram são distrações. Variante `agrupar`: separar os subpassos dentro
 * dos passos grandes. Com `ordenar.rodar` e `programa`, o plano roda como
 * código. Use `siteAlvo: SITE_DO_PROGRAMA`. Ver o guia, seção 27.
 */
export type FaseOrdenarPassos = FaseBase & {
  tipo: "ordenar-passos";
  objetivos: Objetivo[];
  pratica?: IdConceito[];
  ordenar: DadosOrdenar;
};

/** Fases com objetivos em sequência (prática, simulador de campanha, circuito lógico e ordenar passos). */
export type FaseComObjetivos = FasePratica | FaseSimuladorCampanha | FaseCircuitoLogico | FaseOrdenarPassos;

/**
 * Registro extensível de tipos de fase (ver src/motor/tiposDeFase.ts).
 * Tipos futuros ("linha-do-tempo", "comparador", "diagrama-rede") entram
 * aqui como novas variantes.
 */
export type Fase = FasePratica | FaseDesafio | FaseProjetoPonte | FaseSimuladorCampanha | FaseCircuitoLogico | FaseOrdenarPassos;

export type TipoFase = Fase["tipo"];

/* ------------------------------------------------------------------ */
/* Unidades                                                           */
/* ------------------------------------------------------------------ */

export type Unidade = {
  /** Formato: "<ilha>-<zona>-u<numero>", ex.: "sites-elementos-u2". */
  id: string;
  ilha: string;
  zona: string;
  /** Número da unidade dentro da zona (1, 2, 3...). */
  numero: number;
  titulo: string;
  meta: {
    /** "No fim desta unidade, você..." Até 200 caracteres. */
    enunciado: string;
    /**
     * Fase de desafio da unidade (a última, do tipo desafio, da mesma
     * unidade). A prévia antes/depois vem do site dela. Opcional só enquanto
     * a unidade ainda não tem desafio. A meta aparece uma vez na entrada da
     * unidade (primeira fase, sem progresso nenhum nela) e antes do desafio.
     */
    desafioId?: string;
  };
  /** Ids das fases, em ordem, terminando no desafio. */
  fases: string[];
};

/* ------------------------------------------------------------------ */
/* Revisão do dia                                                     */
/* ------------------------------------------------------------------ */

/**
 * Um item da Revisão do dia: um desafio curto (1 a 2 minutos) sobre UM
 * conceito já aprendido, num mini-site próprio, diferente dos sites das
 * fases (senão vira decoreba). Mora em src/conteudo/revisao/<conceito>.ts,
 * com pelo menos 2 variações por conceito, em situações diferentes.
 *
 * Na sessão, o item vira uma fase de um objetivo "sozinho": o tutor só
 * pergunta e o "Me ajuda" para na dica. O `testar:conteudo` confere os
 * itens com as mesmas regras dos objetivos (estado inicial não passa,
 * solução passa, limites de texto, sem emoji, conceito existe). O id de um
 * item publicado é congelado, como os das fases.
 */
export type ItemRevisao = {
  /** kebab-case, único entre todos os itens; por convenção "<conceito>-<n>". */
  id: string;
  conceito: IdConceito;
  /**
   * "acao": fazer algo no mini-site (precisa de `validador`).
   * "previsao": prever o que acontece (precisa de `previsao`); com
   * `validador`, depois de prever o jogador faz e vê acontecer; sem ele, o
   * item acaba na resposta.
   */
  tipo: "acao" | "previsao";
  /** Até 140 caracteres cada. `toque` troca "clique" por "toque" e afins. */
  enunciado: { mouse: string; toque: string };
  /** Mini-site próprio e pequeno. `url` e `titulo` têm padrão. */
  siteAlvo: { head?: string; body: string; css?: string; url?: string; titulo?: string };
  /** O jogador edita o documento inteiro (head e body), como numa fase com modoDocumento. */
  modoDocumento?: true;
  /**
   * Item de programa (Ilha Lógica): o Console e o palco no lugar do
   * mini-site (use `siteAlvo: { body: "" }`). A situação diferente da fase
   * vem do `preparo` e do enunciado.
   */
  programa?: BancadaPrograma;
  validador?: Validador;
  previsao?: Previsao;
  /** Só pergunta e dica: sem linha e sem solução (a revisão é "sozinho"). */
  ajudas: AjudasSozinho;
  /** Ações que cumprem o item (testes). Num item de previsão, comece com responderPrevisao. */
  solucaoDeTeste: Acao[];
};
