export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await req.json();

    const {
      product,
      audience,
      goal,
      style,
    } = body;

    if (!product || !audience || !goal || !style) {
      return new Response(
        JSON.stringify({
          error: "Заполнены не все поля",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY не настроен в Vercel",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const prompt = `
Ты профессиональный AI-таргетолог и рекламный копирайтер.

Создай готовый рекламный текст на русском языке.

ПРОДУКТ / УСЛУГА:
${product}

ЦЕЛЕВАЯ АУДИТОРИЯ:
${audience}

ЦЕЛЬ РЕКЛАМЫ:
${goal}

СТИЛЬ:
${style}

Создай результат в следующем формате:

ЗАГОЛОВОК:
Короткий сильный заголовок.

ОФФЕР:
Главное предложение для клиента.

ОСНОВНОЙ ТЕКСТ:
Убедительный рекламный текст 2–4 абзаца.

ПРИЗЫВ К ДЕЙСТВИЮ:
Конкретный CTA.

ТРЕБОВАНИЯ:
- пиши естественно, без канцелярита;
- не используй фразы вроде "мы лучшие на рынке";
- не придумывай факты, которых нет в описании;
- делай текст конкретным;
- учитывай целевую аудиторию;
- текст должен быть готов к использованию в рекламе.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        input: prompt,
        max_output_tokens: 900,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);

      return new Response(
        JSON.stringify({
          error:
            data?.error?.message ||
            "Ошибка при обращении к OpenAI",
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const text =
      data?.output
        ?.flatMap((item: any) => item.content || [])
        ?.filter((item: any) => item.type === "output_text")
        ?.map((item: any) => item.text)
        ?.join("\n") || "";

    if (!text) {
      return new Response(
        JSON.stringify({
          error: "AI не вернул текст",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        text,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: "Внутренняя ошибка сервера",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
