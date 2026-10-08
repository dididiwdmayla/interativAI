// Conta os números do jogo a partir do código (o currículo e o índice do
// conteúdo publicado) e grava em src/dados/numeros.json. Todo número que o
// vídeo mostra sai daqui, nunca escrito à mão.
// Uso: node scripts/contar.mjs
import { writeFileSync } from "node:fs";
import path from "node:path";
import { curriculo, PASTA_VIDEO } from "./lib/jogo.mjs";

const { CURRICULO, PUBLICADAS, unidadesDaIlha } = curriculo;

const ilhas = CURRICULO.map((ilha) => {
  const unidades = unidadesDaIlha(ilha.id);
  const publicadas = unidades.filter((unidade) => Object.hasOwn(PUBLICADAS, unidade.id));
  const fases = publicadas.reduce((soma, unidade) => soma + PUBLICADAS[unidade.id].length, 0);
  const zonasComConteudo = ilha.zonas.filter((zona) => zona.unidades.some((unidade) => Object.hasOwn(PUBLICADAS, unidade.id))).length;
  return {
    id: ilha.id,
    nome: ilha.nome,
    opcional: Boolean(ilha.opcional),
    trilhas: ilha.trilhas ?? null,
    zonas: ilha.zonas.length,
    zonasComConteudo,
    unidadesNoCurriculo: unidades.length,
    unidadesPublicadas: publicadas.length,
    fasesPublicadas: fases,
    estado: publicadas.length === 0 ? "em construção" : publicadas.length === unidades.length ? "completa" : "parcial",
  };
});

const soma = (campo) => ilhas.reduce((total, ilha) => total + ilha[campo], 0);
/** "Mais de N": arredonda para baixo na dezena. */
const maisDe = (numero) => Math.floor(numero / 10) * 10;

const numeros = {
  geradoPor: "video/scripts/contar.mjs, a partir de src/curriculo/curriculo.ts e src/conteudo/publicados.json",
  ilhasNoCurriculo: ilhas.length,
  ilhasComConteudo: ilhas.filter((ilha) => ilha.unidadesPublicadas > 0).length,
  ilhasEmConstrucao: ilhas.filter((ilha) => ilha.unidadesPublicadas === 0).map((ilha) => ilha.nome),
  unidadesPublicadas: soma("unidadesPublicadas"),
  fasesPublicadas: soma("fasesPublicadas"),
  unidadesNoCurriculo: soma("unidadesNoCurriculo"),
  maisDeFases: maisDe(soma("fasesPublicadas")),
  maisDeUnidades: maisDe(soma("unidadesPublicadas")),
  ilhas,
};

const fora = Object.keys(PUBLICADAS).filter((id) => !CURRICULO.some((ilha) => unidadesDaIlha(ilha.id).some((unidade) => unidade.id === id)));
if (fora.length) numeros.publicadasForaDoCurriculo = fora;

writeFileSync(path.join(PASTA_VIDEO, "src", "dados", "numeros.json"), `${JSON.stringify(numeros, null, 2)}\n`);
console.log(`${numeros.ilhasNoCurriculo} ilhas no currículo, ${numeros.ilhasComConteudo} com conteúdo; ${numeros.unidadesPublicadas} unidades e ${numeros.fasesPublicadas} fases publicadas.`);
for (const ilha of ilhas) console.log(`  ${ilha.nome}: ${ilha.unidadesPublicadas} de ${ilha.unidadesNoCurriculo} unidades, ${ilha.fasesPublicadas} fases, ${ilha.zonasComConteudo} de ${ilha.zonas} zonas (${ilha.estado})`);
if (fora.length) console.log(`  Atenção: unidades publicadas fora do currículo: ${fora.join(", ")}`);
