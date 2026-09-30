/*
 * Busca simulada (src/motor/busca.ts) e os validadores dela: corte
 * aproximado, título e descrição inventados, noindex, JSON com a linha do
 * erro e os dados estruturados de negócio local.
 */
import { describe, expect, it } from "vitest";
import {
  analisarDadosEstruturados,
  conferirDadosEstruturados,
  cortarTexto,
  enderecoNaBusca,
  larguraAproximada,
  lerJsonComLinha,
  resultadoNaBusca,
  TIPOS_DE_NEGOCIO_LOCAL,
} from "@/motor/busca";
import { avaliarDetalhado, type ContextoValidacao } from "@/motor/validadores";
import type { Validador } from "@/conteudo/tipos";

function documento(head: string, body = "<h1>Padaria Estrela</h1><p>Pão quentinho toda manhã.</p>"): Document {
  return new DOMParser().parseFromString(`<!DOCTYPE html><html><head>${head}</head><body>${body}</body></html>`, "text/html");
}

function passa(validador: Validador, doc: Document): boolean {
  const contexto: ContextoValidacao = { documento: doc, inicial: doc, selecao: null, eventos: [] };
  return avaliarDetalhado(validador, contexto).passou;
}

const NEGOCIO = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Bakery",
  "name": "Padaria Estrela",
  "address": { "@type": "PostalAddress", "streetAddress": "Rua das Flores, 10", "addressLocality": "Campinas", "addressRegion": "SP" },
  "telephone": "(19) 3000-0000",
  "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday"], "opens": "06:00", "closes": "20:00" }
}
</script>`;

describe("corte aproximado", () => {
  it("letras largas ocupam mais que estreitas", () => {
    expect(larguraAproximada("mmmm", 20)).toBeGreaterThan(larguraAproximada("iiii", 20));
  });

  it("título curto não corta; longo corta na palavra inteira com ...", () => {
    expect(cortarTexto("Padaria Estrela", 580, 20)).toEqual({ texto: "Padaria Estrela", cortou: false });
    const longo = cortarTexto(
      "Padaria Estrela, o melhor pão francês, sonhos, bolos caseiros, salgados e cafés especiais de Campinas e região",
      580,
      20,
    );
    expect(longo.cortou).toBe(true);
    expect(longo.texto.endsWith(" ...")).toBe(true);
    expect(longo.texto.replace(" ...", "").length).toBeLessThan(70);
  });

  it("a descrição corta antes no celular", () => {
    const texto = "Pão francês saindo a cada hora, bolos caseiros de fubá e de cenoura, salgados assados e café coado na hora, das seis da manhã às oito da noite.";
    const doc = documento(`<title>Padaria</title><meta name="description" content="${texto}">`);
    expect(resultadoNaBusca(doc, "x.exemplo", "computador").descricao.cortou).toBe(false);
    expect(resultadoNaBusca(doc, "x.exemplo", "celular").descricao.cortou).toBe(true);
  });
});

describe("resultado na busca", () => {
  it("sem title e sem description, a busca inventa com o h1 e o primeiro parágrafo", () => {
    const resultado = resultadoNaBusca(documento(""), "padariaestrela.exemplo");
    expect(resultado.titulo).toMatchObject({ declarado: null, exibido: "Padaria Estrela", inventado: true });
    expect(resultado.descricao).toMatchObject({ declarado: null, exibido: "Pão quentinho toda manhã.", inventado: true });
  });

  it("endereço como a busca mostra", () => {
    expect(enderecoNaBusca("https://padariaestrela.exemplo/cardapio/")).toBe("padariaestrela.exemplo › cardapio");
  });

  it("noindex tira a página da busca e some com o cartão", () => {
    const doc = documento(`<meta name="robots" content="noindex, follow">${NEGOCIO}`);
    const resultado = resultadoNaBusca(doc, "x.exemplo");
    expect(resultado.indexavel).toBe(false);
    expect(resultado.negocio).toBeNull();
    expect(passa({ tipo: "indexavel", valor: false }, doc)).toBe(true);
    expect(passa({ tipo: "indexavel", valor: true }, doc)).toBe(false);
  });

  it("com dados de negócio local válidos, aparece o cartão no mapa", () => {
    const negocio = resultadoNaBusca(documento(NEGOCIO), "x.exemplo").negocio;
    expect(negocio).toEqual({
      nome: "Padaria Estrela",
      tipo: "Bakery",
      endereco: "Rua das Flores, 10, Campinas, SP",
      horario: "seg, ter: 06:00 às 20:00",
      telefone: "(19) 3000-0000",
    });
  });

  it("validador resultadoBusca: declarado, com trecho e sem corte", () => {
    const sem = documento("");
    expect(passa({ tipo: "resultadoBusca", campo: "titulo" }, sem)).toBe(false);
    const com = documento('<title>Padaria Estrela | Campinas</title><meta name="description" content="Pão quentinho em Campinas.">');
    expect(passa({ tipo: "resultadoBusca", campo: "titulo", contem: "padaria estrela", semCorte: true }, com)).toBe(true);
    expect(passa({ tipo: "resultadoBusca", campo: "descricao", contem: "Rio" }, com)).toBe(false);
    const longo = documento(`<title>${"Padaria Estrela pães bolos salgados cafés doces ".repeat(3)}</title>`);
    expect(passa({ tipo: "resultadoBusca", campo: "titulo", semCorte: true }, longo)).toBe(false);
  });
});

describe("JSON com a linha do erro", () => {
  it("lê JSON certo", () => {
    expect(lerJsonComLinha('{"a": [1, true, null, "x"]}')).toEqual({ ok: true, valor: { a: [1, true, null, "x"] } });
  });

  it("aponta a linha da vírgula que falta", () => {
    const leitura = lerJsonComLinha('{\n  "name": "Padaria"\n  "telephone": "1"\n}');
    expect(leitura.ok).toBe(false);
    if (!leitura.ok) {
      expect(leitura.linha).toBe(3);
      expect(leitura.mensagem).toContain("vírgula");
    }
  });

  it("aponta vírgula sobrando e aspas simples", () => {
    const sobrando = lerJsonComLinha('{\n  "name": "Padaria",\n}');
    expect(sobrando.ok === false && sobrando.linha === 3 && sobrando.mensagem.includes("sobrando")).toBe(true);
    const simples = lerJsonComLinha("{'name': 'x'}");
    expect(simples.ok === false && simples.mensagem.includes("aspas duplas")).toBe(true);
  });
});

describe("teste de dados estruturados", () => {
  it("aponta os obrigatórios que faltam e os recomendados ausentes", () => {
    const doc = documento('<script type="application/ld+json">{"@context": "https://schema.org", "@type": "LocalBusiness", "telephone": "1"}</script>');
    const [bloco] = analisarDadosEstruturados(doc);
    expect(bloco.itens[0].faltam).toEqual(["name", "address"]);
    expect(bloco.itens[0].recomendadosAusentes).toContain("openingHoursSpecification");
    expect(bloco.itens[0].recomendadosAusentes).not.toContain("telephone");
  });

  it("JSON quebrado vira erro com linha, e o validador não passa", () => {
    const doc = documento('<script type="application/ld+json">\n{\n"@type": "Bakery"\n"name": "x"\n}</script>');
    const [bloco] = analisarDadosEstruturados(doc);
    expect(bloco.erro?.linha).toBe(4);
    expect(conferirDadosEstruturados(doc, "LocalBusiness", ["name"]).passou).toBe(false);
  });

  it("LocalBusiness aceita o subtipo; campos com ponto", () => {
    const doc = documento(NEGOCIO);
    expect(passa({ tipo: "dadosEstruturados", tipoSchema: "LocalBusiness", campos: ["name", "address.streetAddress"] }, doc)).toBe(true);
    expect(passa({ tipo: "dadosEstruturados", tipoSchema: "Bakery", campos: ["geo"] }, doc)).toBe(false);
    expect(passa({ tipo: "dadosEstruturados", tipoSchema: "Restaurant", campos: [] }, doc)).toBe(false);
  });

  it("@graph com @context no topo vale", () => {
    const doc = documento(
      '<script type="application/ld+json">{"@context": "https://schema.org", "@graph": [{"@type": "WebSite", "name": "x"}, {"@type": "Store", "name": "Loja", "address": "Rua A, 1"}]}</script>',
    );
    const [bloco] = analisarDadosEstruturados(doc);
    expect(bloco.itens.map((item) => item.tipo)).toEqual(["WebSite", "Store"]);
    expect(bloco.itens[1].avisos).toEqual([]);
    expect(resultadoNaBusca(doc, "x.exemplo").negocio?.endereco).toBe("Rua A, 1");
  });
});

describe("subtipos de LocalBusiness", () => {
  // Os subtipos comuns conferidos em 30/09/2026 (dados-estruturados-schema, em src/conteudo/plataformas-marketing.ts).
  const DO_ARQUIVO = [
    "Bakery", "CafeOrCoffeeShop", "Restaurant", "BarOrPub", "IceCreamShop", "FastFoodRestaurant", "FoodEstablishment",
    "HairSalon", "BeautySalon", "NailSalon", "DaySpa", "TattooParlor", "HealthAndBeautyBusiness", "Dentist",
    "Plumber", "Electrician", "RoofingContractor", "HousePainter", "HomeAndConstructionBusiness",
    "AutoRepair", "AutoWash", "AutoDealer", "AutomotiveBusiness", "LegalService", "RealEstateAgent", "PetStore", "ClothingStore", "Store",
  ];

  it("a lista do validador tem todos os subtipos que o arquivo de plataformas cita", () => {
    const faltam = DO_ARQUIVO.filter((tipo) => !TIPOS_DE_NEGOCIO_LOCAL.includes(tipo));
    expect(faltam).toEqual([]);
  });

  it("um encanador (Plumber) é negócio local e pede name e address", () => {
    const doc = documento(
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Plumber","name":"Hidráulica"}</script>',
      "<p>x</p>",
    );
    const [bloco] = analisarDadosEstruturados(doc);
    expect(bloco.itens[0].negocioLocal).toBe(true);
    expect(bloco.itens[0].faltam).toEqual(["address"]);
  });
});
