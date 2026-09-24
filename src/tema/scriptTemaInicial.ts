import { CHAVE_PROGRESSO } from "@/lib/progresso";
import { TEMAS, TEMAS_INICIAIS } from "@/tema/temas";

/**
 * Script que roda antes da primeira pintura e aplica o tema salvo,
 * evitando o piscar do tema padrão ao recarregar a página.
 */
export const SCRIPT_TEMA_INICIAL = `(function(){try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(
  CHAVE_PROGRESSO,
)})||"null");if(!p)return;var t=p.tema;var validos=${JSON.stringify(
  TEMAS.map((tema) => tema.id),
)};var livres=${JSON.stringify(
  TEMAS_INICIAIS,
)}.concat(Array.isArray(p.temasDesbloqueados)?p.temasDesbloqueados:[]);if(validos.indexOf(t)>-1&&livres.indexOf(t)>-1){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;
