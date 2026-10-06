/*
 * Contratos: o "trabalho de verdade" do fim de cada ilha. Um cliente contrata
 * o aluno para criar um sistema, e ele passa pelo processo inteiro, numa fase
 * só, em etapas:
 *
 * 1. briefing: o cliente aparece e explica o que quer, do jeito dele (vago e
 *    cotidiano). O pedido vira o "documento do cliente", que dá para reler a
 *    qualquer momento;
 * 2. requisitos: o aluno escolhe, entre cartões com distrações, o que o
 *    cliente pediu de verdade e completa as lacunas (a hora, o número) lendo
 *    o documento. Só segue quando a lista está certa;
 * 3. trabalho: a tela da fase (a composta, com plano, código, cena e testes,
 *    ou a do DevTools) com o checklist dos requisitos marcando ao vivo;
 * 4. mudança de pedido: depois de algumas partes prontas, o cliente manda uma
 *    mensagem mudando ou acrescentando algo. O checklist se atualiza (um
 *    requisito pode trocar de lugar com a versão nova) e o código precisa
 *    passar nos antigos e nos novos;
 * 5. entrega: o relatório automático (requisitos atendidos, testes passando,
 *    tempo), a reação do cliente e a comemoração de fim de ilha;
 * 6. levar pro mundo: o programa sai do jogo (na Lógica, um .js que roda no
 *    Console de qualquer navegador e no Node).
 *
 * O contrato é um DESAFIO com o campo `contrato` (DadosContrato): as partes do
 * desafio são os requisitos (as do cliente, ligadas aos cartões, e as do
 * processo, como o plano no código e os casos de teste). Reaproveita a tela
 * composta, as cenas, os casos de teste e o checklist do desafio.
 *
 * Puro (sem React): a tela, a simulação dos testes e as checagens usam as
 * mesmas funções. Ver o guia, seção 31.
 */
import type { FaseDesafio, ParteDesafio } from "@/conteudo/tipos";
import type { IdCliente } from "./clientes";
import type { ExpressaoCliente } from "./expressoes";

export type { ExpressaoCliente } from "./expressoes";

/** Uma fala do cliente (o balão dele, com a expressão do rosto). */
export type FalaCliente = { texto: string; expressao: ExpressaoCliente };

/** Uma lacuna de um cartão: as opções e a certa (o aluno acha a resposta no documento). */
export type LacunaCartao = { opcoes: string[]; correta: number };

/**
 * Um cartão da etapa de requisitos. Os de verdade apontam a `parte` do
 * checklist que eles viram; os de distração (`sobra`) são coisas que o
 * cliente comentou, mas não pediu. `texto` pode ter lacunas, escritas como
 * `___` (três sublinhados), uma para cada item de `lacunas`, na ordem.
 */
export type CartaoRequisito = {
  id: string;
  texto: string;
  /** A parte do desafio que este cartão vira (cartão de verdade). */
  parte?: string;
  /** Distração: o cliente falou disso, mas não pediu. */
  sobra?: true;
  lacunas?: LacunaCartao[];
  /** Por que entra (ou por que não): aparece quando o aluno erra este cartão. */
  porque: string;
};

/** Uma parte que entra com a mudança de pedido; com `substitui`, toma o lugar de uma parte antiga. */
export type ParteNova = { parte: string; substitui?: string };

export type DadosContrato = {
  /** Quem contrata (o kit de clientes: src/motor/contrato/clientes.ts). */
  cliente: IdCliente;
  /** O nome do trabalho, como vai no relatório e no arquivo: "Vitrine automática". */
  projeto: string;
  /** O cliente explica o que quer (2 a 8 falas, com a cara de cliente de verdade). */
  briefing: FalaCliente[];
  /** O pedido por escrito: o "documento do cliente", que dá para reler a qualquer momento. */
  documento: { titulo: string; paragrafos: string[] };
  requisitos: {
    /** A pergunta da etapa (padrão: "O que ele pediu de verdade?"). */
    pergunta?: string;
    cartoes: CartaoRequisito[];
  };
  /** A mudança de pedido no meio do trabalho. */
  mudanca: {
    /** A mensagem chega quando estas partes estão marcadas (ids de partes que existem desde o começo). */
    depoisDe: string[];
    mensagem: FalaCliente[];
    /** O parágrafo que entra no documento do cliente ("Mensagem de ..."). */
    adendo: string;
    /** As partes que só existem depois da mudança (as novas e as que trocam uma antiga). */
    novas: ParteNova[];
  };
  entrega: {
    /** O cliente vê o relatório e reage (1 a 4 falas). */
    reacao: FalaCliente[];
  };
  /** O programa fora do jogo (ilhas com código): o nome do arquivo baixado. */
  levarProMundo?: { arquivo: string };
  /**
   * `false`: o contrato é um chamado no meio da ilha (a zona Depuração), não o
   * trabalho que a fecha. A entrega não tem a comemoração de fim de ilha.
   */
  fimDeIlha?: false;
};

/** Um desafio que é um contrato. */
export type FaseContrato = FaseDesafio & { contrato: DadosContrato };

export function ehContrato(fase: { tipo: string; contrato?: unknown }): fase is FaseContrato {
  return fase.tipo === "desafio" && typeof fase.contrato === "object" && fase.contrato !== null;
}

/** As etapas do contrato dentro da fase (a de trabalho é o checklist). */
export type EtapaContrato = "briefing" | "requisitos" | "trabalho" | "entrega";

/** A escolha do aluno na etapa de requisitos: os cartões escolhidos e a opção de cada lacuna. */
export type EscolhaRequisitos = { cartoes: string[]; lacunas: Record<string, number[]> };

/** O que o motor guarda do contrato (e o progresso salva). */
export type EstadoContrato = {
  etapa: EtapaContrato;
  /** A lista de requisitos que o aluno montou (a última conferida). */
  escolha: EscolhaRequisitos | null;
  /** Quantas vezes conferiu a lista de requisitos errada. */
  tentativas: number;
  /** A mudança de pedido já chegou. */
  mudou: boolean;
  /** Tempo de trabalho (ms), somado entre as visitas. */
  tempoMs: number;
  /** O trabalho foi entregue ao cliente (a fase concluiu). */
  entregue: boolean;
};

export function estadoInicialContrato(): EstadoContrato {
  return { etapa: "briefing", escolha: null, tentativas: 0, mudou: false, tempoMs: 0, entregue: false };
}

/* ------------------------------------------------------------------ */
/* O checklist: as partes visíveis antes e depois da mudança.          */
/* ------------------------------------------------------------------ */

/** As partes que só existem depois da mudança. */
export function idsDasNovas(contrato: DadosContrato): Set<string> {
  return new Set(contrato.mudanca.novas.map((nova) => nova.parte));
}

/**
 * As partes do checklist agora: antes da mudança, as do começo; depois, a
 * parte que troca uma antiga fica no lugar dela e as novas entram no fim das
 * do cliente (antes das do processo, que ficam por último).
 */
export function partesVisiveis(fase: FaseContrato, mudou: boolean): ParteDesafio[] {
  const { contrato } = fase;
  const novas = idsDasNovas(contrato);
  const originais = fase.partes.filter((parte) => !novas.has(parte.id));
  if (!mudou) return originais;
  const porId = new Map(fase.partes.map((parte) => [parte.id, parte]));
  const trocas = new Map(contrato.mudanca.novas.filter((nova) => nova.substitui).map((nova) => [nova.substitui as string, porId.get(nova.parte)]));
  const trocadas = originais.map((parte) => trocas.get(parte.id) ?? parte).filter((parte): parte is ParteDesafio => parte !== undefined);
  const soNovas = contrato.mudanca.novas
    .filter((nova) => !nova.substitui)
    .map((nova) => porId.get(nova.parte))
    .filter((parte): parte is ParteDesafio => parte !== undefined);
  const doCliente = new Set(idsDoCliente(contrato));
  const ultimaDoCliente = trocadas.reduce((ultima, parte, indice) => (doCliente.has(parte.id) ? indice : ultima), -1);
  return [...trocadas.slice(0, ultimaDoCliente + 1), ...soNovas, ...trocadas.slice(ultimaDoCliente + 1)];
}

/** As partes que são pedidos do cliente (dos cartões ou da mudança). As outras são do processo (plano, testes). */
export function idsDoCliente(contrato: DadosContrato): string[] {
  const ids = contrato.requisitos.cartoes.flatMap((cartao) => (cartao.parte ? [cartao.parte] : []));
  for (const nova of contrato.mudanca.novas) ids.push(nova.parte);
  return [...new Set(ids)];
}

/** A mensagem de mudança chega agora: todas as partes de `depoisDe` estão marcadas. */
export function mudancaPronta(contrato: DadosContrato, feitas: readonly string[]): boolean {
  return contrato.mudanca.depoisDe.every((id) => feitas.includes(id));
}

/* ------------------------------------------------------------------ */
/* A etapa de requisitos: os cartões, as lacunas e a conferência.      */
/* ------------------------------------------------------------------ */

export const MARCA_LACUNA = "___";

/** O texto do cartão em pedaços: texto, lacuna, texto... (as lacunas pelo índice). */
export function pedacosDoCartao(cartao: CartaoRequisito): ({ tipo: "texto"; texto: string } | { tipo: "lacuna"; indice: number })[] {
  const partes = cartao.texto.split(MARCA_LACUNA);
  return partes.flatMap((texto, indice) => [
    ...(texto ? [{ tipo: "texto" as const, texto }] : []),
    ...(indice < partes.length - 1 ? [{ tipo: "lacuna" as const, indice }] : []),
  ]);
}

/** O texto com as lacunas preenchidas (com as respostas; sem resposta, "___"). */
export function textoDoCartao(cartao: CartaoRequisito, respostas: readonly number[] = []): string {
  return pedacosDoCartao(cartao)
    .map((pedaco) => {
      if (pedaco.tipo === "texto") return pedaco.texto;
      const resposta = respostas[pedaco.indice];
      return resposta === undefined ? MARCA_LACUNA : (cartao.lacunas?.[pedaco.indice]?.opcoes[resposta] ?? MARCA_LACUNA);
    })
    .join("");
}

/** Os cartões na ordem certa de preenchimento (a escolha certa). */
export function escolhaCerta(contrato: DadosContrato): EscolhaRequisitos {
  const cartoes = contrato.requisitos.cartoes.filter((cartao) => !cartao.sobra);
  return {
    cartoes: cartoes.map((cartao) => cartao.id),
    lacunas: Object.fromEntries(cartoes.filter((cartao) => cartao.lacunas?.length).map((cartao) => [cartao.id, (cartao.lacunas ?? []).map((lacuna) => lacuna.correta)])),
  };
}

export type SituacaoCartao = "certo" | "faltou" | "sobrou" | "lacuna" | "fora";

export type ConferenciaRequisitos = {
  certo: boolean;
  /** Cada cartão: certo (entrou e devia), fora (ficou fora e devia), faltou, sobrou ou lacuna errada. */
  cartoes: { id: string; situacao: SituacaoCartao }[];
  faltaram: number;
  sobraram: number;
  lacunasErradas: number;
};

/** Confere a lista que o aluno montou: todos os pedidos de verdade, nenhuma distração, lacunas certas. */
export function conferirRequisitos(contrato: DadosContrato, escolha: EscolhaRequisitos): ConferenciaRequisitos {
  const escolhidos = new Set(escolha.cartoes);
  const cartoes = contrato.requisitos.cartoes.map((cartao) => {
    const entrou = escolhidos.has(cartao.id);
    let situacao: SituacaoCartao;
    if (cartao.sobra) situacao = entrou ? "sobrou" : "fora";
    else if (!entrou) situacao = "faltou";
    else {
      const respostas = escolha.lacunas[cartao.id] ?? [];
      const lacunasCertas = (cartao.lacunas ?? []).every((lacuna, indice) => respostas[indice] === lacuna.correta);
      situacao = lacunasCertas ? "certo" : "lacuna";
    }
    return { id: cartao.id, situacao };
  });
  const contar = (situacao: SituacaoCartao) => cartoes.filter((cartao) => cartao.situacao === situacao).length;
  const faltaram = contar("faltou");
  const sobraram = contar("sobrou");
  const lacunasErradas = contar("lacuna");
  return { certo: faltaram + sobraram + lacunasErradas === 0, cartoes, faltaram, sobraram, lacunasErradas };
}

/** Uma frase do colega de trabalho sobre a conferência (sem dizer qual cartão, nas primeiras vezes). */
export function falaDaConferencia(conferencia: ConferenciaRequisitos): string {
  if (conferencia.certo) return "Fechou: é isso que o cliente pediu. Agora o checklist vai marcando cada requisito enquanto você trabalha.";
  const partes: string[] = [];
  if (conferencia.faltaram) partes.push(conferencia.faltaram === 1 ? "um pedido ficou de fora" : `${conferencia.faltaram} pedidos ficaram de fora`);
  if (conferencia.sobraram) partes.push(conferencia.sobraram === 1 ? "entrou uma coisa que ele só comentou" : `entraram ${conferencia.sobraram} coisas que ele só comentou`);
  if (conferencia.lacunasErradas) partes.push(conferencia.lacunasErradas === 1 ? "uma lacuna não bate com o documento" : `${conferencia.lacunasErradas} lacunas não batem com o documento`);
  const lista = partes.length > 1 ? `${partes.slice(0, -1).join(", ")} e ${partes[partes.length - 1]}` : partes[0];
  return `Quase: ${lista}. Relê o documento do cliente: o que ele pediu mesmo?`;
}

/** A partir de quantas conferências erradas o colega mostra quais cartões estão errados (e por quê). */
export const TENTATIVAS_ANTES_DE_MOSTRAR = 2;

/* ------------------------------------------------------------------ */
/* A entrega: o relatório automático para o cliente.                   */
/* ------------------------------------------------------------------ */

export type RelatorioEntrega = {
  projeto: string;
  requisitos: { descricao: string; atendido: boolean; mudou: boolean }[];
  /** Os casos de teste do aluno (null: a fase não tem a área testes). */
  casos: { passando: number; total: number } | null;
  /** Os dias (linhas do tempo) em que o programa foi testado na cena (0: sem cena). */
  cenarios: number;
  /** Os outros itens do processo (plano no código...), com o status. */
  processo: { descricao: string; atendido: boolean }[];
  tempoMs: number;
};

/** Os casos do aluno para o relatório: quantos passaram na última rodada. */
export function resumoDosCasos(estado: { casos: readonly { id: number }[]; resultados: Record<number, { passou: boolean }> }): { passando: number; total: number } {
  return { passando: estado.casos.filter((caso) => estado.resultados[caso.id]?.passou).length, total: estado.casos.length };
}

/** "1 h 05 min", "12 min", "menos de 1 min". */
export function textoDoTempoDeTrabalho(tempoMs: number): string {
  const minutos = Math.floor(tempoMs / 60_000);
  if (minutos < 1) return "menos de 1 min";
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (!horas) return `${minutos} min`;
  return `${horas} h ${String(resto).padStart(2, "0")} min`;
}

type DadosRelatorio = {
  fase: FaseContrato;
  feitas: readonly string[];
  mudou: boolean;
  casos: { passando: number; total: number } | null;
  cenarios: number;
  tempoMs: number;
};

export function montarRelatorio({ fase, feitas, mudou, casos, cenarios, tempoMs }: DadosRelatorio): RelatorioEntrega {
  const { contrato } = fase;
  const doCliente = new Set(idsDoCliente(contrato));
  const novas = idsDasNovas(contrato);
  const visiveis = partesVisiveis(fase, mudou);
  return {
    projeto: contrato.projeto,
    requisitos: visiveis.filter((parte) => doCliente.has(parte.id)).map((parte) => ({ descricao: parte.descricao, atendido: feitas.includes(parte.id), mudou: novas.has(parte.id) })),
    processo: visiveis.filter((parte) => !doCliente.has(parte.id)).map((parte) => ({ descricao: parte.descricao, atendido: feitas.includes(parte.id) })),
    casos,
    cenarios,
    tempoMs,
  };
}
