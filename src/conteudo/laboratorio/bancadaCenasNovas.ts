import { SITE_DO_PROGRAMA } from "@/motor/programa";
import type { DadosCena } from "@/motor/cena/modelo";
import type { FasePratica, Unidade, Validador } from "../tipos";
import { CENA_GARAGEM, CENA_COZINHA, CENA_ESQUINA, CENA_ESTUFA, CHEGADAS_GARAGEM, PORTAS_COZINHA, PEDIDOS_ESQUINA, CLIMAS_ESTUFA } from "./cenasNovas";

export const SOLUCOES_CENAS_NOVAS = [
`while (true) {
  if (sensorCarro.temCarro) {
    portao.abrir();
    luz.ligar();
  } else {
    portao.fechar();
    luz.desligar();
  }
  esperar(100);
}`,
`let abertaPor = 0;
forno.assar(3000);
while (true) {
  if (geladeira.portaAberta) {
    if (abertaPor > 2000) alarme.tocar();
    abertaPor += 100;
  } else {
    abertaPor = 0;
    alarme.parar();
  }
  esperar(100);
}`,
`while (true) {
  let verdePor = 0;
  while (!botao.pressionado && verdePor < 5000) {
    esperar(100);
    verdePor += 100;
  }
  semaforo.mudar("amarelo");
  esperar(1000);
  semaforo.mudar("vermelho");
  esperar(2500);
  semaforo.mudar("verde");
}`,
`while (true) {
  if (sensorUmidade.valor < 30 && sensorDia.dia) {
    aspersor.ligar();
  } else {
    aspersor.desligar();
  }
  esperar(100);
}`,
];
const estado = (dispositivo: string, propriedade: string, valor: boolean | number | string, noTempo: number): Validador => ({ tipo: "estadoNaCena", dispositivo, propriedade, valor, noTempo });
const todos = (...validadores: Validador[]): Validador => ({ tipo: "todos", validadores });
const garagem = (chega: number): Validador => todos(
  estado("portao", "aberto", false, chega - 100),
  estado("portao", "aberto", true, chega + 100),
  estado("portao", "aberto", true, chega + 2100),
  estado("sensorCarro", "temCarro", false, chega + 2300),
  estado("portao", "aberto", false, chega + 2300),
  estado("luz", "ligada", true, chega + 100),
  estado("luz", "ligada", false, chega + 2300),
  { tipo: "reagiu", quando: { dispositivo: "sensorCarro", propriedade: "temCarro", valor: true }, entao: { dispositivo: "portao", acao: "abrir" }, prazoMs: 100 },
  { tipo: "reagiu", quando: { dispositivo: "sensorCarro", propriedade: "temCarro", valor: false }, entao: { dispositivo: "portao", acao: "fechar" }, prazoMs: 100 },
  { tipo: "sequenciaNaCena", dispositivo: "portao", exata: true, eventos: [{ acao: "abrir", aposMs: chega, toleranciaMs: 100 }, { acao: "fechar", aposMs: 2200, toleranciaMs: 100 }] },
);
const cozinha = (abriu: number, fechou: number): Validador => todos(
  estado("alarme", "tocando", false, abriu + 2000),
  estado("alarme", "tocando", true, abriu + 2200),
  estado("alarme", "tocando", false, fechou + 100),
  { tipo: "sequenciaNaCena", dispositivo: "alarme", exata: true, eventos: [{ acao: "tocar", aposMs: abriu + 2100, toleranciaMs: 100 }, { acao: "parar", aposMs: fechou - abriu - 2100, toleranciaMs: 100 }] },
);
const esquina = (amarelo: number): Validador => todos(
  estado("semaforo", "cor", "verde", amarelo - 100),
  estado("semaforo", "cor", "amarelo", amarelo + 100),
  estado("semaforo", "cor", "amarelo", amarelo + 900),
  estado("semaforo", "cor", "vermelho", amarelo + 1100),
  estado("semaforo", "cor", "vermelho", amarelo + 3400),
  estado("semaforo", "cor", "verde", amarelo + 3600),
  { tipo: "sequenciaNaCena", dispositivo: "semaforo", eventos: [{ acao: "mudar", aposMs: amarelo, toleranciaMs: 100 }, { acao: "mudar", aposMs: 1000, toleranciaMs: 0 }, { acao: "mudar", aposMs: 2500, toleranciaMs: 0 }] },
);
const secoDeDia = todos(estado("aspersor", "ligado", false, 1000), estado("aspersor", "ligado", false, 3500), estado("aspersor", "ligado", true, 3700), estado("aspersor", "ligado", false, 7100), { tipo: "sequenciaNaCena", dispositivo: "aspersor", exata: true, eventos: [{ acao: "ligar", aposMs: 3600, toleranciaMs: 100 }, { acao: "desligar", aposMs: 3400, toleranciaMs: 100 }] });
const amanheceu = todos(estado("aspersor", "ligado", false, 4000), estado("aspersor", "ligado", true, 4600), estado("aspersor", "ligado", false, 7100), { tipo: "sequenciaNaCena", dispositivo: "aspersor", exata: true, eventos: [{ acao: "ligar", aposMs: 4500, toleranciaMs: 100 }, { acao: "desligar", aposMs: 2500, toleranciaMs: 0 }] });
const semAcao = (dispositivo: string, propriedade: string, acao: string): Validador => todos(estado(dispositivo, propriedade, false, 9500), { tipo: "nao", validador: { tipo: "sequenciaNaCena", dispositivo, eventos: [{ acao }] } });
const validadores: Validador[] = [
  { tipo: "variosCenarios", linhasDoTempo: CHEGADAS_GARAGEM, validador: estado("portao", "aberto", false, 9500), porLinha: [1000, 3500, 5500].map(garagem) },
  { tipo: "variosCenarios", linhasDoTempo: PORTAS_COZINHA, validador: estado("alarme", "tocando", false, 9500), porLinha: [cozinha(1000, 6500), cozinha(3500, 8500), semAcao("alarme", "tocando", "tocar")] },
  { tipo: "variosCenarios", linhasDoTempo: PEDIDOS_ESQUINA, validador: estado("semaforo", "cor", "verde", 0), porLinha: [1500, 3000, 5000].map(esquina) },
  { tipo: "variosCenarios", linhasDoTempo: CLIMAS_ESTUFA, validador: estado("aspersor", "ligado", false, 9500), porLinha: [secoDeDia, amanheceu, semAcao("aspersor", "ligado", "ligar")] },
];
const missoes = [
  ["A garagem espera o carro", "Abra o portão quando o carro chegar. Feche e apague a luz só depois que ele entrar.", "O sensor fica true durante toda a entrada. O carro espera o portão abrir inteiro e depois passa sozinho.", "Leia sensorCarro.temCarro dentro do while. Se for true, abra e acenda; senão, feche e apague."],
  ["A porta esquecida", "Toque o alarme após mais de 2 s de porta aberta. Pare e zere a contagem quando fechar.", "Uma abertura curta não deve tocar. Se fechar e abrir de novo, a contagem recomeça. O forno aceita assar(3000).", "Some 100 por volta com esperar(100). Antes de somar, teste se abertaPor > 2000; fechou, zere e pare."],
  ["A vez de atravessar", "Mantenha verde por até 5 s; botão antecipa. Depois: amarelo 1 s, vermelho 2,5 s, verde novamente.", "As cores grandes são dos carros. No vermelho, o sinal menor libera o pedestre; ele atravessa sozinho.", "Enquanto o botão estiver solto e o tempo for menor que 5000, espere 100 e conte. Depois execute as três cores."],
  ["Água na hora certa", "Ligue o aspersor com umidade menor que 30, só de dia. Desligue nas outras situações.", "A terra seca aos poucos. Nos testes ela pode já estar seca à noite, amanhecer depois ou continuar úmida.", "Use sensorUmidade.valor < 30 && sensorDia.dia dentro do loop. No else, aspersor.desligar()."],
];
const cenas: DadosCena[] = [CENA_GARAGEM, CENA_COZINHA, CENA_ESQUINA, CENA_ESTUFA];
export const FASES_CENAS_NOVAS: FasePratica[] = cenas.map((cena, i) => ({
  id: `lab-cenas-novas-u1-f${i + 1}`, unidadeId: "lab-cenas-novas-u1", tipo: "pratica", titulo: missoes[i][0],
  conceitos: ["elemento"], revisa: [], prerequisitos: [], areas: ["cena", "snippet", "palco"], cena,
  usaFerramentas: ["cena", "ficha-dispositivo", "velocidade-simulacao", "snippet", "console", "palco-memoria", "linha-do-tempo"],
  siteAlvo: SITE_DO_PROGRAMA, programa: { snippet: { nome: `${cena.ambiente}.js`, codigoInicial: "// Toque nos aparelhos para conhecer seus comandos.\n" } },
  introducao: [{ texto: missoes[i][2], expressao: "curioso" }],
  objetivos: [{
    id: "missao", tipo: "acao", modo: "guiado", enunciado: { mouse: missoes[i][1], toque: missoes[i][1] },
    validador: validadores[i],
    ajudas: { pergunta: "O programa precisa reagir ao que mudou ou apenas esperar um horário fixo?", dica: missoes[i][3], linha: { alvo: "snippet", linhas: [1], fala: "Leia os aparelhos, decida e use esperar(100) para o tempo passar." }, solucao: { fala: "Este programa reage às leituras em todos os testes.", acoes: [{ tipo: "definirSnippet", codigo: SOLUCOES_CENAS_NOVAS[i] }, { tipo: "executarSnippet" }] } },
    solucaoDeTeste: [{ tipo: "definirSnippet", codigo: SOLUCOES_CENAS_NOVAS[i] }, { tipo: "executarSnippet" }],
    falaAoConcluir: { texto: "Funcionou nos três cenários! Troque o Teste e rebobine para conferir cada reação.", expressao: "comemorando" },
  }],
  conclusao: [{ texto: "As entradas mudaram; sua regra continuou funcionando.", expressao: "feliz" }],
  falaFinal: { texto: "Abra a ficha de um aparelho e veja o Por dentro. Depois experimente outra regra.", expressao: "curioso" },
}));
export const UNIDADE_CENAS_NOVAS: Unidade = {
  id: "lab-cenas-novas-u1", ilha: "Laboratório", zona: "Bancada dos ambientes", numero: 1, titulo: "Quatro lugares, quatro missões",
  meta: { enunciado: "Automatize a garagem, cuide da geladeira, libere a travessia e regue de dia." }, fases: FASES_CENAS_NOVAS.map(f => f.id),
};
