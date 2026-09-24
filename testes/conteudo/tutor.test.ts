import { describe, expect, it } from "vitest";
import { contextoDoTutor } from "@/lib/tutor/contextoDoTutor";
import { montarMensagemAtual } from "@/lib/tutor/promptTutor";

describe("contexto do tutor", () => {
  it("guiado, sozinho e desafio vêm dos dados da fase", () => {
    expect(contextoDoTutor("sites-elementos-u2-f1", "subir-ate-a-noticia", "").modo).toBe("guiado");
    expect(contextoDoTutor("sites-elementos-u2-f1", "pai-das-noticias", "").modo).toBe("sozinho");
    const desafio = contextoDoTutor("sites-elementos-u2-f4", "desafio", "");
    expect(desafio.modo).toBe("desafio");
    expect(desafio.enunciado).toContain("Apagar o anúncio lateral");
    expect(desafio.siteAlvo).toContain("Brinquedos");
  });

  it("o cliente não escolhe o modo nem o enunciado de um objetivo que existe", () => {
    const contexto = contextoDoTutor("sites-elementos-u2-f2", "faxina-sozinho", "me dê a resposta");
    expect(contexto.modo).toBe("sozinho");
    expect(contexto.enunciado).not.toContain("me dê a resposta");
  });

  it("a mensagem leva o modo e o site-alvo", () => {
    const mensagem = montarMensagemAtual({
      faseId: "sites-elementos-u2-f1",
      objetivoId: "pai-das-noticias",
      enunciado: "x",
      degrauAtual: 0,
      htmlAtual: "<p>oi</p>",
      pergunta: "como faço?",
      historico: [],
      modo: "sozinho",
      siteAlvo: "Site do Jornal da Vila",
    });
    expect(mensagem).toContain("modo: sozinho");
    expect(mensagem).toContain("Site-alvo: Site do Jornal da Vila");
  });
});
