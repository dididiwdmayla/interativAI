import { ApiError, type Content, GoogleGenAI, ThinkingLevel } from "@google/genai";
import { FASES } from "@/fases";
import { interpretarRespostaTutor } from "@/lib/tutor/interpretarResposta";
import { ESQUEMA_RESPOSTA_TUTOR, montarMensagemAtual, PROMPT_SISTEMA_TUTOR } from "@/lib/tutor/promptTutor";
import { validarEntradaTutor } from "@/lib/tutor/validarEntrada";

export const runtime = "nodejs";

/** Flash mais recente e estável listado na doc oficial do Gemini (set/2026). */
const MODELO_PADRAO = "gemini-3.8-flash";
const TEMPO_LIMITE_MS = 20_000;

/**
 * Falhas esperadas (sem chave, limite, rede) voltam com status 200 e o campo
 * "erro": o cliente mostra "sem sinal" e o console do navegador fica limpo.
 * Só entrada inválida usa 400, porque aí o erro é de quem chamou.
 */
function erro(codigo: "sem-chave" | "entrada-invalida" | "limite" | "falha") {
  return Response.json({ erro: codigo }, { status: codigo === "entrada-invalida" ? 400 : 200 });
}

export async function POST(requisicao: Request) {
  const chave = process.env.GEMINI_API_KEY?.trim();
  if (!chave) return erro("sem-chave");

  let corpo: unknown;
  try {
    corpo = await requisicao.json();
  } catch {
    return erro("entrada-invalida");
  }
  const entrada = validarEntradaTutor(corpo);
  if (!entrada) return erro("entrada-invalida");

  // O enunciado oficial vem dos dados da fase; o do cliente é só reserva.
  const objetivo = FASES.find((fase) => fase.id === entrada.faseId)?.objetivos.find(
    (item) => item.id === entrada.objetivoId,
  );
  const enunciado = objetivo?.enunciado ?? entrada.enunciado;

  const historico: Content[] = entrada.historico.map((mensagem) => ({
    role: mensagem.papel === "aluno" ? "user" : "model",
    parts: [{ text: mensagem.texto }],
  }));
  while (historico.length > 0 && historico[0].role !== "user") historico.shift();

  const modelo = process.env.GEMINI_MODEL?.trim() || MODELO_PADRAO;
  const ai = new GoogleGenAI({ apiKey: chave });

  try {
    const resposta = await ai.models.generateContent({
      model: modelo,
      contents: [
        ...historico,
        { role: "user", parts: [{ text: montarMensagemAtual({ ...entrada, enunciado }) }] },
      ],
      config: {
        systemInstruction: PROMPT_SISTEMA_TUTOR,
        responseMimeType: "application/json",
        responseJsonSchema: ESQUEMA_RESPOSTA_TUTOR,
        temperature: 0.7,
        maxOutputTokens: 1024,
        ...(modelo.startsWith("gemini-3") ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } } : {}),
        httpOptions: { timeout: TEMPO_LIMITE_MS, retryOptions: { attempts: 1 } },
      },
    });
    const saida = interpretarRespostaTutor(resposta.text ?? "");
    if (!saida) return erro("falha");
    return Response.json(saida);
  } catch (falha) {
    if (falha instanceof ApiError && falha.status === 429) return erro("limite");
    console.error("Tutor indisponível:", falha instanceof Error ? falha.message : "erro desconhecido");
    return erro("falha");
  }
}
