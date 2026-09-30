import type { IdFerramenta } from "@/ferramentas/ids";
import type { Acao } from "./tipos";

/** A ferramenta que o jogador usa para fazer a ação à mão. */
export function ferramentaDaAcao(acao: Acao): IdFerramenta | null {
  switch (acao.tipo) {
    case "selecionar":
      switch (acao.via ?? "arvore") {
        case "arvore":
          return "arvore";
        case "inspecionar":
          return "inspecionar";
        case "editor":
          return "sincronia";
        case "trilha":
          return "trilha";
      }
      return null;
    case "definirTexto":
    case "definirAtributo":
      return "editar-duplo-clique";
    case "adicionarAtributo":
      return "adicionar-atributo";
    case "inserirHTML":
      return "editor";
    case "esconder":
      return "esconder";
    case "apagar":
      return "apagar";
    case "duplicar":
      return "duplicar";
    case "renomearTag":
      return "renomear-tag";
    case "clicarLink":
      return "previa";
    case "desfazer":
      return "desfazer";
    case "responderPrevisao":
      return null;
    case "definirPropriedade":
      return "editar-valor-css";
    case "alternarDeclaracao":
      return "ligar-desligar-declaracao";
    case "adicionarRegra":
      return "nova-regra";
    case "editarCss":
      return "editor-css";
    case "salvarTema":
      return "salvar-tema";
    case "trocarDispositivo":
    case "desligarDispositivo":
      return "modo-dispositivo";
    case "girarDispositivo":
      return "girar-dispositivo";
    case "analisarAuditoria":
      return "lighthouse";
    case "levarProMundo":
      return "levar-pro-mundo";
    case "clicarNaPrevia":
      return "medicao";
    case "simularVisita":
      return "link-rastreavel";
    case "configurarCampanha":
      return "simulador-campanha";
  }
}
