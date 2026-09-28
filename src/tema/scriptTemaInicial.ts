import { CHAVE_PROGRESSO, CHAVE_PROGRESSO_V1 } from "@/lib/progresso";
import { ID_ESTILO_MEU_TEMA } from "@/lib/meuTema";
import { TEMAS, TEMAS_INICIAIS } from "@/tema/temas";

/**
 * Script que roda antes da primeira pintura e aplica o tema salvo,
 * evitando o piscar do tema padrão ao recarregar a página. Lê a v1 se a
 * v2 ainda não existe (antes da migração, que roda depois, no React). O
 * Meu tema (E5) põe antes o <style> com as cores dele, filtradas como em
 * src/lib/meuTema.ts (só --cor-* e valores sem nada estranho).
 */
export const SCRIPT_TEMA_INICIAL = `(function(){try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(
  CHAVE_PROGRESSO,
)})||localStorage.getItem(${JSON.stringify(CHAVE_PROGRESSO_V1)})||"null");if(!p)return;var t=p.tema;var validos=${JSON.stringify(
  TEMAS.map((tema) => tema.id),
)};var livres=${JSON.stringify(
  TEMAS_INICIAIS,
)}.concat(Array.isArray(p.temasDesbloqueados)?p.temasDesbloqueados:[]);if(t==="meu"){var m=p.meuTema,c=m&&m.cores,css="";if(!c||typeof c!=="object")return;for(var k in c){if(/^--cor-[a-z0-9-]+$/.test(k)&&typeof c[k]==="string"&&/^[#a-z0-9(),.%\s\/+-]+$/i.test(c[k]))css+=k+":"+c[k]+";"}var s=document.createElement("style");s.id=${JSON.stringify(
  ID_ESTILO_MEU_TEMA,
)};s.textContent='[data-theme="meu"]{color-scheme:'+(m.escuro?"dark":"light")+";"+css+"}";document.head.appendChild(s)}if(validos.indexOf(t)>-1&&livres.indexOf(t)>-1){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;
