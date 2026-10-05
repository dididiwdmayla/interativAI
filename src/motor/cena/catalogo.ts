/*
 * O catálogo dos dispositivos das cenas: o que cada tipo é, o estado do
 * começo, os comandos e as propriedades que o código usa, a ficha (o
 * manual que o aluno abre tocando no dispositivo) e o "por dentro" (o
 * caminho do comando até o mundo real, ligando com a trilha Automação).
 *
 * Dado puro: o executor (os objetos no reino do código), a ficha da tela,
 * os validadores e as checagens leem daqui. Um tipo novo entra aqui, no
 * motor (motor.ts) e no kit de desenho (src/componentes/cena/kit).
 */
import type { ValorCena } from "./modelo";

export const TIPOS_DISPOSITIVO = ["lampada", "sensor", "interruptor", "portao", "letreiro", "forno", "ventilador", "relogio", "campainha", "sensorCarro", "geladeira", "alarme", "semaforo", "botao", "aspersor", "sensorUmidade", "sensorDia"] as const;

export type TipoDispositivo = (typeof TIPOS_DISPOSITIVO)[number];

export function ehTipoDispositivo(valor: unknown): valor is TipoDispositivo {
  return typeof valor === "string" && (TIPOS_DISPOSITIVO as readonly string[]).includes(valor);
}

/** Uma propriedade que o código lê (e, se `escreve`, troca com `=`). */
export type PropriedadeDispositivo = {
  nome: string;
  tipo: "booleano" | "número" | "texto";
  /** O código pode trocar com `dispositivo.nome = valor`. */
  escreve: boolean;
  /** Vem do mundo (sensor, linha do tempo) ou é calculada: o código só lê. */
  doMundo: boolean;
  explicacao: string;
  /** (Número) A faixa que vale. */
  faixa?: [number, number];
  entradaTemporal?: boolean;
};

export type ComandoDispositivo = { nome: string; assinatura: string; explicacao: string; efeito?: { propriedade: string; valor?: ValorCena; argumento?: { valores: ValorCena[] } } };

/** Uma etapa do caminho do comando (o "por dentro"): a peça e o que ela faz. */
export type EtapaPorDentro = { peca: "codigo" | "placa" | "rele" | "driver" | "motor" | "resistencia" | "termometro" | "display" | "sensor" | "contato" | "dispositivo"; texto: string };

export type FichaDispositivo = {
  tipo: TipoDispositivo;
  /** "Lâmpada", "Sensor de presença". */
  nome: string;
  /** O nome da classe, como o Console mostra o objeto: Lampada {ligada: false, brilho: 100}. */
  classe: string;
  /** Entrada (o código lê o mundo) ou saída (o código manda no mundo). */
  sentido: "entrada" | "saida";
  /** 1 frase: o que ele faz. */
  oQueFaz: string;
  comandos: ComandoDispositivo[];
  propriedades: PropriedadeDispositivo[];
  /** Um exemplo curto, com o nome que o dispositivo tem na cena. */
  exemplo: (nome: string) => string;
  /** O estado do começo (o que o código controla). */
  inicial: Record<string, ValorCena>;
  /** O caminho do comando, em linguagem simples (3 a 5 etapas). */
  porDentro: EtapaPorDentro[];
};

/** Quantas letras cabem no letreiro. */
export const LETRAS_DO_LETREIRO = 16;

/** O fim de todo "por dentro": a ponte com a trilha Automação. */
export const FIM_POR_DENTRO = "Na trilha Automação você monta isso de verdade.";

export const CATALOGO_DISPOSITIVOS: Record<TipoDispositivo, FichaDispositivo> = {
  sensorCarro: {
    tipo: "sensorCarro", nome: "Sensor de carro", classe: "SensorCarro", sentido: "entrada",
    oQueFaz: "Detecta um carro esperando na entrada.", comandos: [],
    propriedades: [{ nome: "temCarro", tipo: "booleano", escreve: false, doMundo: true, entradaTemporal: true,  explicacao: "Detecta um carro esperando na entrada." }],
    inicial: { temCarro: false }, exemplo: nome => `console.log(${nome}.temCarro);`,
    porDentro: [{ peca: "sensor", texto: "O laço no piso detecta a presença de metal." }, { peca: "placa", texto: "A plaquinha converte a leitura em um valor para o programa." }, { peca: "codigo", texto: "O código lê temCarro e decide o que fazer." }, { peca: "dispositivo", texto: "A leitura acompanha o estado do dispositivo no mundo." }],
  },
  geladeira: {
    tipo: "geladeira", nome: "Geladeira", classe: "Geladeira", sentido: "entrada",
    oQueFaz: "Informa se a porta está aberta.", comandos: [],
    propriedades: [{ nome: "portaAberta", tipo: "booleano", escreve: false, doMundo: true, entradaTemporal: true,  explicacao: "Informa se a porta está aberta." }],
    inicial: { portaAberta: false }, exemplo: nome => `console.log(${nome}.portaAberta);`,
    porDentro: [{ peca: "sensor", texto: "Um contato magnético percebe se a porta encostou." }, { peca: "placa", texto: "A plaquinha converte a leitura em um valor para o programa." }, { peca: "codigo", texto: "O código lê portaAberta e decide o que fazer." }, { peca: "dispositivo", texto: "A leitura acompanha o estado do dispositivo no mundo." }],
  },
  botao: {
    tipo: "botao", nome: "Botão de pedestre", classe: "Botao", sentido: "entrada",
    oQueFaz: "Vale true enquanto alguém segura o botão.", comandos: [],
    propriedades: [{ nome: "pressionado", tipo: "booleano", escreve: false, doMundo: true, entradaTemporal: true,  explicacao: "Vale true enquanto alguém segura o botão." }],
    inicial: { pressionado: false }, exemplo: nome => `console.log(${nome}.pressionado);`,
    porDentro: [{ peca: "sensor", texto: "O contato fecha enquanto o dedo aperta." }, { peca: "placa", texto: "A plaquinha converte a leitura em um valor para o programa." }, { peca: "codigo", texto: "O código lê pressionado e decide o que fazer." }, { peca: "dispositivo", texto: "A leitura acompanha o estado do dispositivo no mundo." }],
  },
  sensorUmidade: {
    tipo: "sensorUmidade", nome: "Sensor de umidade", classe: "SensorUmidade", sentido: "entrada",
    oQueFaz: "Mede a umidade da terra, de 0 a 100.", comandos: [],
    propriedades: [{ nome: "valor", tipo: "número", escreve: false, doMundo: true, entradaTemporal: true, faixa: [0, 100], explicacao: "Mede a umidade da terra, de 0 a 100." }],
    inicial: { valor: 65 }, exemplo: nome => `console.log(${nome}.valor);`,
    porDentro: [{ peca: "sensor", texto: "A sonda mede uma propriedade elétrica que varia com a água na terra." }, { peca: "placa", texto: "A plaquinha converte a leitura em um valor para o programa." }, { peca: "codigo", texto: "O código lê valor e decide o que fazer." }, { peca: "dispositivo", texto: "A leitura acompanha o estado do dispositivo no mundo." }],
  },
  sensorDia: {
    tipo: "sensorDia", nome: "Sensor de luz do dia", classe: "SensorDia", sentido: "entrada",
    oQueFaz: "Informa se há luz do dia para regar.", comandos: [],
    propriedades: [{ nome: "dia", tipo: "booleano", escreve: false, doMundo: true, entradaTemporal: true,  explicacao: "Informa se há luz do dia para regar." }],
    inicial: { dia: true }, exemplo: nome => `console.log(${nome}.dia);`,
    porDentro: [{ peca: "sensor", texto: "Um sensor de luz percebe a claridade externa." }, { peca: "placa", texto: "A plaquinha converte a leitura em um valor para o programa." }, { peca: "codigo", texto: "O código lê dia e decide o que fazer." }, { peca: "dispositivo", texto: "A leitura acompanha o estado do dispositivo no mundo." }],
  },
  alarme: {
    tipo: "alarme", nome: "Alarme", classe: "Alarme", sentido: "saida", oQueFaz: "Avisa enquanto a porta fica aberta por tempo demais.",
    comandos: [{ nome: "tocar", assinatura: "tocar()", explicacao: "Ativa o dispositivo.", efeito: { propriedade: "tocando", valor: true } }, { nome: "parar", assinatura: "parar()", explicacao: "Desativa o dispositivo.", efeito: { propriedade: "tocando", valor: false } }],
    propriedades: [{ nome: "tocando", tipo: "booleano", escreve: false, doMundo: false, explicacao: "true enquanto está ativo." }],
    inicial: { tocando: false }, exemplo: nome => `${nome}.tocar();\nesperar(1000);\n${nome}.parar();`,
    porDentro: [{ peca: "codigo", texto: "O programa manda tocar()." }, { peca: "placa", texto: "A plaquinha envia a ordem para o circuito de saída." }, { peca: "driver", texto: "O circuito entrega energia ao componente." }, { peca: "dispositivo", texto: "Um pequeno alto-falante vibra; nesta cena o aviso também pulsa." }],
  },
  aspersor: {
    tipo: "aspersor", nome: "Aspersor", classe: "Aspersor", sentido: "saida", oQueFaz: "Libera água sobre os canteiros quando recebe a ordem.",
    comandos: [{ nome: "ligar", assinatura: "ligar()", explicacao: "Ativa o dispositivo.", efeito: { propriedade: "ligado", valor: true } }, { nome: "desligar", assinatura: "desligar()", explicacao: "Desativa o dispositivo.", efeito: { propriedade: "ligado", valor: false } }],
    propriedades: [{ nome: "ligado", tipo: "booleano", escreve: false, doMundo: false, explicacao: "true enquanto está ativo." }],
    inicial: { ligado: false }, exemplo: nome => `${nome}.ligar();\nesperar(1000);\n${nome}.desligar();`,
    porDentro: [{ peca: "codigo", texto: "O programa manda ligar()." }, { peca: "placa", texto: "A plaquinha envia a ordem para o circuito de saída." }, { peca: "driver", texto: "O circuito entrega energia ao componente." }, { peca: "dispositivo", texto: "Uma válvula abre a passagem de água para o aspersor." }],
  },
  semaforo: {
    tipo: "semaforo", nome: "Semáforo", classe: "Semaforo", sentido: "saida",
    oQueFaz: "Controla a passagem dos carros: vermelho dá a vez ao pedestre; amarelo avisa antes da parada.",
    comandos: [{ nome: "mudar", assinatura: 'mudar("verde")', explicacao: "Escolhe verde, amarelo ou vermelho.", efeito: { propriedade: "cor", argumento: { valores: ["verde", "amarelo", "vermelho"] } } }],
    propriedades: [{ nome: "cor", tipo: "texto", escreve: false, doMundo: false, explicacao: "A cor acesa para os carros. O sinal de pedestre mostra a passagem correspondente." }],
    inicial: { cor: "verde" }, exemplo: nome => `${nome}.mudar("amarelo");\nesperar(1000);\n${nome}.mudar("vermelho");`,
    porDentro: [{ peca: "codigo", texto: "O programa escolhe a cor com mudar()." }, { peca: "placa", texto: "A plaquinha desliga as outras saídas e seleciona uma." }, { peca: "driver", texto: "O circuito alimenta o conjunto de LEDs escolhido." }, { peca: "dispositivo", texto: "O semáforo acende a cor e o sinal de pedestre correspondente." }],
  },
  lampada: {
    tipo: "lampada",
    nome: "Lâmpada",
    classe: "Lampada",
    sentido: "saida",
    oQueFaz: "Acende e apaga quando o código manda, e o brilho regula a força da luz.",
    comandos: [
      { nome: "ligar", assinatura: "ligar()", explicacao: "Acende a lâmpada." },
      { nome: "desligar", assinatura: "desligar()", explicacao: "Apaga a lâmpada." },
    ],
    propriedades: [
      { nome: "ligada", tipo: "booleano", escreve: false, doMundo: false, explicacao: "true se está acesa agora." },
      { nome: "brilho", tipo: "número", escreve: true, doMundo: false, faixa: [0, 100], explicacao: "A força da luz quando acesa, de 0 a 100." },
    ],
    exemplo: (nome) => `${nome}.ligar();\nesperar(1000);\n${nome}.desligar();`,
    inicial: { ligada: false, brilho: 100 },
    porDentro: [
      { peca: "codigo", texto: "O código manda a ordem: ligar()." },
      { peca: "placa", texto: "Uma plaquinha (um microcontrolador) recebe a ordem e liga um dos pinos dela." },
      { peca: "rele", texto: "O pino aciona um relé: um interruptor que a eletricidade aperta sozinha." },
      { peca: "dispositivo", texto: "O relé fecha o circuito e a lâmpada acende." },
    ],
  },
  sensor: {
    tipo: "sensor",
    nome: "Sensor de presença",
    classe: "SensorPresenca",
    sentido: "entrada",
    oQueFaz: "Percebe quando tem alguém perto. O código só lê: quem muda é o mundo.",
    comandos: [],
    propriedades: [{ nome: "temGente", tipo: "booleano", escreve: false, doMundo: true, explicacao: "true enquanto alguém está perto do sensor." }],
    exemplo: (nome) => `if (${nome}.temGente) {\n  console.log("Chegou alguém!");\n}`,
    inicial: {},
    porDentro: [
      { peca: "sensor", texto: "O sensor percebe o calor do corpo de uma pessoa (luz infravermelha, que o olho não vê)." },
      { peca: "contato", texto: "Ele muda a eletricidade num fio: ligado quando tem gente." },
      { peca: "placa", texto: "A plaquinha lê esse fio num dos pinos dela, muitas vezes por segundo." },
      { peca: "codigo", texto: "O código lê o resultado: temGente vira true." },
    ],
  },
  interruptor: {
    tipo: "interruptor",
    nome: "Interruptor",
    classe: "Interruptor",
    sentido: "entrada",
    oQueFaz: "Muda de posição quando alguém aperta. O código só lê a posição.",
    comandos: [],
    propriedades: [{ nome: "ligado", tipo: "booleano", escreve: false, doMundo: true, explicacao: "true quando está na posição ligado." }],
    exemplo: (nome) => `if (${nome}.ligado) {\n  console.log("Apertaram!");\n}`,
    inicial: { ligado: false },
    porDentro: [
      { peca: "contato", texto: "Apertar o interruptor encosta duas plaquinhas de metal: o contato fecha." },
      { peca: "placa", texto: "A plaquinha (o microcontrolador) lê esse contato num dos pinos dela." },
      { peca: "codigo", texto: "O código lê o resultado: ligado vira true." },
    ],
  },
  portao: {
    tipo: "portao",
    nome: "Portão",
    classe: "Portao",
    sentido: "saida",
    oQueFaz: "Abre e fecha deslizando quando o código manda.",
    comandos: [
      { nome: "abrir", assinatura: "abrir()", explicacao: "Desliza o portão até abrir." },
      { nome: "fechar", assinatura: "fechar()", explicacao: "Desliza o portão de volta até fechar." },
    ],
    propriedades: [{ nome: "aberto", tipo: "booleano", escreve: false, doMundo: false, explicacao: "true se está aberto (ou abrindo)." }],
    exemplo: (nome) => `${nome}.abrir();\nesperar(3000);\n${nome}.fechar();`,
    inicial: { aberto: false },
    porDentro: [
      { peca: "codigo", texto: "O código manda a ordem: abrir()." },
      { peca: "placa", texto: "A plaquinha (o microcontrolador) avisa o driver do motor para que lado girar." },
      { peca: "motor", texto: "O motor gira e uma engrenagem empurra o portão pelo trilho." },
      { peca: "dispositivo", texto: "Um sensor no fim do trilho avisa quando ele abriu inteiro, e o motor para." },
    ],
  },
  letreiro: {
    tipo: "letreiro",
    nome: "Letreiro",
    classe: "Letreiro",
    sentido: "saida",
    oQueFaz: "Mostra um texto curto com luzinhas, letra por letra.",
    comandos: [
      { nome: "mostrar", assinatura: "mostrar(texto)", explicacao: "Acende o texto no letreiro (até 16 letras; o resto não cabe)." },
      { nome: "apagar", assinatura: "apagar()", explicacao: "Apaga o letreiro." },
    ],
    propriedades: [{ nome: "texto", tipo: "texto", escreve: false, doMundo: false, explicacao: "O texto que está aceso agora (vazio quando apagado)." }],
    exemplo: (nome) => `${nome}.mostrar("ABERTO");`,
    inicial: { texto: "" },
    porDentro: [
      { peca: "codigo", texto: "O código manda o texto: mostrar(\"ABERTO\")." },
      { peca: "placa", texto: "A plaquinha (o microcontrolador) transforma cada letra num desenho de pontinhos." },
      { peca: "display", texto: "Ela acende os pontinhos de luz (LEDs) do letreiro, uma coluna de cada vez, rápido demais para o olho ver." },
    ],
  },
  forno: {
    tipo: "forno",
    nome: "Forno",
    classe: "Forno",
    sentido: "saida",
    oQueFaz: "Esquenta enquanto está ligado e esfria desligado; o termômetro dele conta a temperatura.",
    comandos: [
      { nome: "assar", assinatura: "assar(ms)", explicacao: "Liga e desliga sozinho ao terminar o timer (1 a 60000 ms)." },
      { nome: "ligar", assinatura: "ligar()", explicacao: "Liga a resistência: o forno começa a esquentar." },
      { nome: "desligar", assinatura: "desligar()", explicacao: "Desliga a resistência: o forno esfria aos poucos." },
    ],
    propriedades: [
      { nome: "restante", tipo: "número", escreve: false, doMundo: true, explicacao: "Milissegundos que faltam no timer, ou zero." },
      { nome: "ligado", tipo: "booleano", escreve: false, doMundo: false, explicacao: "true se a resistência está ligada." },
      { nome: "temperatura", tipo: "número", escreve: false, doMundo: true, explicacao: "Quantos graus o forno está agora (sobe uns 40 por segundo ligado)." },
    ],
    exemplo: (nome) => `${nome}.ligar();\nwhile (${nome}.temperatura < 180) {\n  esperar(500);\n}\nconsole.log("Pronto pra assar!");`,
    inicial: { ligado: false },
    porDentro: [
      { peca: "codigo", texto: "O código manda a ordem: ligar()." },
      { peca: "placa", texto: "A plaquinha (o microcontrolador) liga um pino." },
      { peca: "rele", texto: "O pino aciona um relé, que liga a resistência: um fio que esquenta quando a eletricidade passa." },
      { peca: "termometro", texto: "Um sensor de temperatura conta de volta quantos graus o forno está: é o temperatura do código." },
    ],
  },
  ventilador: {
    tipo: "ventilador",
    nome: "Ventilador",
    classe: "Ventilador",
    sentido: "saida",
    oQueFaz: "Gira as pás na velocidade que o código escolhe, de 0 (parado) a 3.",
    comandos: [{ nome: "desligar", assinatura: "desligar()", explicacao: "Para o ventilador (velocidade 0)." }],
    propriedades: [{ nome: "velocidade", tipo: "número", escreve: true, doMundo: false, faixa: [0, 3], explicacao: "De 0 (parado) a 3 (o mais rápido). Troque com =." }],
    exemplo: (nome) => `${nome}.velocidade = 2;\nesperar(2000);\n${nome}.desligar();`,
    inicial: { velocidade: 0 },
    porDentro: [
      { peca: "codigo", texto: "O código escolhe a velocidade: velocidade = 2." },
      { peca: "placa", texto: "A plaquinha (o microcontrolador) manda pulsos de eletricidade bem rápidos: quanto mais longos, mais força." },
      { peca: "driver", texto: "Um driver de motor recebe os pulsos e entrega a força que o motor precisa." },
      { peca: "motor", texto: "O motor gira as pás mais rápido ou mais devagar." },
    ],
  },
  relogio: {
    tipo: "relogio",
    nome: "Relógio",
    classe: "Relogio",
    sentido: "entrada",
    oQueFaz: "Conta as horas do dia na cena (cada hora passa em 2 segundos). O código só lê.",
    comandos: [],
    propriedades: [{ nome: "hora", tipo: "número", escreve: false, doMundo: true, explicacao: "A hora cheia de agora, de 0 a 23 (às 7h30, vale 7)." }],
    exemplo: (nome) => `if (${nome}.hora >= 7) {\n  console.log("Já abriu!");\n}`,
    inicial: { hora: 6 },
    porDentro: [
      { peca: "placa", texto: "Dentro da plaquinha (o microcontrolador), um cristal de quartzo vibra sempre no mesmo ritmo." },
      { peca: "contato", texto: "Ela conta as vibrações: tantas vibrações fazem um segundo, tantos segundos fazem uma hora." },
      { peca: "codigo", texto: "O código lê a conta pronta: hora vira 7 quando dá sete horas." },
    ],
  },
  campainha: {
    tipo: "campainha",
    nome: "Campainha",
    classe: "Campainha",
    sentido: "saida",
    oQueFaz: "Toca um plim curto cada vez que o código manda: bom para avisar alguém.",
    comandos: [{ nome: "tocar", assinatura: "tocar()", explicacao: "Toca a campainha uma vez." }],
    propriedades: [{ nome: "toques", tipo: "número", escreve: false, doMundo: false, explicacao: "Quantas vezes ela já tocou nesta simulação." }],
    exemplo: (nome) => `${nome}.tocar();`,
    inicial: { toques: 0 },
    porDentro: [
      { peca: "codigo", texto: "O código manda a ordem: tocar()." },
      { peca: "placa", texto: "A plaquinha (o microcontrolador) liga um pino por um instante." },
      { peca: "rele", texto: "O pino aciona um relé, que manda eletricidade para uma bobina: ela vira um ímã." },
      { peca: "dispositivo", texto: "O ímã puxa um martelinho, que bate no sino: plim!" },
    ],
  },
};

/** A ficha do tipo. */
export function fichaDoTipo(tipo: TipoDispositivo): FichaDispositivo {
  return CATALOGO_DISPOSITIVOS[tipo];
}

/** As propriedades que um tipo tem (as do estado e as do mundo). */
export function propriedadesDoTipo(tipo: TipoDispositivo): string[] {
  return CATALOGO_DISPOSITIVOS[tipo].propriedades.map((p) => p.nome);
}

/**
 * As ações que aparecem no rastro de um tipo (o nome do que aconteceu,
 * usado pelos validadores sequenciaNaCena e reagiu).
 */
export const ACOES_DO_TIPO: Record<TipoDispositivo, readonly string[]> = {
  sensorCarro: [], geladeira: [], botao: [], sensorUmidade: [], sensorDia: [],
  alarme: ["tocar", "parar"], aspersor: ["ligar", "desligar"], semaforo: ["mudar"],
  lampada: ["ligar", "desligar", "brilho"],
  sensor: [],
  interruptor: [],
  portao: ["abrir", "fechar"],
  letreiro: ["mostrar", "apagar"],
  forno: ["ligar", "desligar", "assar"],
  ventilador: ["velocidade", "desligar"],
  relogio: [],
  campainha: ["tocar"],
};

/** Nomes que um dispositivo não pode ter (já existem no reino do código ou no jogo). */
export const NOMES_RESERVADOS = new Set([
  "esperar",
  "console",
  "Math",
  "JSON",
  "Date",
  "Object",
  "Array",
  "String",
  "Number",
  "Boolean",
  "globalThis",
  "window",
  "self",
  "undefined",
  "NaN",
  "Infinity",
  "eval",
  // Nomes que o Web Worker e a janela já têm (o dispositivo não conseguiria morar neles).
  "name",
  "location",
  "top",
  "parent",
  "status",
  "length",
  "origin",
  "navigator",
  "performance",
  "crypto",
  "close",
  "open",
  "print",
  "event",
  "history",
  "screen",
  "frames",
  "document",
  "fetch",
]);
