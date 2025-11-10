import Link from "next/link";
import Button from "@/components/ui/Button";

const socialProof = [
  { value: "500+", label: "Счастливых именинников" },
  { value: "98%", label: "Довольных гостей" },
  { value: "24/7", label: "Поддержка сообщества" },
];

const benefits = [
  {
    icon: "🎁",
    title: "Получайте реальные деньги",
    description: "50% стоимости каждого билета идёт имениннику на карту. Ваш праздник окупается сам собой.",
  },
  {
    icon: "✨",
    title: "Никаких забот по организации",
    description: "Создали событие? Поделились ссылкой? Готово. Мы автоматизировали всё остальное.",
  },
  {
    icon: "🤝",
    title: "Встречайте близких по духу",
    description: "Алгоритмы умно подбирают людей с общими интересами. Каждая встреча — новые друзья.",
  },
  {
    icon: "🔒",
    title: "Безопасная оплата",
    description: "Интеграция с ЮKassa. Фискальные чеки, защита покупателя, возврат средств.",
  },
];

const emotions = [
  { label: "День рождения раз в месяц", subtext: "Не ждите целый год" },
  { label: "Новые друзья на каждой встрече", subtext: "Расширяйте круг общения" },
  { label: "Событие под ключ за 5 минут", subtext: "Проще, чем заказать такси" },
];

export default function Home() {
  return (
    <div className="relative">
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="glass-card p-12 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full glass-effect px-6 py-2 text-sm font-bold text-purple-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
              Запуск MVP в декабре 2024
            </div>
            
            <h1 className="text-5xl font-black tracking-tight sm:text-7xl mb-6">
              <span className="text-gradient">
                Празднуйте день рождения каждый месяц
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-xl text-gray-300 leading-relaxed mb-8">
              Первая в России платформа ежемесячных праздничных встреч. Создавайте события, 
              приглашайте гостей и получайте{" "}
              <span className="text-purple-400 font-bold">реальные деньги</span> в день рождения.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row justify-center items-center">
              <Link href="/register">
                <Button size="lg" glow className="group">
                  🚀 Создать первое событие
                  <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="secondary" size="lg">
                  👀 Посмотреть события
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              {socialProof.map((item) => (
                <div key={item.label} className="glass-effect rounded-2xl p-6">
                  <div className="text-3xl font-black text-gradient mb-2">{item.value}</div>
                  <div className="text-sm text-gray-400 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Почему это работает?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Мы превратили сложную организацию в несколько кликов
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="glass-card p-8 group">
                <div className="text-5xl mb-4 float-animation">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient transition-all">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="glass-card p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-4">
                Как это работает
              </h2>
              <p className="text-gray-300">Проще не бывает</p>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Создайте событие за 2 минуты",
                  description: "Выберите интерес, укажите дату и место. Система сгенерирует пригласительную ссылку.",
                },
                {
                  step: "2",
                  title: "Поделитесь с друзьями",
                  description: "Скопируйте ссылку и отправьте в чаты. Гости оплачивают билет прямо на платформе.",
                },
                {
                  step: "3",
                  title: "Получите деньги и наслаждайтесь",
                  description: "50% с каждого билета идёт вам. Остальное — на организацию следующего события.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start group">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl glass-effect flex items-center justify-center text-3xl font-black text-gradient group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="liquid-gradient p-12 rounded-3xl text-center shadow-2xl">
            <h2 className="text-4xl font-black text-white mb-6">
              Представьте...
            </h2>
            <div className="space-y-4 mb-10">
              {emotions.map((emotion) => (
                <div key={emotion.label} className="glass-effect rounded-2xl p-6">
                  <div className="text-xl font-bold text-white mb-1">{emotion.label}</div>
                  <div className="text-sm text-gray-200">{emotion.subtext}</div>
                </div>
              ))}
            </div>
            <Link href="/register">
              <Button variant="secondary" size="lg" className="bg-white/20 hover:bg-white/30 border-2 border-white/40">
                ✨ Начать сейчас — Бесплатно
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="glass-card p-12">
            <h2 className="text-4xl font-black text-white mb-6">
              Готовы к новому опыту?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к сообществу людей, которые отмечают жизнь каждый месяц.
              Без лишних слов — просто попробуйте.
            </p>
            <Link href="/register">
              <Button size="lg" glow className="text-xl px-12 py-6">
                🎉 Создать аккаунт бесплатно
              </Button>
            </Link>
            <p className="text-xs text-gray-500 mt-6">
              Никаких скрытых платежей. Без подписок. Платите только когда создаёте событие.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
