export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { product, audience, goal, style } = req.body || {};

    if (!product || !audience || !goal || !style) {
      return res.status(400).json({
        error: "Заполнены не все поля",
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY не настроен в Vercel",
      });
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

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "Ошибка при обращении к OpenAI",
      });
    }

    const text =
      data?.output_text ||
      data?.output
        ?.flatMap((item: any) => item.content || [])
        ?.filter((item: any) => item.type === "output_text")
        ?.map((item: any) => item.text)
        ?.join("\n") ||
      "";

    if (!text) {
      return res.status(500).json({
        error: "AI не вернул текст",
      });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Внутренняя ошибка сервера",
    });
  }
}
