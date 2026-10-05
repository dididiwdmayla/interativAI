import { rastroInicial, type DadosCena, type MudancaCena, type ValorCena } from "@/motor/cena/modelo";
import { CENA_GARAGEM, CENA_COZINHA, CENA_ESQUINA, CENA_ESTUFA } from "./cenasNovas";

/** Fotos do mostruário. As capturas de revisão vêm da missão executada no navegador. */
function fotos(dados: DadosCena, mudancas: [number, string, string, ValorCena, string][], instantes: [string, number][]) {
  const lista: MudancaCena[] = mudancas.map(([tempoMs, dispositivo, propriedade, valor, acao]) => ({ tempoMs, dispositivo, propriedade, valor, acao, execucao: 1, passo: null }));
  const rastro = { ...rastroInicial(dados), mudancas: lista, fimCodigoMs: dados.duracaoMs, relogioMs: dados.duracaoMs };
  return instantes.map(([estado, tempoMs]) => ({ rotulo: `${dados.titulo} · ${estado}`, dados, rastro, tempoMs }));
}
export const AMOSTRAS_CENAS_NOVAS = [
  ...fotos(CENA_GARAGEM, [[1000, "portao", "aberto", true, "abrir"], [1000, "luz", "ligada", true, "ligar"], [3200, "portao", "aberto", false, "fechar"], [3200, "luz", "ligada", false, "desligar"]], [["antes", 0], ["entrada", 2600], ["depois", 5000]]),
  ...fotos(CENA_COZINHA, [[0, "forno", "ligado", true, "ligar"], [0, "forno", "desligaEm", 3000, "assar"], [3100, "alarme", "tocando", true, "tocar"], [6500, "alarme", "tocando", false, "parar"]], [["antes", 0], ["aviso", 4200], ["depois", 7000]]),
  ...fotos(CENA_ESQUINA, [[1500, "semaforo", "cor", "amarelo", "mudar"], [2500, "semaforo", "cor", "vermelho", "mudar"], [5000, "semaforo", "cor", "verde", "mudar"]], [["antes", 0], ["travessia", 3700], ["depois", 5500]]),
  ...fotos(CENA_ESTUFA, [[3600, "aspersor", "ligado", true, "ligar"], [7000, "aspersor", "ligado", false, "desligar"]], [["antes", 0], ["rega", 4800], ["noite", 8000]]),
];
