import { ApiError, type Content, GoogleGenAI, ThinkingLevel } from "@google/genai";
import { faseDoId } from "@/conteudo";
import { interpretarRespostaTutor } from "@/lib/tutor/interpretarResposta";
import {
  ESQUEMA_RESPOSTA_TUTOR,
  type ModoTutor,
  montarMensagemAtual,
  PROMPT_SISTEMA_TUTOR,
} from "@/lib/tutor/promptTutor";
import { gerarComResiliencia, type Tentativa } from "@/lib/tutor/resiliencia";
import type { TipoErroTutor } from "@/lib/tutor/tipos";
import { validarEntradaTutor } from "@/lib/tutor/validarEntrada";

export const runtime = "nodejs";

/**
 * Teto da função na Vercel. Com Fluid compute o padrão e o máximo do plano
 * Hobby são 300 s (doc da Vercel, set/2026); 60 s cobre com folga o
 * orçamento das tentativas abaixo.
 */
export const maxDuration = 60;

/** Flash mais recente e estável listado na doc oficial do Gemini (set/2026). */
const MODELO_PADRAO = "gemini-3.8-flash";
/** Flash-Lite atual da doc oficial, usado só quando o principal está sobrecarregado. */
const MODELO_RESERVA_PADRAO = "gemini-3.5-flash-lite";
/** Tempo máximo de cada tentativa isolada. */
const TEMPO_LIMITE_MS = 15_000;
/** Soma de todas as tentativas e esperas; fica bem abaixo de maxDuration. */
const ORCAMENTO_MS = 45_000;

/**
 * Falhas esperadas voltam com status 200 e `{ erro: { tipo } }`: o cliente
 * escolhe a fala certa e o console do navegador fica limpo. Só entrada
 * inválida usa 400, porque aí o erro é de quem chamou.
 */
function erro(tipo: TipoErroTutor, status = 200) {
  return Response.json({ erro: { tipo } }, { status });
}

/**
 * Simulação para testes locais (nunca em produção): TUTOR_SIMULAR=sobrecarga
 * faz o principal responder 503 e o reserva responder; "sobrecarga-total"
 * faz os dois falharem; "rede" simula queda de conexão.
 */
function tentativaSimulada(modo: string, reserva: string): Tentativa | null {
  if (process.env.NODE_ENV === "production") return null;
  if (modo !== "sobrecarga" && modo !== "sobrecarga-total" && modo !== "rede") return null;
  return async (modelo) => {
    await new Promise((resolver) => setTimeout(resolver, 150));
    if (modo === "rede") throw new TypeError("fetch failed");
    if (modo === "sobrecarga" && modelo === reserva) {
      return JSON.stringify({ texto: "Resposta simulada do modelo reserva.", expressao: "feliz" });
    }
    throw new ApiError({ message: "This model is currently experiencing high demand. UNAVAILABLE", status: 503 });
  };
}

export async function POST(requisicao: Request) {
  const modelo = process.env.GEMINI_MODEL?.trim() || MODELO_PADRAO;
  const reserva = process.env.GEMINI_MODEL_RESERVA?.trim() || MODELO_RESERVA_PADRAO;
  const simulada = tentativaSimulada(process.env.TUTOR_SIMULAR?.trim() ?? "", reserva);
  const chave = process.env.GEMINI_API_KEY?.trim();
  if (!chave && !simulada) {
    console.warn("[tutor] tipo=sem_chave status=- modelo=-");
    return erro("sem_chave");
  }

  let corpo: unknown;
  try {
    corpo = await requisicao.json();
  } catch {
    return erro("desconhecido", 400);
  }
  const entrada = validarEntradaTutor(corpo);
  if (!entrada) return erro("desconhecido", 400);

  // Enunciado e modo oficiais vêm dos dados da fase; os do cliente são só reserva.
  const fase = faseDoId(entrada.faseId);
  const objetivo =
    fase?.tipo === "pratica" ? fase.objetivos.find((item) => item.id === entrada.objetivoId) : undefined;
  const modo: ModoTutor = fase?.tipo === "desafio" ? "desafio" : (objetivo?.modo ?? "guiado");
  const enunciado =
    fase?.tipo === "desafio"
      ? `Desafio, sem passo a passo. Partes: ${fase.partes.map((parte) => parte.descricao).join("; ")}`
      : (objetivo?.enunciado.mouse ?? entrada.enunciado);
  const siteAlvo = fase?.siteAlvo.titulo ?? "site fictício";

  const historico: Content[] = entrada.historico.map((mensagem) => ({
    role: mensagem.papel === "aluno" ? "user" : "model",
    parts: [{ text: mensagem.texto }],
  }));
  while (historico.length > 0 && historico[0].role !== "user") historico.shift();
  const contents: Content[] = [
    ...historico,
    { role: "user", parts: [{ text: montarMensagemAtual({ ...entrada, enunciado, modo, siteAlvo }) }] },
  ];

  const ai = chave ? new GoogleGenAI({ apiKey: chave }) : null;
  const tentarNoGemini: Tentativa = async (nomeModelo, tempoLimiteMs) => {
    if (!ai) throw new Error("sem cliente");
    const resposta = await ai.models.generateContent({
      model: nomeModelo,
      contents,
      config: {
        systemInstruction: PROMPT_SISTEMA_TUTOR,
        responseMimeType: "application/json",
        responseJsonSchema: ESQUEMA_RESPOSTA_TUTOR,
        temperature: 0.7,
        maxOutputTokens: 1024,
        ...(nomeModelo.startsWith("gemini-3") ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } } : {}),
        // As novas tentativas são nossas (com log e orçamento), não do SDK.
        httpOptions: { timeout: tempoLimiteMs, retryOptions: { attempts: 1 } },
      },
    });
    return resposta.text ?? "";
  };

  const resultado = await gerarComResiliencia({
    principal: modelo,
    reserva,
    tentar: simulada ?? tentarNoGemini,
    orcamentoMs: ORCAMENTO_MS,
    tempoLimiteMs: TEMPO_LIMITE_MS,
  });

  if (!resultado.ok) {
    const { tipo, status } = resultado.falha;
    console.warn(
      `[tutor] tipo=${tipo} status=${status ?? "-"} modelo=${modelo} tentativas=${resultado.tentativas}`,
    );
    return erro(tipo);
  }

  const saida = interpretarRespostaTutor(resultado.texto);
  if (!saida) {
    console.warn(`[tutor] tipo=desconhecido status=200 modelo=${resultado.modelo} motivo=resposta-vazia`);
    return erro("desconhecido");
  }
  if (resultado.papel === "reserva" || resultado.tentativas > 1) {
    console.info(
      `[tutor] respondeu=${resultado.papel} modelo=${resultado.modelo} tentativas=${resultado.tentativas}`,
    );
  }
  return Response.json(saida);
}
