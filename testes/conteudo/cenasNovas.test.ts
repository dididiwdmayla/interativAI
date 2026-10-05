import { describe, expect, it } from "vitest";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import { criarSimulacao } from "@/motor/simulacao";
import { FASES_CENAS_NOVAS, SOLUCOES_CENAS_NOVAS, UNIDADE_CENAS_NOVAS } from "@/conteudo/laboratorio/bancadaCenasNovas";
import { CENAS_NOVAS } from "@/conteudo/laboratorio/cenasNovas";

const sabotagens = [
  ['esperar(1000); portao.abrir(); luz.ligar(); esperar(2200); portao.fechar(); luz.desligar();', SOLUCOES_CENAS_NOVAS[0].replace('portao.fechar();', '')],
  ['esperar(3100); alarme.tocar(); esperar(3400); alarme.parar();', SOLUCOES_CENAS_NOVAS[1].replace('abertaPor = 0;\n    alarme.parar()', 'alarme.parar()'), SOLUCOES_CENAS_NOVAS[1].replace('> 2000', '>= 2000')],
  [SOLUCOES_CENAS_NOVAS[2].replace('!botao.pressionado && ', ''), SOLUCOES_CENAS_NOVAS[2].replace('esperar(1000)', 'esperar(100)')],
  [SOLUCOES_CENAS_NOVAS[3].replace(' && sensorDia.dia', ''), 'esperar(3600); aspersor.ligar(); esperar(3400); aspersor.desligar();', SOLUCOES_CENAS_NOVAS[3].replace('< 30', '<= 30')],
];

describe("quatro ambientes novos", () => {
  it("ambientes diferentes, dados válidos e conteúdo nas regras da fábrica", () => {
    expect(new Set(CENAS_NOVAS.map(c => c.ambiente)).size).toBe(4);
    const contexto = { unidades: [UNIDADE_CENAS_NOVAS], fases: FASES_CENAS_NOVAS };
    for (const fase of FASES_CENAS_NOVAS) expect(REGRAS_DE_FASE.flatMap(r => r.checar(fase, contexto).map(p => `${r.id}: ${p}`)), fase.id).toEqual([]);
  });
  for (const [i, fase] of FASES_CENAS_NOVAS.entries()) {
    it(`${fase.cena?.ambiente}: solução passa em todas as linhas do tempo`, () => {
      const sim = criarSimulacao(fase);
      sim.executar(fase.objetivos[0].solucaoDeTeste);
      const resultado = sim.avaliar(fase.objetivos[0].validador);
      expect(resultado.passou, JSON.stringify(resultado)).toBe(true);
    });
    for (const [j, codigo] of sabotagens[i].entries()) it(`${fase.cena?.ambiente}: rejeita sabotagem ${j + 1}`, () => {
      const sim = criarSimulacao(fase);
      sim.executar([{ tipo: "definirSnippet", codigo }, { tipo: "executarSnippet" }]);
      expect(sim.avaliar(fase.objetivos[0].validador).passou).toBe(false);
    });
  }
});
