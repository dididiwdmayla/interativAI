/** Só conta trabalho visível e recente. Não depende do intervalo de salvamento. */
export const INATIVIDADE_MS = 60_000;

export class TempoTrabalho {
  private acumulado = 0;
  private desde: number;
  private ultimaInteracao: number;
  private trabalhando = false;
  private visivel = true;

  constructor(agora: number) { this.desde = agora; this.ultimaInteracao = agora; }

  tempo(agora: number): number {
    return this.acumulado + (this.trabalhando && this.visivel
      ? Math.max(0, Math.min(agora, this.ultimaInteracao + INATIVIDADE_MS) - this.desde) : 0);
  }

  atualizar(agora: number, { trabalhando = this.trabalhando, visivel = this.visivel, interacao = false }: { trabalhando?: boolean; visivel?: boolean; interacao?: boolean }): void {
    this.acumulado = this.tempo(agora);
    this.desde = agora;
    if (interacao || (trabalhando && !this.trabalhando) || (visivel && !this.visivel)) this.ultimaInteracao = agora;
    this.trabalhando = trabalhando;
    this.visivel = visivel;
  }
}
