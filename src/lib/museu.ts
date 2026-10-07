/*
 * As regras do corredor do Museu das Origens: cada época com o seu
 * antepassado, a sala que ele recebe (pronta, trancada ou em breve) e o
 * lugar da próxima geração, que abre quando a sala 2 termina. Tudo sai do
 * currículo, do conteúdo e do progresso; nada é guardado à mão (só o
 * retrato do aluno, depois que ele entra para a família).
 */
import { UNIDADES } from "@/conteudo";
import type { Unidade } from "@/conteudo/tipos";
import { CURRICULO } from "@/curriculo";
import type { IlhaCurriculo } from "@/curriculo/tipos";
import { FICHAS_ANTEPASSADOS, type FichaAntepassado, ORDEM_DO_CORREDOR } from "@/motor/exposicao/antepassados";
import { acaoDaUnidade, type AcaoUnidade, estadoDaUnidade, type EstadoUnidadeMapa, estrelasDaUnidade, unidadeConcluida } from "./mapa";
import type { Progresso } from "./progresso";

/** A sala que fecha o corredor: terminando ela, o lugar da próxima geração abre. */
export const SALA_DA_PROXIMA_GERACAO = "origens-museu-u2";

export type SalaNoCorredor = {
  id: string;
  /** "Sala 1". */
  numero: number;
  titulo: string;
  estado: EstadoUnidadeMapa;
  /** O botão: a próxima fase (ou "Jogar de novo"). Null: em breve ou trancada. */
  acao: AcaoUnidade | null;
  estrelas: number;
};

export type EpocaNoCorredor = {
  ficha: FichaAntepassado;
  sala: SalaNoCorredor | null;
  /** O que ele diz ao acordar: a saudação e, com a sala em breve, o aviso. */
  fala: string;
};

function ilhaDasOrigens(curriculo: readonly IlhaCurriculo[]): IlhaCurriculo | undefined {
  return curriculo.find((ilha) => ilha.sempreAberta);
}

/** As épocas do corredor, na ordem, com a sala de cada uma. */
export function epocasDoCorredor(progresso: Progresso, unidades: readonly Unidade[] = UNIDADES, curriculo: readonly IlhaCurriculo[] = CURRICULO): EpocaNoCorredor[] {
  const ilha = ilhaDasOrigens(curriculo);
  return ORDEM_DO_CORREDOR.map((id) => {
    const ficha = FICHAS_ANTEPASSADOS[id];
    if (!ilha || !ficha.sala) return { ficha, sala: null, fala: ficha.saudacao };
    const zona = ilha.zonas.find((candidata) => candidata.unidades.some((item) => item.id === ficha.sala));
    const indice = zona?.unidades.findIndex((item) => item.id === ficha.sala) ?? -1;
    const item = zona?.unidades[indice];
    if (!zona || !item) return { ficha, sala: null, fala: ficha.saudacao };
    const conteudo = unidades.find((unidade) => unidade.id === item.id);
    const estado = estadoDaUnidade(ilha, zona, item, { progresso, unidades, curriculo });
    const sala: SalaNoCorredor = {
      id: item.id,
      numero: indice + 1,
      titulo: item.titulo,
      estado,
      acao: conteudo && estado !== "bloqueada" ? acaoDaUnidade(conteudo, progresso) : null,
      estrelas: conteudo ? estrelasDaUnidade(conteudo, progresso) : 0,
    };
    return { ficha, sala, fala: estado === "planejada" ? `${ficha.saudacao} ${ficha.emBreve}` : ficha.saudacao };
  });
}

/**
 * O museu inteiro: todas as salas do corredor têm conteúdo e estão
 * concluídas. O retrato do aluno na árvore ganha a insígnia da história.
 */
export function museuCompleto(progresso: Progresso, unidades: readonly Unidade[] = UNIDADES, curriculo: readonly IlhaCurriculo[] = CURRICULO): boolean {
  const salas = ilhaDasOrigens(curriculo)?.zonas.flatMap((zona) => zona.unidades) ?? [];
  if (!salas.length) return false;
  return salas.every((item) => {
    const sala = unidades.find((unidade) => unidade.id === item.id);
    return sala !== undefined && unidadeConcluida(sala, progresso);
  });
}

/** O lugar da próxima geração abriu: a sala 2 está concluída. */
export function proximaGeracaoAberta(progresso: Progresso, unidades: readonly Unidade[] = UNIDADES): boolean {
  if (progresso.mapaDesbloqueado) return true;
  const sala = unidades.find((unidade) => unidade.id === SALA_DA_PROXIMA_GERACAO);
  return sala !== undefined && unidadeConcluida(sala, progresso);
}
