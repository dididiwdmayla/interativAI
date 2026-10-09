/*
 * Levar pro mundo (a saída de uma ilha com código): o programa do aluno num
 * arquivo .js que roda FORA do jogo, no Console de qualquer navegador e no
 * Node. Junto vai uma versão simples dos dispositivos da cena: em vez de
 * acender luzes e ligar fornos de verdade, eles escrevem no console o que
 * fariam ("[07:00] Luz da vitrine: ligada"), no relógio simulado da cena
 * (esperar não espera de verdade: só avança o tempo). Os acontecimentos da
 * linha do tempo (alguém chega, alguém vai embora) também aparecem.
 *
 * O arquivo é JavaScript simples (ES2017, sem import nem nada do jogo), com
 * as instruções curtas no topo. Puro: o jogo baixa, os testes rodam no Node e
 * no navegador.
 */
import { CATALOGO_DISPOSITIVOS, LETRAS_DO_LETREIRO, LETRAS_DO_VISOR, TELA_APP } from "../cena/catalogo";
import { type AcontecimentoCena, type DadosCena, type DispositivoCena, FORNO, RELOGIO } from "../cena/modelo";
import { clienteDe } from "./clientes";
import type { DadosContrato } from "./modelo";

/** O nome do dispositivo fora do código: o da cena ou o do tipo. */
function nomeDe(dispositivo: DispositivoCena): string {
  return dispositivo.nome ?? CATALOGO_DISPOSITIVOS[dispositivo.tipo].nome;
}

type Acontecimento = { ms: number; texto: string; tipo: "chega" | "sai" | "aperta" | "entrada"; dispositivo?: string };

/** Os acontecimentos da linha do tempo, em ordem, com a frase de cada um. */
function acontecimentos(cena: DadosCena): Acontecimento[] {
  const lista = cena.linhaDoTempo.flatMap((item: AcontecimentoCena): Acontecimento[] => {
    if (item.tipo === "pessoa") {
      return [
        { ms: item.chegaMs, texto: "Chegou alguém.", tipo: "chega" },
        ...(item.saiMs !== undefined ? [{ ms: item.saiMs, texto: "Alguém foi embora.", tipo: "sai" as const }] : []),
      ];
    }
    if (item.tipo === undefined) {
      return [{ ms: "em" in item ? item.em : item.de, tipo: "entrada", dispositivo: item.dispositivo, texto: `${item.dispositivo}.${item.propriedade}: ${"em" in item ? String(item.valor) : `${item.valorInicial} a ${item.valorFinal}`}` }];
    }
    const alvo = cena.dispositivos.find((d) => d.id === item.dispositivo);
    return [{ ms: item.noMs, texto: `Alguém apertou ${alvo ? nomeDe(alvo).toLowerCase() : item.dispositivo}.`, tipo: "aperta", dispositivo: item.dispositivo }];
  });
  return lista.sort((a, b) => a.ms - b.ms);
}

const js = (valor: unknown) => JSON.stringify(valor);

/** A criação de um dispositivo no arquivo (o objeto com os mesmos comandos e propriedades do jogo). */
function criarDispositivo(dispositivo: DispositivoCena): string {
  const nome = js(nomeDe(dispositivo));
  const inicial = { ...CATALOGO_DISPOSITIVOS[dispositivo.tipo].inicial, ...(dispositivo.inicial ?? {}) };
  const ini = (chave: string) => js(inicial[chave]);
  switch (dispositivo.tipo) {
    case "sensorCarro": case "geladeira": case "botao": case "sensorUmidade": case "sensorDia": case "alarme": case "aspersor": case "semaforo":
      return `aparelhoGenerico(${nome}, ${js(dispositivo.id)}, ${js(inicial)}, ${js(CATALOGO_DISPOSITIVOS[dispositivo.tipo])})`;
    case "lampada":
      return `lampada(${nome}, ${ini("ligada")}, ${ini("brilho")})`;
    case "sensor":
      return `sensor(${nome})`;
    case "interruptor":
      return `interruptor(${nome}, ${js(dispositivo.id)}, ${ini("ligado")})`;
    case "portao":
      return `portao(${nome}, ${ini("aberto")})`;
    case "letreiro":
      return `letreiro(${nome}, ${ini("texto")})`;
    case "forno":
      return `forno(${nome}, ${ini("ligado")})`;
    case "ventilador":
      return `ventilador(${nome}, ${ini("velocidade")})`;
    case "relogio":
      return `relogio(${ini("hora")})`;
    case "campainha":
      return `campainha(${nome})`;
    case "registradora":
      return `registradora(${nome}, ${ini("texto")})`;
    case "telaApp":
      return `telaApp(${nome})`;
  }
}

/** As fábricas dos dispositivos (só as dos tipos que a cena usa entram no arquivo). */
const GENERICA = `
  function aparelhoGenerico(nome, id, inicial, ficha) {
    var estado = Object.assign({}, inicial), objeto = {};
    ficha.comandos.forEach(function (comando) {
      if (!comando.efeito) throw new Error("Comando sem exportação: " + comando.nome);
      objeto[comando.nome] = function (valor) {
        aindaRoda(); var efeito = comando.efeito;
        if (efeito.argumento && efeito.argumento.valores.indexOf(valor) < 0) throw new RangeError(comando.nome + ": valor inválido " + valor);
        estado[efeito.propriedade] = efeito.argumento ? valor : efeito.valor;
        avisar(nome + ": " + comando.nome + (efeito.argumento ? " " + valor : ""));
      };
    });
    ficha.propriedades.forEach(function (p) {
      Object.defineProperty(objeto, p.nome, { enumerable: true,
        get: function () { aindaRoda(); return p.doMundo ? valorTemporal(id, p.nome, estado[p.nome]) : estado[p.nome]; },
        set: function (valor) { aindaRoda(); if (!p.escreve) soLeitura(p.nome); if (p.faixa) valor = numeroNaFaixa(valor, p.nome, p.faixa[0], p.faixa[1], false); estado[p.nome] = valor; avisar(nome + ": " + p.nome + " " + valor); }
      });
    });
    return objeto;
  }`;

const FABRICAS: Record<DispositivoCena["tipo"], string> = {
  sensorCarro: GENERICA, geladeira: GENERICA, botao: GENERICA,
  sensorUmidade: GENERICA, sensorDia: GENERICA, alarme: GENERICA,
  aspersor: GENERICA, semaforo: GENERICA,
  lampada: `
  function lampada(nome, ligada, brilho) {
    var objeto = {
      ligar: function () { aindaRoda(); if (!ligada) { ligada = true; avisar(nome + ": ligada"); } },
      desligar: function () { aindaRoda(); if (ligada) { ligada = false; avisar(nome + ": desligada"); } }
    };
    Object.defineProperty(objeto, "ligada", { enumerable: true, get: function () { aindaRoda(); return ligada; }, set: function () { soLeitura("ligada", "ligar() ou desligar()"); } });
    Object.defineProperty(objeto, "brilho", {
      enumerable: true,
      get: function () { aindaRoda(); return brilho; },
      set: function (valor) { aindaRoda(); valor = numeroNaFaixa(valor, "brilho", 0, 100, false); if (valor !== brilho) { brilho = valor; avisar(nome + ": brilho " + valor); } }
    });
    return objeto;
  }`,
  sensor: `
  function sensor(nome) {
    var objeto = {};
    Object.defineProperty(objeto, "temGente", { enumerable: true, get: function () { aindaRoda(); return pessoasAgora() > 0; }, set: function () { soLeitura("temGente"); } });
    return objeto;
  }`,
  interruptor: `
  function interruptor(nome, id, ligadoNoComeco) {
    var objeto = {};
    Object.defineProperty(objeto, "ligado", { enumerable: true, get: function () { aindaRoda(); return apertosAte(id) % 2 === 1 ? !ligadoNoComeco : ligadoNoComeco; }, set: function () { soLeitura("ligado"); } });
    return objeto;
  }`,
  portao: `
  function portao(nome, aberto) {
    var objeto = {
      abrir: function () { aindaRoda(); if (!aberto) { aberto = true; avisar(nome + ": abrindo"); } },
      fechar: function () { aindaRoda(); if (aberto) { aberto = false; avisar(nome + ": fechando"); } }
    };
    Object.defineProperty(objeto, "aberto", { enumerable: true, get: function () { aindaRoda(); return aberto; }, set: function () { soLeitura("aberto", "abrir() ou fechar()"); } });
    return objeto;
  }`,
  letreiro: `
  function letreiro(nome, texto) {
    var objeto = {
      mostrar: function (novo) {
        aindaRoda();
        if (novo === undefined) throw new TypeError('mostrar precisa do texto, como mostrar("ABERTO").');
        novo = String(novo).slice(0, ${LETRAS_DO_LETREIRO});
        if (novo !== texto) { texto = novo; avisar(texto ? nome + ': "' + texto + '"' : nome + ": apagado"); }
      },
      apagar: function () { aindaRoda(); if (texto) { texto = ""; avisar(nome + ": apagado"); } }
    };
    Object.defineProperty(objeto, "texto", { enumerable: true, get: function () { aindaRoda(); return texto; }, set: function () { soLeitura("texto", "mostrar(texto) ou apagar()"); } });
    return objeto;
  }`,
  forno: `
  function forno(nome, ligadoNoComeco) {
    var ligado = ligadoNoComeco, desligaEm = 0;
    var trocas = [];
    function temperatura() {
      var graus = ${FORNO.ambiente}, estado = ligadoNoComeco, desde = 0;
      function avancar(ate) {
        var segundos = Math.max(0, ate - desde) / 1000;
        graus = estado ? Math.min(${FORNO.maxima}, graus + ${FORNO.sobePorSegundo} * segundos) : Math.max(${FORNO.ambiente}, graus - ${FORNO.descePorSegundo} * segundos);
        desde = ate;
      }
      for (var i = 0; i < trocas.length; i++) { avancar(trocas[i].ms); estado = trocas[i].ligado; }
      avancar(relogioMs);
      return Math.round(graus);
    }
    var objeto = {
      assar: function (ms) { aindaRoda(); ms = numeroNaFaixa(ms, "assar", 1, 60000, true); objeto.ligar(); desligaEm = relogioMs + ms; var fim = desligaEm; AGENDADOS.push({ ms: fim, fazer: function () { if (desligaEm === fim) objeto.desligar(); } }); avisar(nome + ": assar " + ms + " ms"); },
      ligar: function () { aindaRoda(); desligaEm = 0; if (!ligado) { ligado = true; trocas.push({ ms: relogioMs, ligado: true }); avisar(nome + ": ligado (esquentando)"); } },
      desligar: function () { aindaRoda(); desligaEm = 0; if (ligado) { ligado = false; trocas.push({ ms: relogioMs, ligado: false }); avisar(nome + ": desligado"); } }
    };
    Object.defineProperty(objeto, "ligado", { enumerable: true, get: function () { aindaRoda(); return ligado; }, set: function () { soLeitura("ligado", "ligar() ou desligar()"); } });
    Object.defineProperty(objeto, "restante", { enumerable: true, get: function () { aindaRoda(); return Math.max(0, desligaEm - relogioMs); }, set: function () { soLeitura("restante", "assar(ms)"); } });
    Object.defineProperty(objeto, "temperatura", { enumerable: true, get: function () { aindaRoda(); return temperatura(); }, set: function () { soLeitura("temperatura"); } });
    return objeto;
  }`,
  ventilador: `
  function ventilador(nome, velocidade) {
    var objeto = {
      desligar: function () { aindaRoda(); if (velocidade !== 0) { velocidade = 0; avisar(nome + ": desligado"); } }
    };
    Object.defineProperty(objeto, "velocidade", {
      enumerable: true,
      get: function () { aindaRoda(); return velocidade; },
      set: function (valor) { aindaRoda(); valor = numeroNaFaixa(valor, "velocidade", 0, 3, true); if (valor !== velocidade) { velocidade = valor; avisar(valor === 0 ? nome + ": desligado" : nome + ": velocidade " + valor); } }
    });
    return objeto;
  }`,
  relogio: `
  function relogio(horaNoComeco) {
    var objeto = {};
    Object.defineProperty(objeto, "hora", { enumerable: true, get: function () { aindaRoda(); return (horaNoComeco + Math.floor(relogioMs / ${RELOGIO.msPorHora})) % 24; }, set: function () { soLeitura("hora"); } });
    return objeto;
  }`,
  registradora: `
  function registradora(nome, texto) {
    var objeto = {
      mostrar: function (novo) {
        aindaRoda();
        if (novo === undefined) throw new TypeError('mostrar precisa do texto, como mostrar("R$ 25").');
        novo = String(novo).slice(0, ${LETRAS_DO_VISOR});
        if (novo !== texto) { texto = novo; avisar(texto ? nome + ': "' + texto + '"' : nome + ": apagado"); }
      },
      apagar: function () { aindaRoda(); if (texto) { texto = ""; avisar(nome + ": apagado"); } }
    };
    Object.defineProperty(objeto, "texto", { enumerable: true, get: function () { aindaRoda(); return texto; }, set: function () { soLeitura("texto", "mostrar(texto) ou apagar()"); } });
    return objeto;
  }`,
  telaApp: `
  function telaApp(nome) {
    var texto = "";
    var conflitos = 0;
    function horario(h) { return (h < 10 ? " " : "") + h + "h"; }
    var objeto = {
      mostrar: function (recado) {
        aindaRoda();
        if (recado === undefined) throw new TypeError('mostrar precisa do recado, como mostrar("Bom dia!").');
        texto = String(recado).slice(0, ${TELA_APP.letrasDoRecado});
        conflitos = 0;
        avisar(texto ? nome + ': "' + texto + '"' : nome + ": apagada");
      },
      mostrarAgenda: function (lista, titulo) {
        aindaRoda();
        if (!Array.isArray(lista)) throw new TypeError("mostrarAgenda precisa de uma lista de marcações, como mostrarAgenda(agenda).");
        var linhas = lista.map(function (item, i) {
          if (typeof item !== "object" || item === null) throw new TypeError("A marcação " + i + " da lista não é um objeto { horario, cliente }.");
          if (typeof item.horario !== "number" || item.horario % 1 !== 0 || item.horario < 0 || item.horario > 23) throw new TypeError("A marcação " + i + " precisa de horario: um número inteiro de 0 a 23.");
          if (typeof item.cliente !== "string") throw new TypeError("A marcação " + i + ' precisa de cliente: um texto, como "Ana".');
          return { horario: item.horario, cliente: item.cliente, ordem: i };
        }).sort(function (a, b) { return a.horario - b.horario || a.ordem - b.ordem; });
        var vezes = {};
        linhas.forEach(function (linha) { vezes[linha.horario] = (vezes[linha.horario] || 0) + 1; });
        conflitos = Object.keys(vezes).filter(function (h) { return vezes[h] > 1; }).length;
        texto = (titulo ? titulo + ": " : "") + (linhas.map(function (linha) { return linha.horario + "h " + linha.cliente; }).join(", ") || "agenda vazia");
        var desenho = linhas.map(function (linha) {
          return "    " + horario(linha.horario) + "  " + linha.cliente + (vezes[linha.horario] > 1 ? "   <- " + linha.horario + "h marcado " + vezes[linha.horario] + " vezes!" : "");
        });
        avisar(nome + ": agenda" + (titulo ? " de " + titulo : "") + (linhas.length ? "\\n" + desenho.join("\\n") : " vazia"));
      },
      apagar: function () { aindaRoda(); if (texto) { texto = ""; conflitos = 0; avisar(nome + ": apagada"); } }
    };
    Object.defineProperty(objeto, "texto", { enumerable: true, get: function () { aindaRoda(); return texto; }, set: function () { soLeitura("texto", "mostrar(texto) ou mostrarAgenda(lista)"); } });
    Object.defineProperty(objeto, "conflitos", { enumerable: true, get: function () { aindaRoda(); return conflitos; }, set: function () { soLeitura("conflitos"); } });
    return objeto;
  }`,
  campainha: `
  function campainha(nome) {
    var toques = 0;
    var objeto = { tocar: function () { aindaRoda(); toques++; avisar(nome + ": plim!"); } };
    Object.defineProperty(objeto, "toques", { enumerable: true, get: function () { aindaRoda(); return toques; }, set: function () { soLeitura("toques", "tocar()"); } });
    return objeto;
  }`,
};

/** O nome do arquivo baixado. */
export function arquivoDoContrato(contrato: DadosContrato): string {
  return contrato.levarProMundo?.arquivo ?? "meu-programa.js";
}

/** O texto do arquivo .js: as instruções, o mundo simples da cena e o programa do aluno. */
export function programaParaLevar({ contrato, cena, codigo }: { contrato: DadosContrato; cena: DadosCena | null; codigo: string }): string {
  const cliente = clienteDe(contrato.cliente);
  const arquivo = arquivoDoContrato(contrato);
  const relogio = cena?.dispositivos.find((d) => d.tipo === "relogio");
  const horaInicial = relogio ? Number({ ...CATALOGO_DISPOSITIVOS.relogio.inicial, ...(relogio.inicial ?? {}) }.hora) : null;
  const tipos = [...new Set((cena?.dispositivos ?? []).map((d) => d.tipo))];
  const linhas = [
    "/*",
    ` * ${contrato.projeto}`,
    ` * Para ${cliente.nome} (${cliente.negocio}). Programa feito por você no InterativAI.`,
    " *",
    " * COMO RODAR",
    " * - No navegador: abra qualquer página, aperte F12 (ou Ctrl+Shift+J), vá na",
    " *   aba Console, cole este arquivo inteiro e aperte Enter.",
    ` * - No computador, com o Node instalado: node ${arquivo}`,
    " *",
    " * Aqui os aparelhos são uma versão simples: em vez de acender luzes e ligar",
    " * fornos de verdade, eles escrevem no console o que fariam. O tempo é",
    " * simulado: esperar(500) não espera de verdade, só avança o relógio.",
    " */",
    "(function () {",
    `  var DURACAO_MS = ${cena?.duracaoMs ?? 0};`,
    `  var HORA_INICIAL = ${horaInicial === null ? "null" : horaInicial};`,
    `  var MS_POR_HORA = ${RELOGIO.msPorHora};`,
    `  var ACONTECIMENTOS = ${js(cena ? acontecimentos(cena) : [])};`,
    `  var ENTRADAS = ${js((cena?.linhaDoTempo ?? []).filter(e => e.tipo === undefined))};`,
    `  var REACOES = ${js(cena?.reacoes ?? [])};`,
    `  var ATORES = ${js(cena?.atores ?? [])};`,
    "  var DISPOSITIVOS = {}, EFEITOS = [], PENDENTES = [], ANTERIORES = [], OCUPADOS = {}, AGENDADOS = [];",
    "  var conferindoReacoes = false;",
    `  function valorTemporal(id, propriedade, inicial) {
      var valor = inicial;
      ENTRADAS.concat(EFEITOS).filter(function (e) { return e.dispositivo === id && e.propriedade === propriedade; }).sort(function (a, b) { return (a.em === undefined ? a.de : a.em) - (b.em === undefined ? b.de : b.em); }).forEach(function (e) {
        var inicio = e.em === undefined ? e.de : e.em;
        if (inicio <= relogioMs) valor = e.em === undefined ? e.valorInicial + (e.valorFinal - e.valorInicial) * Math.max(0, Math.min(1, (relogioMs - e.de) / (e.ate - e.de))) : e.valor;
      });
      return valor;
    }
    function conferirReacoes() {
      if (conferindoReacoes) return;
      conferindoReacoes = true;
      try {
        REACOES.forEach(function (r, i) {
          var casa = [r.quando].concat(r.se || []).every(function (c) { return DISPOSITIVOS[c.dispositivo] && DISPOSITIVOS[c.dispositivo][c.propriedade] === c.valor; });
          if (!casa) PENDENTES[i] = undefined;
          if (casa && !ANTERIORES[i]) PENDENTES[i] = relogioMs + (r.atrasoMs || 0);
          ANTERIORES[i] = casa;
          if (!casa || PENDENTES[i] !== relogioMs) return;
          PENDENTES[i] = undefined;
          var ator = ATORES.find(function (a) { return a.id === r.entao.ator; });
          var acao = ator && ator.acoes[r.entao.acao];
          if (!acao || (OCUPADOS[ator.id] || 0) > relogioMs) return;
          var fim = relogioMs + acao.duracaoMs;
          OCUPADOS[ator.id] = fim;
          console.log("[" + quando(relogioMs) + "] " + ator.id + ": " + r.entao.acao);
          (acao.aoConcluir || []).forEach(function (e) { EFEITOS.push(Object.assign({ em: fim }, e)); });
        });
      } finally { conferindoReacoes = false; }
    }`,
    "  var relogioMs = 0;",
    "  var proximo = 0;",
    "  var acabou = false;",
    "  var FIM = { fimDaSimulacao: true };",
    "",
    "  function doisDigitos(n) { return (n < 10 ? \"0\" : \"\") + n; }",
    "  /** O instante, como o relógio da cena mostra: 07:30 (com relógio) ou 2,5 s. */",
    "  function quando(ms) {",
    "    if (HORA_INICIAL === null) return (ms / 1000).toFixed(1).replace(\".\", \",\") + \" s\";",
    "    var minutos = Math.floor((ms / MS_POR_HORA) * 60);",
    "    return doisDigitos((HORA_INICIAL + Math.floor(minutos / 60)) % 24) + \":\" + doisDigitos(minutos % 60);",
    "  }",
    "  function avisar(texto) { console.log(\"[\" + quando(relogioMs) + \"] \" + texto); conferirReacoes(); }",
    "  /** O mundo anda até o instante: quem chega, quem vai embora, quem aperta. */",
    "  function andarAte(ms) {",
    "    var anterior = relogioMs;",
    "    while (true) {",
    "      var instantes = ENTRADAS.map(function(e) { return e.em === undefined ? e.de : e.em; }).concat(ENTRADAS.filter(function(e) { return e.ate !== undefined; }).map(function(e) { return e.ate; }), EFEITOS.map(function(e) { return e.em; }), PENDENTES, Object.values(OCUPADOS), AGENDADOS.map(function(a) { return a.ms; }));",
    "      REACOES.forEach(function(r) { [r.quando].concat(r.se || []).forEach(function(c) { ENTRADAS.forEach(function(e) { if(e.em === undefined && e.dispositivo === c.dispositivo && e.propriedade === c.propriedade && typeof c.valor === 'number' && e.valorInicial !== e.valorFinal) { var p = (c.valor-e.valorInicial)/(e.valorFinal-e.valorInicial); if(p>=0 && p<=1) instantes.push(e.de+p*(e.ate-e.de)); } }); }); });",
    "      var proximos = instantes.filter(function(t) { return t > anterior && t <= ms; });",
    "      if (!proximos.length) break;",
    "      anterior = Math.min.apply(null, proximos); relogioMs = anterior; AGENDADOS.filter(function(a) { return a.ms === anterior; }).forEach(function(a) { a.fazer(); }); AGENDADOS = AGENDADOS.filter(function(a) { return a.ms > anterior; }); conferirReacoes();",
    "    }",
    "    relogioMs = ms; conferirReacoes();",
    "    while (proximo < ACONTECIMENTOS.length && ACONTECIMENTOS[proximo].ms <= ms) {",
    "      var acontecimento = ACONTECIMENTOS[proximo++];",
    "      console.log(\"[\" + quando(acontecimento.ms) + \"] \" + acontecimento.texto);",
    "    }",
    "  }",
    "  function pessoasAgora() {",
    "    var dentro = 0;",
    "    for (var i = 0; i < ACONTECIMENTOS.length && ACONTECIMENTOS[i].ms <= relogioMs; i++) {",
    "      if (ACONTECIMENTOS[i].tipo === \"chega\") dentro++;",
    "      if (ACONTECIMENTOS[i].tipo === \"sai\") dentro--;",
    "    }",
    "    return dentro;",
    "  }",
    "  function apertosAte(id) {",
    "    var vezes = 0;",
    "    for (var i = 0; i < ACONTECIMENTOS.length && ACONTECIMENTOS[i].ms <= relogioMs; i++) if (ACONTECIMENTOS[i].tipo === \"aperta\" && ACONTECIMENTOS[i].dispositivo === id) vezes++;",
    "    return vezes;",
    "  }",
    "  /** Depois do fim da simulação, nada mais roda (nem um try/catch segura). */",
    "  function aindaRoda() { if (acabou && !conferindoReacoes) throw FIM; }",
    "  function soLeitura(nome, comando) { throw new TypeError(nome + \" só dá para ler.\" + (comando ? \" Use \" + comando + \".\" : \" Quem muda é o mundo.\")); }",
    "  function numeroNaFaixa(valor, nome, minimo, maximo, inteiro) {",
    "    if (typeof valor !== \"number\" || valor !== valor) throw new TypeError(nome + \" precisa ser um número, de \" + minimo + \" a \" + maximo + \".\");",
    "    if (valor < minimo || valor > maximo || (inteiro && Math.floor(valor) !== valor)) throw new RangeError(nome + \" vai de \" + minimo + \" a \" + maximo + \": \" + valor + \" não vale.\");",
    "    return valor;",
    "  }",
    "  function esperar(ms) {",
    "    aindaRoda();",
    "    if (typeof ms !== \"number\" || ms !== ms) throw new TypeError(\"esperar precisa de um número: quantos milissegundos esperar, como esperar(500).\");",
    "    if (ms < 0) throw new RangeError(\"esperar não volta no tempo: use um número de 0 para cima.\");",
    "    var alvo = relogioMs + ms;",
    "    if (alvo >= DURACAO_MS) { andarAte(DURACAO_MS); relogioMs = DURACAO_MS; acabou = true; throw FIM; }",
    "    andarAte(alvo);",
    "    relogioMs = alvo;",
    "  }",
    ...new Set(tipos.map((tipo) => FABRICAS[tipo])),
    "",
    "  // Os aparelhos da cena, com os nomes que o seu código usa.",
    ...(cena?.dispositivos ?? []).map((d) => `  var ${d.id} = DISPOSITIVOS[${js(d.id)}] = ${criarDispositivo(d)};`),
    "",
    "  console.log(\"" + contrato.projeto.replace(/"/g, "'") + ": começou a simulação.\");",
    "  conferirReacoes();",
    "  try {",
    "    // ======================= O SEU PROGRAMA =======================",
    ...codigo.split("\n").map((linha) => (linha ? `    ${linha}` : "")),
    "    // ==============================================================",
    "  } catch (erro) {",
    "    if (erro !== FIM) throw erro;",
    "  }",
    "  // O mundo continua até o fim, mesmo que o programa tenha parado antes.",
    "  andarAte(DURACAO_MS);",
    "  relogioMs = DURACAO_MS;",
    "  console.log(\"[\" + quando(DURACAO_MS) + \"] Fim da simulação.\");",
    "})();",
    "",
  ];
  return linhas.join("\n");
}
