import { type Peca, portasDeEntrada, temSaida } from "@/motor/circuito/modelo";

type Ponto = { x: number; y: number };

/** O tamanho de cada peça na bancada e onde ficam as bolinhas (portas). */
export function geometriaDa(peca: Peca): { largura: number; altura: number; entradas: Ponto[]; saida: Ponto | null } {
  const largura = peca.tipo === "entrada" ? 104 : peca.tipo === "saida" ? 90 : 72;
  const altura = peca.tipo === "entrada" ? 46 : peca.tipo === "saida" ? 70 : 60;
  const n = portasDeEntrada(peca.tipo);
  const entradas = Array.from({ length: n }, (_, i) => ({ x: peca.x, y: peca.y + (n === 1 ? altura / 2 : i === 0 ? 15 : altura - 15) }));
  const saida = temSaida(peca.tipo) ? { x: peca.x + largura, y: peca.y + altura / 2 } : null;
  return { largura, altura, entradas, saida };
}

/** O caminho de um fio (curva que sai reta de uma porta e chega reta na outra). */
export function caminhoDoFio(de: Ponto, para: Ponto): string {
  const dx = Math.max(30, Math.abs(para.x - de.x) / 2);
  return `M ${de.x} ${de.y} C ${de.x + dx} ${de.y}, ${para.x - dx} ${para.y}, ${para.x} ${para.y}`;
}
