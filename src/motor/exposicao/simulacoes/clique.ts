/*
 * O caminho de um clique (sala 5): do clique no link até a página montada,
 * etapa por etapa, com o pacote andando no diagrama. E os cenários de
 * quebra, para criar intuição: o DNS fora do ar (o navegador nem sabe para
 * onde ir) e o servidor lento (tudo funciona, só que demora).
 *
 * Comandos: "clicar" (começa do clique), "avancar" (a próxima etapa),
 * "cenario:<normal|dns-fora|servidor-lento>" (troca e volta ao começo).
 * Marcos: "clicou", "etapa:<id>" (as etapas já passadas nesta viagem),
 * "pagina-montada", "viu:<cenario>" (o cenário foi até o fim).
 */
import { tamanho, textos } from "../comum";
import { partesDoComando, type ModeloSimulacao } from "./tipos";

export const CENARIOS_DO_CLIQUE = ["normal", "dns-fora", "servidor-lento"] as const;
export type CenarioClique = (typeof CENARIOS_DO_CLIQUE)[number];

/** Onde o pacote está em cada etapa (as peças do diagrama). */
export type LugarDoPacote = "navegador" | "dns" | "roteadores" | "servidor";

export type EtapaClique = { id: string; titulo: string; texto: string; lugar: LugarDoPacote; ida?: boolean };

/*
 * O endereço do exemplo (203.0.113.7) é de um bloco reservado para
 * documentação (RFC 5737): não é de ninguém.
 */
export function etapasDoCenario(cenario: CenarioClique, site: string): EtapaClique[] {
  const clique: EtapaClique = { id: "clique", titulo: "O clique", texto: `Você clica no link de ${site}. O navegador só sabe o NOME do site; falta o endereço.`, lugar: "navegador" };
  const dns: EtapaClique = { id: "dns", titulo: "A pergunta ao DNS", texto: "O navegador pergunta ao DNS, a lista telefônica da internet: qual é o endereço desse nome?", lugar: "dns", ida: true };
  if (cenario === "dns-fora") {
    return [
      clique,
      dns,
      { id: "dns-falhou", titulo: "Ninguém atende", texto: "O DNS não responde. Sem o endereço, o navegador nem sabe para onde mandar o pedido: \"Não é possível acessar esse site\".", lugar: "navegador" },
    ];
  }
  const endereco: EtapaClique = { id: "endereco", titulo: "O endereço", texto: "O DNS responde: o servidor mora no endereço 203.0.113.7. Agora o navegador sabe para onde ir.", lugar: "navegador" };
  const ida: EtapaClique = { id: "ida", titulo: "Os roteadores", texto: "O pedido sai em pacotes, pelo roteador de casa e por vários roteadores no caminho, cada um passando adiante.", lugar: "roteadores", ida: true };
  const servidor: EtapaClique = { id: "servidor", titulo: "O servidor (o back)", texto: "O servidor recebe o pedido, busca o que precisa (o cardápio, os preços) e prepara a resposta.", lugar: "servidor", ida: true };
  const volta: EtapaClique = { id: "volta", titulo: "A resposta", texto: "A resposta volta em pacotes pelo caminho: o HTML, o CSS, as imagens.", lugar: "roteadores" };
  const pagina: EtapaClique = { id: "pagina", titulo: "A página (o front)", texto: "O navegador monta a página: primeiro o HTML, depois o CSS dá a cara e as imagens chegam.", lugar: "navegador" };
  const esperando: EtapaClique = { id: "esperando", titulo: "Esperando...", texto: "O servidor está sobrecarregado: o pedido espera na fila. O navegador gira a rodinha e a página fica em branco.", lugar: "servidor", ida: true };
  return cenario === "servidor-lento" ? [clique, dns, endereco, ida, esperando, servidor, volta, pagina] : [clique, dns, endereco, ida, servidor, volta, pagina];
}

export type EstacaoClique = {
  id: string;
  tipo: "clique";
  titulo: string;
  /** O nome do site do exemplo ("padariadobairro.com.br"). Até 32. */
  site: string;
  /** Os cenários que a estação oferece (o normal sempre). */
  cenarios: CenarioClique[];
};

export type EstadoClique = { tipo: "clique"; cenario: CenarioClique; etapa: number; vistos: CenarioClique[] };

const ehCenario = (valor: unknown): valor is CenarioClique => typeof valor === "string" && (CENARIOS_DO_CLIQUE as readonly string[]).includes(valor);

export const CLIQUE: ModeloSimulacao<EstacaoClique, EstadoClique> = {
  inicial: () => ({ tipo: "clique", cenario: "normal", etapa: -1, vistos: [] }),
  comando(dados, estado, comando) {
    const [verbo, resto] = partesDoComando(comando);
    const etapas = etapasDoCenario(estado.cenario, dados.site);
    if (verbo === "clicar") return { ...estado, etapa: 0 };
    if (verbo === "avancar") {
      if (estado.etapa < 0 || estado.etapa >= etapas.length - 1) return null;
      const etapa = estado.etapa + 1;
      const vistos = etapa === etapas.length - 1 && !estado.vistos.includes(estado.cenario) ? [...estado.vistos, estado.cenario] : estado.vistos;
      return { ...estado, etapa, vistos };
    }
    if (verbo === "cenario") {
      if (!ehCenario(resto) || !dados.cenarios.includes(resto) || resto === estado.cenario) return null;
      return { ...estado, cenario: resto, etapa: -1 };
    }
    return null;
  },
  marcos(dados, estado) {
    const marcos: string[] = [];
    const etapas = etapasDoCenario(estado.cenario, dados.site);
    if (estado.etapa >= 0) marcos.push("clicou");
    for (let i = 0; i <= estado.etapa; i += 1) marcos.push(`etapa:${etapas[i].id}`);
    if (etapas[estado.etapa]?.id === "pagina") marcos.push("pagina-montada");
    for (const visto of estado.vistos) marcos.push(`viu:${visto}`);
    return marcos;
  },
  marcoPossivel(dados, marco) {
    const [verbo, resto] = partesDoComando(marco);
    if (marco === "clicou" || marco === "pagina-montada") return true;
    if (verbo === "viu") return ehCenario(resto) && dados.cenarios.includes(resto);
    if (verbo === "etapa") return dados.cenarios.some((c) => etapasDoCenario(c, dados.site).some((e) => e.id === resto));
    return false;
  },
  comandoPossivel(dados, comando) {
    const [verbo, resto] = partesDoComando(comando);
    if (comando === "clicar" || comando === "avancar") return true;
    return verbo === "cenario" && ehCenario(resto) && dados.cenarios.includes(resto);
  },
  conferir(dados, onde) {
    const p: string[] = [];
    tamanho(p, `${onde}: site`, dados.site, 32);
    if (!dados.cenarios.includes("normal")) p.push(`${onde}: os cenários sempre têm o "normal"`);
    for (const cenario of dados.cenarios) if (!ehCenario(cenario)) p.push(`${onde}: cenário "${cenario}" não existe`);
    return p;
  },
  ler(valor) {
    const cenario = ehCenario(valor.cenario) ? valor.cenario : "normal";
    const etapa = typeof valor.etapa === "number" ? Math.round(valor.etapa) : -1;
    return { tipo: "clique", cenario, etapa, vistos: textos(valor.vistos, 3).filter(ehCenario) };
  },
  cabe: (dados, estado) => dados.cenarios.includes(estado.cenario) && estado.etapa >= -1 && estado.etapa < etapasDoCenario(estado.cenario, dados.site).length,
  resumo(dados, estado) {
    const etapa = etapasDoCenario(estado.cenario, dados.site)[estado.etapa];
    return `${dados.titulo}: cenário ${estado.cenario}, ${etapa ? `etapa "${etapa.titulo}"` : "antes do clique"}`;
  },
};
