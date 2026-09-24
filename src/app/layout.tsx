import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Nunito } from "next/font/google";
import { Provedores } from "@/componentes/ui/Provedores";
import { SegredoDoF12 } from "@/componentes/ui/SegredoDoF12";
import { SCRIPT_TEMA_INICIAL } from "@/tema/scriptTemaInicial";
import { TEMA_PADRAO } from "@/tema/temas";
import "./globals.css";

const fonteUi = Nunito({
  subsets: ["latin"],
  variable: "--fonte-ui",
  display: "swap",
});

const fonteCodigo = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--fonte-codigo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "InterativAI | Ilha Sites",
  description:
    "Aprenda a mexer em qualquer site usando uma versão simplificada do F12, com a ajuda do computadorzinho.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Chrome Android: o teclado virtual encolhe a página (e o dvh) em vez de cobrir.
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-theme={TEMA_PADRAO}
      className={`${fonteUi.variable} ${fonteCodigo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA_INICIAL }} />
      </head>
      <body className="font-ui antialiased">
        <SegredoDoF12 />
        <Provedores>{children}</Provedores>
      </body>
    </html>
  );
}
