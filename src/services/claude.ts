// AI Life Advisor service. MOCKED in Phase 1.
//
// Integration seam (M2): replace `generateReply` with a fetch to a SERVER endpoint
// (EXPO_PUBLIC_ADVISOR_API_URL) that holds the Anthropic key. The key must NEVER ship
// to the device. The system prompt and crisis detection below are the contract that
// server must honor. See docs/ARCHITECTURE.md §5.

import type { AdvisorMessage, Language } from '@/types';

// ---------------------------------------------------------------------------
// Guardrails — these travel with every model call (server-side in production).
// ---------------------------------------------------------------------------
export const ANCHOR_SYSTEM_PROMPT = `You are the ANCHOR Life Advisor. You help everyday people who may be overwhelmed, isolated, or unsure where to turn.

TONE: Warm, calm, nonjudgmental, respectful. Write at a 6th-grade reading level. Short sentences. Reply in the user's language.

ALWAYS:
- Explain how things work and lay out OPTIONS.
- Ask one gentle clarifying question when you need more to help.
- Point to concrete resources and to licensed professionals.
- Remind the user, when relevant, that you share information, not professional advice.

NEVER:
- Never diagnose a medical or mental-health condition.
- Never give medical, legal, or financial ADVICE or tell the user what they MUST do.
- Never guess at dosages, legal strategy, or specific money moves.
- Never store personal details without the user's permission.

If the user expresses a crisis (self-harm, abuse, overdose, nowhere safe to go, immediate danger), STOP normal answering and gently direct them to "Get help now" in the app, to 988, or to 911 if in danger. Safety first.`;

// ---------------------------------------------------------------------------
// Crisis-language detection — runs BEFORE any model call. Defense in depth.
// Conservative by design: false positives route to help (safe); we accept them.
// ---------------------------------------------------------------------------
const CRISIS_PATTERNS: RegExp[] = [
  // self-harm / suicide
  /\b(kill myself|killing myself|end my life|suicid|don'?t want to (live|be here)|want to die|better off dead|hurt myself|harm myself)\b/i,
  /\b(quiero morir|matarme|suicid|quitarme la vida|no quiero vivir|hacerme daño|lastimarme)\b/i,
  // violence / abuse / danger
  /\b(he('?s)? hitting|she('?s)? hitting|being abused|he hurts me|she hurts me|afraid for my (life|safety)|he'?ll kill me)\b/i,
  /\b(me golpea|me pega|me lastima|tengo miedo de morir|me va a matar|abus)\b/i,
  // overdose / substances
  /\b(overdos|took too many|can'?t stop using|withdrawal and|going to relapse)\b/i,
  /\b(sobredosis|tomé demasiad|no puedo dejar)\b/i,
  // acute housing / safety
  /\b(nowhere (to go|safe)|sleeping on the street|no place to sleep tonight|homeless tonight)\b/i,
  /\b(no tengo a dónde ir|durmiendo en la calle|sin lugar para dormir)\b/i,
];

export function detectCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((re) => re.test(text));
}

// ---------------------------------------------------------------------------
// Mocked reply generator. Deterministic, on-tone, options-first.
// ---------------------------------------------------------------------------
export interface AdvisorContext {
  language: Language;
  /** Prior turns, oldest first. Used for shape only in the mock. */
  history: AdvisorMessage[];
  /** Whether the user consented to context memory. */
  rememberContext: boolean;
}

function mockReply(userText: string, ctx: AdvisorContext): string {
  const t = userText.toLowerCase();
  const es = ctx.language === 'es';

  const pick = (enText: string, esText: string) => (es ? esText : enText);

  if (/food|comida|hungry|hambre|eat|comer/.test(t)) {
    return pick(
      "It sounds like food is the priority right now. A few options: food pantries can give groceries today, and SNAP can help longer term. Want me to show food help near you in San Antonio? I share information, not advice — but I can point you to the right doors.",
      'Parece que la comida es lo más importante ahora. Algunas opciones: las despensas pueden darle comida hoy, y SNAP puede ayudar a largo plazo. ¿Quiere que le muestre ayuda con comida cerca de usted en San Antonio? Comparto información, no consejos — pero puedo mostrarle las puertas correctas.'
    );
  }
  if (/rent|evict|hous|renta|desaloj|vivienda|landlord/.test(t)) {
    return pick(
      "Housing stress is heavy — you're not alone in this. There are usually a few paths: rental assistance programs, tenant rights help, and emergency shelter if needed. To point you the right way, can I ask: is this about paying rent, an eviction notice, or needing a place tonight?",
      'El estrés de vivienda es difícil — no está solo en esto. Suele haber varios caminos: programas de ayuda con la renta, ayuda con derechos del inquilino, y refugio de emergencia si hace falta. Para guiarle bien, ¿puedo preguntar: es sobre pagar la renta, un aviso de desalojo, o necesitar un lugar esta noche?'
    );
  }
  if (/job|work|empleo|trabajo|unemploy/.test(t)) {
    return pick(
      "Looking for work takes courage. Options include free job centers (Workforce Solutions), training programs, and help with a résumé. What kind of work are you hoping to find? I can point you to local places that help for free.",
      'Buscar trabajo toma valor. Las opciones incluyen centros de empleo gratis (Workforce Solutions), programas de capacitación y ayuda con el currículum. ¿Qué tipo de trabajo espera encontrar? Puedo mostrarle lugares locales que ayudan gratis.'
    );
  }
  if (/legal|lawyer|abogado|court|corte|immigra|inmigra/.test(t)) {
    return pick(
      "Legal questions can feel scary, but there's free help. Legal aid groups can explain your options and may represent you. I can share information, but a licensed attorney should guide your decisions. Can you tell me a little about the situation so I point you to the right kind of help?",
      'Las preguntas legales pueden dar miedo, pero hay ayuda gratis. Los grupos de ayuda legal pueden explicar sus opciones y a veces representarle. Puedo compartir información, pero un abogado con licencia debe guiar sus decisiones. ¿Me cuenta un poco de la situación para mostrarle el tipo de ayuda correcto?'
    );
  }
  if (/sad|depress|anx|alone|triste|soledad|ansiedad|stress|estr[eé]s/.test(t)) {
    return pick(
      "Thank you for telling me. Carrying that is hard, and reaching out matters. Some people find it helps to talk to a counselor — there are free and low-cost options nearby. Would it help to see mental-health resources, or to talk through what's weighing on you most?",
      'Gracias por contarme. Cargar con eso es difícil, y pedir ayuda importa. A muchas personas les ayuda hablar con un consejero — hay opciones gratis y de bajo costo cerca. ¿Le ayudaría ver recursos de salud mental, o hablar sobre lo que más le pesa?'
    );
  }

  return pick(
    "I'm here to help you think it through. Tell me a little more about what's going on, and I'll lay out some options and point you to local help. I share information, not medical, legal, or financial advice.",
    'Estoy aquí para ayudarle a pensarlo. Cuénteme un poco más de lo que pasa, y le mostraré algunas opciones y ayuda local. Comparto información, no consejos médicos, legales ni financieros.'
  );
}

// ─── M2 server integration (live Claude via the Railway proxy) ──────────────
const M2_URL = process.env.EXPO_PUBLIC_M2_URL;
const APP_SECRET = process.env.EXPO_PUBLIC_APP_SECRET;

export const m2Configured = !!M2_URL && !!APP_SECRET;

async function callM2(
  userText: string,
  ctx: AdvisorContext
): Promise<{ content: string; crisis: boolean } | null> {
  try {
    const history = ctx.history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 1000) }));

    const res = await fetch(`${M2_URL}/advisor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-anchor-secret': APP_SECRET as string,
      },
      body: JSON.stringify({ message: userText, history, language: ctx.language }),
    });

    const data = (await res.json()) as {
      ok: boolean;
      message: string;
      crisis?: { level: string; category: string };
    };

    if (!data.message) return null;
    return {
      content: data.message,
      crisis: data.crisis?.level === 'high',
    };
  } catch {
    // Network/server failure → caller falls back to the local mock.
    return null;
  }
}

/**
 * Generate an advisor reply. Returns a crisis flag so the UI can hard-route.
 * Defense in depth: local crisis detection runs FIRST (works offline, instant);
 * the M2 server re-checks server-side. Mock replies remain the offline fallback.
 */
export async function generateReply(
  userText: string,
  ctx: AdvisorContext
): Promise<{ content: string; crisis: boolean }> {
  if (detectCrisis(userText)) {
    return {
      crisis: true,
      content:
        ctx.language === 'es'
          ? 'Parece que puede estar pasando por algo serio. Su seguridad es lo primero. Toque “Obtener ayuda ahora”, o llame al 988. Si está en peligro, llame al 911.'
          : 'It sounds like you may be going through something serious. Your safety comes first. Tap “Get help now,” or call 988. If you are in danger, call 911.',
    };
  }

  // Live advisor via M2 when configured.
  if (m2Configured) {
    const live = await callM2(userText, ctx);
    if (live) return live;
  }

  // Offline / unconfigured fallback — deterministic, on-tone mock.
  await new Promise((r) => setTimeout(r, 350));
  return { crisis: false, content: mockReply(userText, ctx) };
}
