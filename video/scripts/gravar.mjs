// Grava as tomadas do jogo (build de produção no ar em URL_JOGO, padrão
// http://localhost:3000) e monta cada uma em public/takes/<id>.mp4 (o registro vai para src/dados/takes/<id>.json),
// com a folha de contato em revisao/tomadas/<id>.jpg.
// Uso: node scripts/gravar.mjs            (todas)
//      node scripts/gravar.mjs T01 V02    (só essas)
import { fecharNavegadores } from "./lib/gravador.mjs";
import { TOMADAS } from "./tomadas.mjs";
import { montarTomada } from "./montar-tomada.mjs";

const pedidas = process.argv.slice(2);
const ids = pedidas.length ? pedidas : Object.keys(TOMADAS);
let falhas = 0;
for (const id of ids) {
  const gravar = TOMADAS[id];
  if (!gravar) {
    console.error(`${id}: não existe essa tomada`);
    falhas += 1;
    continue;
  }
  let feita = false;
  for (let tentativa = 1; tentativa <= 2 && !feita; tentativa++) {
    try {
      const take = await gravar();
      const r = montarTomada(take.id);
      console.log(`${id} ${take.id}: ${r.duracao.toFixed(1)} s, ${r.qps} quadros/s, ${r.pausasLongas} pausas longas`);
      feita = true;
    } catch (erro) {
      console.error(`${id}: tentativa ${tentativa} falhou: ${String(erro).split("\n")[0]}`);
      await fecharNavegadores();
    }
  }
  if (!feita) falhas += 1;
}
process.exit(falhas ? 1 : 0);
