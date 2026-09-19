import { useState } from "react";
import {
  BarChart3,
  ChevronRight,
  CircleUserRound,
  Copy,
  Home,
  Image,
  Megaphone,
  Plus,
  Sparkles,
  Target,
  WandSparkles,
  ArrowLeft,
  Check,
  TrendingUp,
  Zap,
} from "lucide-react";

type Tab = "home" | "create" | "analytics" | "creatives" | "profile";

const gold = "#f6c453";

function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [step, setStep] = useState(1);

  const [goal, setGoal] = useState("");
  const [style, setStyle] = useState("");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");

  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nav = [
    { id: "home" as Tab, label: "Главная", icon: Home },
    { id: "create" as Tab, label: "Создать", icon: Plus },
    { id: "analytics" as Tab, label: "Аналитика", icon: BarChart3 },
    { id: "creatives" as Tab, label: "Креативы", icon: Image },
    { id: "profile" as Tab, label: "Профиль", icon: CircleUserRound },
  ];

  const generate = async () => {
    setLoading(true);
    setError("");
    setGeneratedText("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          audience,
          goal,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Ошибка генерации");
      }

      setGeneratedText(data.text);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось получить ответ от AI"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!generatedText) return;

    await navigator.clipboard?.writeText(generatedText);
  };

  const resetCreate = () => {
    setStep(1);
    setProduct("");
    setAudience("");
    setGoal("");
    setStyle("");
    setGeneratedText("");
    setError("");
  };

  return (
    <div className="app">
      <div className="glow glow1" />
      <div className="glow glow2" />

      <header className="topbar">
        <div className="brand">
          <span className="brandMark">AI</span>
          <span>
            Targetologist <b>PRO</b>
          </span>
        </div>

        <div className="credits">
          <Zap size={14} fill={gold} color={gold} />
          8 / 10
        </div>
      </header>

      <main className="content">
        {tab === "home" && (
          <section>
            <div className="hero">
              <div className="eyebrow">
                <Sparkles size={15} />
                AI MARKETING ASSISTANT
              </div>

              <h1>
                Твой AI-<span>таргетолог</span>
              </h1>

              <p>
                Создавай рекламу, анализируй кампании и получай идеи
                для креативов за минуты.
              </p>

              <button
                className="primary big"
                onClick={() => {
                  setTab("create");
                  setStep(1);
                }}
              >
                <Plus size={19} />
                Создать рекламу
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="usage card">
              <div className="row">
                <div>
                  <strong>Генерации</strong>
                  <small>Обновятся завтра</small>
                </div>

                <strong>8 из 10</strong>
              </div>

              <div className="progress">
                <span style={{ width: "80%" }} />
              </div>
            </div>

            <div className="sectionTitle">
              Что умеет AI Targetologist
            </div>

            <div className="grid">
              <Action
                icon={Megaphone}
                title="Создать рекламу"
                text="Тексты и офферы"
                onClick={() => {
                  setTab("create");
                  setStep(1);
                }}
              />

              <Action
                icon={BarChart3}
                title="Проанализировать"
                text="Найди точки роста"
                onClick={() => setTab("analytics")}
              />

              <Action
                icon={WandSparkles}
                title="Создать креативы"
                text="Идеи для визуалов"
                onClick={() => setTab("creatives")}
              />

              <Action
                icon={Target}
                title="Целевая аудитория"
                text="Сегменты и боли"
                onClick={() => {
                  setTab("create");
                  setStep(2);
                }}
              />
            </div>
          </section>
        )}

        {tab === "create" && (
          <section>
            <div className="pageHead">
              <button
                className="iconBtn"
                onClick={() => setTab("home")}
              >
                <ArrowLeft />
              </button>

              <div>
                <div className="eyebrow">CAMPAIGN BUILDER</div>
                <h2>Создать рекламу</h2>
              </div>
            </div>

            <div className="steps">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  className={n <= step ? "step active" : "step"}
                  key={n}
                >
                  {n < step ? <Check size={14} /> : n}
                </div>
              ))}
            </div>

            <div className="card wizard">
              {step === 1 && (
                <Wizard
                  title="Что рекламируем?"
                  sub="Опиши продукт или услугу"
                  placeholder="Например: онлайн-школа английского языка..."
                  value={product}
                  onChange={setProduct}
                />
              )}

              {step === 2 && (
                <Wizard
                  title="Кто ваш клиент?"
                  sub="Опиши целевую аудиторию"
                  placeholder="Например: предприниматели 25–45 лет..."
                  value={audience}
                  onChange={setAudience}
                />
              )}

              {step === 3 && (
                <Wizard
                  title="Какая цель?"
                  sub="Выбери основную цель кампании"
                >
                  <div className="options">
                    {[
                      "Получить заявки",
                      "Продать продукт",
                      "Привлечь подписчиков",
                      "Увеличить узнаваемость",
                    ].map((x) => (
                      <button
                        type="button"
                        className={goal === x ? "selected" : ""}
                        onClick={() => setGoal(x)}
                        key={x}
                      >
                        <span>{x}</span>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                </Wizard>
              )}

              {step === 4 && (
                <Wizard
                  title="Выбери стиль"
                  sub="Каким должен быть рекламный текст?"
                >
                  <div className="options">
                    {[
                      "Экспертный",
                      "Дерзкий",
                      "Премиальный",
                      "Дружелюбный",
                    ].map((x) => (
                      <button
                        type="button"
                        className={style === x ? "selected" : ""}
                        onClick={() => setStyle(x)}
                        key={x}
                      >
                        <span>{x}</span>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                </Wizard>
              )}

              {step === 5 && (
                <div className="result">
                  <div className="resultIcon">
                    <Sparkles />
                  </div>

                  <h3>
                    {generatedText
                      ? "Реклама готова"
                      : "Готовы создать рекламу"}
                  </h3>

                  <p>
                    AI создаст рекламный текст на основе твоих
                    данных, цели и выбранного стиля.
                  </p>

                  {loading && (
                    <div className="generated">
                      <b>AI создаёт рекламу...</b>
                      <br />
                      Анализируем аудиторию и формируем оффер.
                    </div>
                  )}

                  {error && (
                    <div className="generated">
                      <b>Ошибка</b>
                      <br />
                      {error}
                    </div>
                  )}

                  {generatedText && (
                    <div className="generated">
                      {generatedText}
                    </div>
                  )}

                  <button
                    className="primary"
                    onClick={generate}
                    disabled={loading}
                  >
                    <Sparkles size={17} />

                    {loading
                      ? "Генерируем..."
                      : generatedText
                      ? "Сгенерировать ещё"
                      : "Сгенерировать рекламу"}
                  </button>

                  {generatedText && (
                    <button
                      type="button"
                      className="secondary"
                      onClick={copyText}
                    >
                      <Copy size={16} />
                      Скопировать
                    </button>
                  )}
                </div>
              )}

              {step < 5 && (
                <div className="wizardFooter">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setStep(Math.max(1, step - 1))
                    }
                  >
                    Назад
                  </button>

                  <button
                    type="button"
                    className="primary"
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (step === 1 && !product.trim()) ||
                      (step === 2 && !audience.trim()) ||
                      (step === 3 && !goal) ||
                      (step === 4 && !style)
                    }
                  >
                    Продолжить
                    <ChevronRight size={17} />
                  </button>
                </div>
              )}

              {step === 5 && (
                <button
                  type="button"
                  className="secondary"
                  onClick={resetCreate}
                >
                  <ArrowLeft size={16} />
                  Создать новую рекламу
                </button>
              )}
            </div>
          </section>
        )}

        {tab === "analytics" && (
          <section>
            <div className="eyebrow">PERFORMANCE</div>
            <h2>Аналитика</h2>
            <p className="muted">
              Обзор показателей рекламных кампаний.
            </p>

            <div className="stats">
              {[
                ["CTR", "3.84%", "+0.72%"],
                ["CPC", "₸184", "-12%"],
                ["Заявки", "127", "+24%"],
                ["Расход", "₸86 400", "+8%"],
              ].map(([a, b, c]) => (
                <div className="card stat" key={a}>
                  <small>{a}</small>
                  <strong>{b}</strong>
                  <span>
                    <TrendingUp size={13} />
                    {c}
                  </span>
                </div>
              ))}
            </div>

            <div className="card chart">
              <div className="row">
                <b>Результаты за 7 дней</b>
                <span className="pill">+18.4%</span>
              </div>

              <div className="bars">
                {[45, 65, 52, 78, 60, 88, 94].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                  >
                    <span>{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === "creatives" && (
          <section>
            <div className="eyebrow">AI CREATIVE LAB</div>
            <h2>Креативы</h2>
            <p className="muted">
              Идеи, которые можно превратить в рекламу.
            </p>

            <div className="creativeList">
              {[
                "Видео: проблема → решение",
                "Карусель: 5 причин выбрать нас",
                "UGC: отзыв клиента",
                "До / После",
                "Один день из жизни клиента",
              ].map((x, i) => (
                <div className="card creative" key={x}>
                  <div className="creativeNum">
                    0{i + 1}
                  </div>

                  <div>
                    <b>{x}</b>
                    <small>
                      AI-концепция · готово к запуску
                    </small>
                  </div>

                  <ChevronRight />
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "profile" && (
          <section>
            <div className="eyebrow">ACCOUNT</div>
            <h2>Профиль</h2>

            <div className="card profile">
              <div className="avatar">Y</div>

              <div>
                <b>Ваш профиль</b>
                <small>AI Targetologist Pro</small>
              </div>
            </div>

            <div className="card menu">
              <div>
                <span>Тариф</span>
                <b>Free · 8 генераций</b>
              </div>

              <div>
                <span>История генераций</span>
                <ChevronRight />
              </div>

              <div>
                <span>Настройки</span>
                <ChevronRight />
              </div>
            </div>
          </section>
        )}
      </main>

      <nav className="bottomNav">
        {nav.map(({ id, label, icon: Icon }) => (
          <button
            className={tab === id ? "selected" : ""}
            onClick={() => setTab(id)}
            key={id}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function Action({
  icon: Icon,
  title,
  text,
  onClick,
}: {
  icon: any;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button className="card action" onClick={onClick}>
      <div className="actionIcon">
        <Icon size={20} />
      </div>

      <div>
        <b>{title}</b>
        <small>{text}</small>
      </div>

      <ChevronRight size={17} />
    </button>
  );
}

function Wizard({
  title,
  sub,
  placeholder,
  value,
  onChange,
  children,
}: {
  title: string;
  sub: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <h3>{title}</h3>

      <p className="muted">{sub}</p>

      {placeholder && (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}

      {children}
    </div>
  );
}

export default App;
