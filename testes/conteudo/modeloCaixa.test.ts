import { describe, expect, it } from "vitest";
import { formatarMedida, valorDoLado } from "@/lib/modeloCaixa";

// Os números do diagrama do modelo de caixa, como o Chrome mostra
// (MetricsSidebarPane e toFixedIfFloating, no devtools-frontend).
describe("números do modelo de caixa", () => {
  it("inteiro sem casas, zero como 0", () => {
    expect(formatarMedida(12)).toBe("12");
    expect(formatarMedida(0)).toBe("0");
    expect(formatarMedida(-8)).toBe("-8");
  });

  it("quebrado com 3 casas", () => {
    expect(formatarMedida(111.4375)).toBe("111.438");
    expect(formatarMedida(13.28)).toBe("13.280");
    expect(formatarMedida(0.5)).toBe("0.500");
  });

  it("camada position: auto e vazio viram traço, px some", () => {
    expect(valorDoLado("auto")).toBe("‒");
    expect(valorDoLado("")).toBe("‒");
    expect(valorDoLado("10px")).toBe("10");
    expect(valorDoLado("-5.5px")).toBe("-5.500");
  });
});
