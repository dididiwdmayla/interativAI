/*
 * Validadores escritos em código. Use QUASE NUNCA.
 *
 * Só registre um aqui quando nenhuma combinação de validadores
 * declarativos (todos, algum, nao, contagem, textoIgual...) consegue
 * dizer o que o objetivo pede. Cada entrada precisa de um comentário
 * explicando por que o declarativo não serve. Os testes de conteúdo
 * acusam qualquer "custom" cujo id não esteja registrado aqui.
 *
 * Exemplo (não usado):
 *
 *   // Por que custom: precisa comparar a ORDEM dos itens, e nenhum
 *   // validador declarativo olha ordem.
 *   "vitrine-em-ordem-alfabetica": ({ documento }) => { ... },
 */
import type { ContextoValidacao } from "@/motor/validadores";

export const VALIDADORES_CUSTOM: Record<string, (contexto: ContextoValidacao) => boolean> = {};
