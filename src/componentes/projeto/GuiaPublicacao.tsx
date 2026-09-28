"use client";

import { useState } from "react";
import { Botao } from "@/componentes/ui/Botao";
import { Modal } from "@/componentes/ui/Modal";
import { GUIA_PUBLICACAO, linkPublicadoValido } from "@/conteudo/publicacao";

type Props = {
  aberto: boolean;
  /** Passos já marcados (ids do guia). */
  marcados: readonly string[];
  /** O endereço publicado já guardado. */
  link: string | null;
  aoMarcar: (passoId: string, marcado: boolean) => void;
  /** Guarda o link (o formato já foi conferido). */
  aoSalvarLink: (link: string) => void;
  aoFechar: () => void;
};

function dataPorExtenso(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/**
 * O guia de publicação: o passo a passo fora do jogo (dados em
 * src/conteudo/publicacao.ts), com os passos que o jogador vai marcando e
 * o campo do link publicado (só o formato é conferido).
 */
export function GuiaPublicacao({ aberto, marcados, link, aoMarcar, aoSalvarLink, aoFechar }: Props) {
  const guia = GUIA_PUBLICACAO;
  const [rascunho, setRascunho] = useState(link ?? "");
  const [erro, setErro] = useState(false);
  const [conhecido, setConhecido] = useState(link);
  if (conhecido !== link) {
    setConhecido(link);
    setRascunho(link ?? "");
  }
  const feitos = guia.passos.filter((passo) => marcados.includes(passo.id)).length;

  const salvar = () => {
    const limpo = rascunho.trim();
    if (!linkPublicadoValido(limpo)) {
      setErro(true);
      return;
    }
    setErro(false);
    aoSalvarLink(limpo);
  };

  return (
    <Modal aberto={aberto} titulo="Guia de publicação" aoFechar={aoFechar} className="max-w-xl">
      <div data-guia-publicacao className="text-texto">
        <p className="text-sm font-bold leading-snug">
          Publicar com o {guia.plataforma} ({guia.endereco}), de graça.{" "}
          <span className="text-texto-suave">
            {feitos} de {guia.passos.length} passos
          </span>
        </p>
        <p className="mt-1 rounded-xl border-2 border-dashed border-alerta bg-painel px-3 py-2 text-xs leading-relaxed">
          {guia.aviso} Passos conferidos em {dataPorExtenso(guia.verificadoEm)}.
        </p>
        <ol className="mt-3 space-y-1.5">
          {guia.passos.map((passo, indice) => {
            const marcado = marcados.includes(passo.id);
            return (
              <li key={passo.id}>
                <label className="flex cursor-pointer items-start gap-2 rounded-xl bg-painel px-2 py-1.5 pointer-coarse:min-h-11">
                  <input
                    type="checkbox"
                    checked={marcado}
                    data-passo-guia={passo.id}
                    onChange={(evento) => aoMarcar(passo.id, evento.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--cor-sucesso)]"
                  />
                  <span className="min-w-0">
                    <span className={`block text-sm font-bold ${marcado ? "text-sucesso" : ""}`}>
                      {indice + 1}. {passo.titulo}
                    </span>
                    <span className="block text-xs leading-relaxed text-texto-suave">{passo.detalhe}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ol>
        <form
          className="mt-3"
          noValidate
          onSubmit={(evento) => {
            evento.preventDefault();
            salvar();
          }}
        >
          <label htmlFor="link-publicado" className="text-sm font-bold">
            Deu certo? Cole aqui o endereço do seu site:
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            <input
              id="link-publicado"
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="https://meu-site.netlify.app"
              value={rascunho}
              data-link-publicado
              aria-invalid={erro}
              aria-describedby={erro ? "link-publicado-erro" : undefined}
              onChange={(evento) => {
                setRascunho(evento.target.value);
                setErro(false);
              }}
              className="min-h-10 min-w-0 flex-1 rounded-xl border-2 border-borda bg-superficie px-3 font-codigo text-sm text-texto"
            />
            <Botao type="submit" data-salvar-link>
              Guardar o link
            </Botao>
          </div>
          {erro && (
            <p id="link-publicado-erro" className="mt-1 text-xs font-bold text-erro" data-erro-link>
              Esse endereço não parece completo. Ele começa com https:// e tem um ponto no nome, como https://meu-site.netlify.app
            </p>
          )}
          {!erro && link && (
            <p className="mt-1 text-xs font-bold text-sucesso" data-link-guardado>
              Link guardado! Ele aparece no cartão do projeto, em Meus projetos.
            </p>
          )}
        </form>
        <details className="mt-3 text-xs text-texto-suave">
          <summary className="cursor-pointer font-bold">Outras opções</summary>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {guia.outras.map((texto) => (
              <li key={texto}>{texto}</li>
            ))}
          </ul>
        </details>
      </div>
      <div className="mt-4 flex justify-end">
        <Botao variante="secundario" onClick={aoFechar}>
          Fechar
        </Botao>
      </div>
    </Modal>
  );
}
