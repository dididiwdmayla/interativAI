"use client";

import { useState } from "react";
import { BarraSuperior } from "@/componentes/layout/BarraSuperior";
import { AreaMascote } from "@/componentes/mascote/AreaMascote";
import { Mascote } from "@/componentes/mascote/Mascote";
import { BotaoInspecionar } from "@/componentes/painel/BotaoInspecionar";
import { CabecalhoEditor } from "@/componentes/painel/editor/CabecalhoEditor";
import { EditorCodigo } from "@/componentes/painel/editor/EditorCodigo";
import { Painel } from "@/componentes/painel/Painel";
import { PainelDividido } from "@/componentes/painel/PainelDividido";
import { JanelaNavegador } from "@/componentes/preview/JanelaNavegador";
import { PreviewSiteAlvo } from "@/componentes/preview/PreviewSiteAlvo";
import { BODY_INICIAL_PADARIA, HEAD_PADARIA, URL_PADARIA } from "@/fases/sites-elementos-1/siteAlvo";
import type { Aba } from "@/motor/abas";
import { useSiteAlvo } from "./useSiteAlvo";

const TRILHA = ["Ilha Sites", "Elementos", "Fase 1"] as const;

export function Jogo() {
  const [aba, setAba] = useState<Aba>("elementos");
  const [inspecionando, setInspecionando] = useState(false);
  const [quebrarLinhas, setQuebrarLinhas] = useState(true);
  const { editorRef, previewRef, versaoDocumento, aoEditarCodigo, aoCarregarDocumento } =
    useSiteAlvo(BODY_INICIAL_PADARIA);

  return (
    <div className="flex h-dvh flex-col">
      <BarraSuperior trilha={TRILHA} estrelas={3} logo={<Mascote tamanho={34} />} />
      <main className="flex min-h-0 flex-1 gap-4 p-4">
        <section aria-label="Painel" className="flex min-h-0 w-[45%] flex-col">
          <Painel
            abaAtiva={aba}
            abasDesbloqueadas={["elementos"]}
            aoTrocarAba={setAba}
            ferramentas={
              <BotaoInspecionar
                ativo={inspecionando}
                aoAlternar={() => setInspecionando((valor) => !valor)}
              />
            }
          >
            <PainelDividido
              rotulo="Redimensionar árvore e editor"
              proporcaoInicial={0.48}
              cima={
                <div className="h-full overflow-auto p-4 text-sm text-texto-suave">
                  Árvore de elementos (versão do documento: {versaoDocumento})
                </div>
              }
              baixo={
                <div className="flex h-full min-h-0 flex-col">
                  <CabecalhoEditor
                    quebrarLinhas={quebrarLinhas}
                    aoAlternarQuebra={() => setQuebrarLinhas((valor) => !valor)}
                  />
                  <div className="min-h-0 flex-1">
                    <EditorCodigo
                      ref={editorRef}
                      textoInicial={BODY_INICIAL_PADARIA}
                      aoMudar={aoEditarCodigo}
                      quebrarLinhas={quebrarLinhas}
                      rotulo="Editor do código HTML do corpo da página"
                    />
                  </div>
                </div>
              }
            />
          </Painel>
        </section>
        <section aria-label="Tela do site" className="flex min-h-0 flex-1 flex-col">
          <JanelaNavegador url={URL_PADARIA}>
            <PreviewSiteAlvo
              ref={previewRef}
              head={HEAD_PADARIA}
              bodyInicial={BODY_INICIAL_PADARIA}
              titulo="Site da Padaria Pão Quentinho"
              aoCarregar={aoCarregarDocumento}
            />
          </JanelaNavegador>
        </section>
      </main>
      <AreaMascote
        mascote={<Mascote tamanho={110} />}
        fala={<p className="rounded-2xl bg-painel p-3 font-bold">Oi! Eu sou o computadorzinho.</p>}
        objetivos={<p className="text-sm text-texto-suave">Objetivos da fase</p>}
      />
    </div>
  );
}
