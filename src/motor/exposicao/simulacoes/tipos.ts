/*
 * As estações de SIMULAÇÃO do museu (salas 3 a 6): o aluno manda comandos
 * (texto curto, como "passo", "vez:musica" ou "pular:roteador-1") e a
 * estação responde com um estado novo; os validadores olham os MARCOS
 * (o que já aconteceu ou o que vale agora: "fim", "caixa:8=20",
 * "terminou-sem-engasgo"). Cada tipo diz os comandos e os marcos que
 * existem, e a fábrica confere o conteúdo contra eles.
 *
 * Uma ação (comandoNaEstacao) e um validador (marcoNaEstacao) servem a
 * todas: a tela, a simulação dos testes e as soluções passam pelas mesmas
 * funções.
 */
export type ModeloSimulacao<D, E> = {
  inicial(dados: D): E;
  /** O estado novo, ou null se o comando não existe ou não faz nada agora. */
  comando(dados: D, estado: E, comando: string): E | null;
  /** Os marcos de agora. */
  marcos(dados: D, estado: E): string[];
  /** O conteúdo pode pedir este marco (a fábrica confere). */
  marcoPossivel(dados: D, marco: string): boolean;
  /** O conteúdo pode mandar este comando (a fábrica confere). */
  comandoPossivel(dados: D, comando: string): boolean;
  conferir(dados: D, onde: string): string[];
  /** Lê o estado salvo no progresso (só a forma; `cabe` confere contra os dados). */
  ler(valor: Record<string, unknown>): E | null;
  cabe(dados: D, estado: E): boolean;
  resumo(dados: D, estado: E): string;
};

/** "vez:musica" vira ["vez", "musica"]; "passo" vira ["passo", ""]. */
export function partesDoComando(comando: string): [string, string] {
  const dois = comando.indexOf(":");
  return dois < 0 ? [comando, ""] : [comando.slice(0, dois), comando.slice(dois + 1)];
}
