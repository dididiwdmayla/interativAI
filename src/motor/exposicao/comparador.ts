/*
 * O comparador de linguagens (sala 3 do museu): o mesmo programa escrito em
 * várias linguagens, lado a lado. Cada linha diz de qual PARTE do programa
 * ela é ("os preços", "somar", "o desconto", "mostrar"); tocar numa linha
 * acende a mesma parte em todas as linguagens: o conceito é o mesmo, muda
 * a escrita. Rodar mostra a saída (JavaScript e Python de verdade, as
 * outras simuladas: src/motor/linguagens). O coral roda todas.
 *
 * Puro: a tela, a simulação dos testes e os validadores usam as mesmas
 * funções. A saída de cada execução não fica aqui (a tela guarda a da
 * sessão; os validadores de saída leem os eventos executouCodigo).
 */
import { ehLinguagem, FICHAS_LINGUAGENS, type Linguagem } from "../linguagens/tipos";
import { ehObjeto, KEBAB, repetidos, semRepetir, tamanho, textos } from "./comum";

export type LinhaComparada = { texto: string; parte?: string };

export type ProgramaComparado = {
  linguagem: Linguagem;
  linhas: LinhaComparada[];
  /** O que o programa mostra (a saída das simuladas; nas que rodam, conferida pelos testes). */
  saida: string[];
};

export type ParteComparada = {
  id: string;
  /** "O desconto". Até 32. */
  nome: string;
  /** O conceito, numa frase. Até 140. */
  explica: string;
};

export type EstacaoComparador = {
  id: string;
  tipo: "comparador";
  titulo: string;
  partes: ParteComparada[];
  /** De 2 a 6 linguagens, cada uma uma vez, na ordem em que aparecem. */
  programas: ProgramaComparado[];
  /** A linguagem que o aluno pode editar (só uma que roda de verdade: javascript ou python). */
  editavel?: Linguagem;
  /** Mostra o botão do coral (todas as linguagens cantam o programa, na voz da época). */
  coral?: boolean;
};

export type EstadoComparador = {
  tipo: "comparador";
  /** As linguagens que já rodaram (na ordem). */
  rodadas: Linguagem[];
  /** A parte acesa agora e a linguagem em que o aluno tocou. */
  acesa: { parte: string; linguagem: Linguagem } | null;
  /** O código editado (só a linguagem editável). */
  codigos: Partial<Record<Linguagem, string>>;
  /** O coral já cantou. */
  coral: boolean;
};

export function estadoInicialComparador(): EstadoComparador {
  return { tipo: "comparador", rodadas: [], acesa: null, codigos: {}, coral: false };
}

export function programaDa(estacao: EstacaoComparador, linguagem: Linguagem): ProgramaComparado | null {
  return estacao.programas.find((programa) => programa.linguagem === linguagem) ?? null;
}

export function codigoOriginal(programa: ProgramaComparado): string {
  return programa.linhas.map((linha) => linha.texto).join("\n");
}

/** O código de agora (o editado, se houver). */
export function codigoDaLinguagem(estacao: EstacaoComparador, estado: EstadoComparador, linguagem: Linguagem): string {
  const programa = programaDa(estacao, linguagem);
  return estado.codigos[linguagem] ?? (programa ? codigoOriginal(programa) : "");
}

/**
 * As linhas de agora com a parte de cada uma. Editado com o mesmo número de
 * linhas, cada linha fica com a parte da linha original do mesmo lugar;
 * com outro número, as partes somem (o aluno reescreveu o programa).
 */
export function linhasDeAgora(estacao: EstacaoComparador, estado: EstadoComparador, linguagem: Linguagem): LinhaComparada[] {
  const programa = programaDa(estacao, linguagem);
  if (!programa) return [];
  const editado = estado.codigos[linguagem];
  if (editado === undefined) return programa.linhas;
  const linhas = editado.split("\n");
  const mesmas = linhas.length === programa.linhas.length;
  return linhas.map((texto, i) => ({ texto, ...(mesmas && programa.linhas[i]?.parte ? { parte: programa.linhas[i].parte } : {}) }));
}

export function rodarNoComparador(estacao: EstacaoComparador, estado: EstadoComparador, linguagem: Linguagem): EstadoComparador | null {
  if (!programaDa(estacao, linguagem)) return null;
  return { ...estado, rodadas: semRepetir([...estado.rodadas, linguagem]) };
}

export function cantarCoral(estacao: EstacaoComparador, estado: EstadoComparador): EstadoComparador | null {
  if (!estacao.coral) return null;
  return { ...estado, rodadas: semRepetir([...estado.rodadas, ...estacao.programas.map((p) => p.linguagem)]), coral: true };
}

/** Acende uma parte, tocando numa linha dela na linguagem dada (null apaga). */
export function tocarParte(estacao: EstacaoComparador, estado: EstadoComparador, parte: string | null, linguagem: Linguagem): EstadoComparador | null {
  if (parte === null) return { ...estado, acesa: null };
  if (!estacao.partes.some((p) => p.id === parte)) return null;
  if (!linhasDeAgora(estacao, estado, linguagem).some((linha) => linha.parte === parte)) return null;
  return { ...estado, acesa: { parte, linguagem } };
}

export function escreverNoComparador(estacao: EstacaoComparador, estado: EstadoComparador, linguagem: Linguagem, codigo: string): EstadoComparador | null {
  if (estacao.editavel !== linguagem || !programaDa(estacao, linguagem)) return null;
  const limpo = codigo.replace(/\r\n?/g, "\n").slice(0, 4000);
  const original = codigoOriginal(programaDa(estacao, linguagem) as ProgramaComparado);
  const codigos = { ...estado.codigos };
  if (limpo === original) delete codigos[linguagem];
  else codigos[linguagem] = limpo;
  // Mexeu no código: a parte acesa daquela linguagem pode ter sumido.
  const acesa = estado.acesa && estado.acesa.linguagem === linguagem ? null : estado.acesa;
  return { ...estado, codigos, acesa };
}

export function linguagensRodadas(estacao: EstacaoComparador, estado: EstadoComparador, pedidas?: readonly Linguagem[]): { passou: boolean; detalhe: string } {
  const lista = pedidas ?? estacao.programas.map((p) => p.linguagem);
  const faltam = lista.filter((linguagem) => !estado.rodadas.includes(linguagem));
  return faltam.length
    ? { passou: false, detalhe: `falta rodar: ${faltam.map((l) => FICHAS_LINGUAGENS[l].nome).join(", ")}` }
    : { passou: true, detalhe: `rodaram: ${estado.rodadas.map((l) => FICHAS_LINGUAGENS[l].nome).join(", ")}` };
}

export function parteVista(estado: EstadoComparador, parte: string, linguagens?: readonly Linguagem[]): { passou: boolean; detalhe: string } {
  const acesa = estado.acesa;
  if (!acesa) return { passou: false, detalhe: "nenhuma parte acesa" };
  const passou = acesa.parte === parte && (!linguagens || linguagens.includes(acesa.linguagem));
  return { passou, detalhe: `acesa: ${acesa.parte} (tocada em ${FICHAS_LINGUAGENS[acesa.linguagem].nome})` };
}

export function lerEstadoComparador(valor: Record<string, unknown>): EstadoComparador {
  const codigos: Partial<Record<Linguagem, string>> = {};
  if (ehObjeto(valor.codigos)) for (const [linguagem, codigo] of Object.entries(valor.codigos)) if (ehLinguagem(linguagem) && typeof codigo === "string") codigos[linguagem] = codigo.slice(0, 4000);
  const acesa = ehObjeto(valor.acesa) && typeof valor.acesa.parte === "string" && ehLinguagem(valor.acesa.linguagem) ? { parte: valor.acesa.parte, linguagem: valor.acesa.linguagem } : null;
  return { tipo: "comparador", rodadas: semRepetir(textos(valor.rodadas, 6).filter(ehLinguagem)), acesa, codigos, coral: valor.coral === true };
}

export function comparadorCabe(estacao: EstacaoComparador, estado: EstadoComparador): boolean {
  const linguagens = estacao.programas.map((p) => p.linguagem);
  return (
    estado.rodadas.every((l) => linguagens.includes(l)) &&
    Object.keys(estado.codigos).every((l) => l === estacao.editavel) &&
    (!estado.acesa || estacao.partes.some((p) => p.id === estado.acesa?.parte))
  );
}

export function conferirComparador(estacao: EstacaoComparador, onde: string): string[] {
  const p: string[] = [];
  const { programas, partes } = estacao;
  if (programas.length < 2 || programas.length > 6) p.push(`${onde}: ${programas.length} programas (de 2 a 6)`);
  p.push(...repetidos(programas.map((x) => x.linguagem)).map((l) => `${onde}: a linguagem "${l}" aparece duas vezes`));
  if (partes.length < 1 || partes.length > 8) p.push(`${onde}: ${partes.length} partes (de 1 a 8)`);
  p.push(...repetidos(partes.map((x) => x.id)).map((id) => `${onde}: parte com id repetido "${id}"`));
  for (const parte of partes) {
    if (!KEBAB.test(parte.id)) p.push(`${onde}: a parte "${parte.id}" não está em kebab-case`);
    tamanho(p, `${onde}: nome da parte "${parte.id}"`, parte.nome, 32);
    tamanho(p, `${onde}: explica da parte "${parte.id}"`, parte.explica, 140);
  }
  for (const programa of programas) {
    const qual = `${onde}: o programa em ${programa.linguagem}`;
    if (!ehLinguagem(programa.linguagem)) p.push(`${qual}: linguagem desconhecida`);
    if (programa.linhas.length < 1 || programa.linhas.length > 18) p.push(`${qual} tem ${programa.linhas.length} linhas (de 1 a 18)`);
    for (const [i, linha] of programa.linhas.entries()) {
      if (linha.texto.length > 52) p.push(`${qual}, linha ${i + 1}: ${linha.texto.length} caracteres (máximo 52, para caber no celular)`);
      if (linha.parte && !partes.some((x) => x.id === linha.parte)) p.push(`${qual}, linha ${i + 1}: a parte "${linha.parte}" não existe`);
    }
    if (!programa.saida.length) p.push(`${qual}: a saida está vazia`);
  }
  // Uma parte só existe para comparar: precisa aparecer em pelo menos dois programas (a moldura do C e do Java, por exemplo).
  for (const parte of partes) {
    const em = programas.filter((programa) => programa.linhas.some((l) => l.parte === parte.id)).length;
    if (em < 2) p.push(`${onde}: a parte "${parte.id}" aparece em ${em} programa(s) (pelo menos 2, para comparar)`);
  }
  if (estacao.editavel !== undefined && FICHAS_LINGUAGENS[estacao.editavel]?.roda !== "executa") p.push(`${onde}: editavel precisa ser uma linguagem que roda de verdade (javascript ou python)`);
  if (estacao.editavel !== undefined && !programas.some((x) => x.linguagem === estacao.editavel)) p.push(`${onde}: editavel "${estacao.editavel}" não tem programa`);
  return p;
}
