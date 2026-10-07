import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O Python do comparador (Pyodide, uns 13 MB) mora numa pasta com a versão no nome:
  // pode ficar no cache do navegador para sempre (versão nova, pasta nova).
  async headers() {
    return [
      {
        source: "/pyodide/:caminho*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
