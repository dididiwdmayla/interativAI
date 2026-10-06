/*
 * Os dispositivos de software das cenas: a registradora do caixa (o visor
 * mostra o total que o programa calcula) e a tela de aplicativo (um monitor
 * no balcão que mostra um recado ou a agenda que o programa monta, com o
 * horário repetido em vermelho). (x, y) é o canto de cima à esquerda.
 */
import type { DispositivoCena, EstadoDispositivos } from "@/motor/cena/modelo";
import { lerConteudoDaTela, textoDoHorario } from "@/motor/cena/telaApp";
import { CONTORNO, cor, SombraNoChao } from "./estilo";

type Props = { dispositivo: DispositivoCena; estado: EstadoDispositivos };

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

/** O tamanho do desenho de cada um (antes da escala). */
export const TAMANHO_REGISTRADORA = { largura: 70, altura: 50 };
export const TAMANHO_TELA_APP = { largura: 100, altura: 84 };

export function Registradora({ dispositivo, estado }: Props) {
  const { x, y } = dispositivo;
  const e = dispositivo.escala ?? 1;
  const texto = String(estado[dispositivo.id]?.texto ?? "");
  return (
    <g transform={`translate(${x} ${y}) scale(${e})`} data-registradora>
      <SombraNoChao x={35} y={50} largura={62} />
      {/* O visor, virado para o cliente, num pescoço de metal */}
      <rect x={31} y={13} width={8} height={11} fill={cor("metal-sombra")} {...CONTORNO} />
      <rect x={4} y={0} width={62} height={15} rx={3} fill={cor("letreiro")} {...CONTORNO} />
      {/* Os segmentos apagados, por baixo de cada casa do número (alinhados à direita, como o texto) */}
      <text x={63} y={11} textAnchor="end" fontFamily={MONO} fontWeight={800} fontSize={7.6} fill={cor("letreiro-apagado")} opacity={0.6}>
        {"8".repeat(12)}
      </text>
      {texto && (
        <text x={63} y={11} textAnchor="end" fontFamily={MONO} fontWeight={800} fontSize={7.6} fill={cor("letreiro-aceso")} data-visor={texto}>
          {texto}
        </text>
      )}
      {/* O corpo, o teclado e a gaveta do dinheiro */}
      <path d="M6 50L10 24H60L64 50Z" fill={cor("metal")} {...CONTORNO} />
      <path d="M60 24L64 50H56L54 24Z" fill={cor("metal-sombra")} opacity={0.6} />
      {[0, 1, 2].map((linha) =>
        [0, 1, 2, 3].map((coluna) => (
          <rect key={`${linha}-${coluna}`} x={15 + coluna * 7} y={27 + linha * 4.5} width={5} height={3} rx={0.8} fill={coluna === 3 && linha === 2 ? cor("sinal-verde") : cor("claro")} {...CONTORNO} />
        )),
      )}
      <rect x={45} y={28} width={10} height={11} rx={1.5} fill={cor("claro")} opacity={0.8} {...CONTORNO} />
      <rect x={8} y={42} width={54} height={7} rx={1.5} fill={cor("metal-sombra")} {...CONTORNO} />
      <rect x={31} y={44.5} width={8} height={2} rx={1} fill={cor("claro")} />
      {/* A notinha saindo */}
      <path d="M48 27v-7h6v7" fill={cor("claro")} {...CONTORNO} />
    </g>
  );
}

/** Quebra o recado em até duas linhas, pelas palavras. */
function linhasDoRecado(recado: string): string[] {
  if (recado.length <= 15) return [recado];
  const palavras = recado.split(" ");
  const primeira: string[] = [];
  while (palavras.length && [...primeira, palavras[0]].join(" ").length <= 15) primeira.push(palavras.shift() ?? "");
  if (!primeira.length) return [recado.slice(0, 15), recado.slice(15)];
  return [primeira.join(" "), palavras.join(" ")];
}

export function TelaApp({ dispositivo, estado }: Props) {
  const { x, y } = dispositivo;
  const e = dispositivo.escala ?? 1;
  const conteudo = lerConteudoDaTela(estado[dispositivo.id]?.conteudo);
  const tela = { x: 4, y: 4, largura: 92, altura: 62 };
  return (
    <g transform={`translate(${x} ${y}) scale(${e})`} data-tela-app={conteudo?.tipo ?? "apagada"}>
      <SombraNoChao x={50} y={84} largura={46} />
      {/* O pé do monitor */}
      <rect x={45} y={68} width={10} height={12} fill={cor("metal-sombra")} {...CONTORNO} />
      <rect x={32} y={79} width={36} height={5} rx={2} fill={cor("metal")} {...CONTORNO} />
      {/* A moldura e a tela */}
      <rect x={0} y={0} width={100} height={70} rx={6} fill={cor("letreiro")} {...CONTORNO} />
      <rect x={tela.x} y={tela.y} width={tela.largura} height={tela.altura} rx={3} fill={conteudo ? cor("claro") : cor("letreiro-apagado")} />
      {!conteudo && <circle cx={50} cy={67.5} r={1.2} fill={cor("led")} />}
      {conteudo?.tipo === "recado" && (
        <g fontFamily={MONO} fontWeight={800} fontSize={7.4} textAnchor="middle" fill={cor("contorno")}>
          {linhasDoRecado(conteudo.recado).map((linha, i, todas) => (
            <text key={i} x={50} y={tela.y + tela.altura / 2 + 2.6 + (i - (todas.length - 1) / 2) * 10}>
              {linha}
            </text>
          ))}
        </g>
      )}
      {conteudo?.tipo === "agenda" && (
        <g fontFamily={MONO} fontWeight={800} fontSize={5.6}>
          {/* O cabeçalho do aplicativo: o dia e o calendário */}
          <rect x={tela.x} y={tela.y} width={tela.largura} height={9} rx={3} fill={cor("tecido")} />
          <rect x={tela.x} y={tela.y + 5} width={tela.largura} height={4} fill={cor("tecido")} />
          <rect x={tela.x + 3} y={tela.y + 2} width={6} height={5} rx={1} fill={cor("claro")} />
          <path d={`M${tela.x + 3} ${tela.y + 3.6}h6`} stroke={cor("tecido-sombra")} strokeWidth={1} />
          <text x={tela.x + 12} y={tela.y + 6.8} fill={cor("claro")}>
            {conteudo.titulo || "Agenda"}
          </text>
          {conteudo.linhas.length === 0 && (
            <text x={50} y={tela.y + 30} textAnchor="middle" fill={cor("metal-sombra")}>
              Nenhuma marcação
            </text>
          )}
          {conteudo.linhas.map((linha, i) => {
            const ly = tela.y + 11 + i * 6.4;
            return (
              <g key={i} data-linha-agenda={linha.repetido ? "repetido" : "livre"}>
                <rect x={tela.x + 2} y={ly} width={tela.largura - 4} height={5.6} rx={1.4} fill={linha.repetido ? cor("sinal-vermelho") : cor("calcada")} opacity={linha.repetido ? 1 : 0.55} />
                <text x={tela.x + 4} y={ly + 4.4} fill={linha.repetido ? cor("claro") : cor("contorno")}>
                  {textoDoHorario(linha.horario).padStart(3, " ")}
                </text>
                <text x={tela.x + 19} y={ly + 4.4} fill={linha.repetido ? cor("claro") : cor("contorno")}>
                  {linha.cliente}
                </text>
                {linha.repetido && (
                  <g transform={`translate(${tela.x + tela.largura - 7} ${ly + 2.8})`}>
                    <circle r={2.3} fill={cor("claro")} />
                    <path d="M0-1.3v1.4M0 1.1v0.2" stroke={cor("sinal-vermelho")} strokeWidth={0.9} strokeLinecap="round" />
                  </g>
                )}
              </g>
            );
          })}
          {conteudo.escondidas > 0 && (
            <text x={tela.x + tela.largura - 3} y={tela.y + tela.altura - 2} textAnchor="end" fill={cor("metal-sombra")}>
              +{conteudo.escondidas}
            </text>
          )}
        </g>
      )}
    </g>
  );
}
