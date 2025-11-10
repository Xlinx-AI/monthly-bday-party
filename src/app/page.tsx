import Link from "next/link";

const features = [
  {
    title: "Организуйте идеальный праздник",
    description:
      "Создавайте мероприятия по вашим интересам, выбирайте сценарий и приглашайте друзей с помощью персональной ссылки.",
  },
  {
    title: "Получайте подарки от гостей",
    description:
      "50% стоимости билетов автоматически начисляется имениннику месяца на карту после успешного проведения вечеринки.",
  },
  {
    title: "Умная лента событий",
    description:
      "Находите вечеринки в своём городе и по интересам, присоединяйтесь и покупайте билет в два клика.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-sky-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700">
              Monthly Birthday Club
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Празднуйте день рождения каждый месяц вместе с людьми, которые
              разделяют ваши интересы
            </h1>
            <p className="text-lg text-slate-600 sm:text-xl">
              Платформа объединяет именинников и гостей на тематических вечеринках.
              Создавайте события, собирайте друзей и получайте подарки без
              забот об организации.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-300 transition hover:bg-purple-500"
              >
                Создать аккаунт
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-600"
              >
                Посмотреть мероприятия
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-purple-100">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                Минимальный жизнеспособный продукт
              </h2>
              <ul className="space-y-4 text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                  Регистрация и вход пользователей с защитой паролей
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                  Выбор интересов и умный сценарий вечеринки
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                  Создание события и рассылка пригласительных ссылок
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                  Покупка билетов гостями и выдача QR-пропусков
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-slate-100 bg-white p-10 shadow-lg shadow-purple-100 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-base text-slate-600">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-10 rounded-3xl bg-slate-900 p-10 text-white lg:grid-cols-2">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.2em] text-purple-200">
              Как работает сервис
            </p>
            <h2 className="text-3xl font-semibold">
              Полный цикл от регистрации до получения подарка
            </h2>
            <p className="text-slate-300">
              Мы автоматизировали все ключевые процессы: подбор сценария,
              рассылку приглашений, приём платежей и генерацию электронных
              билетов с QR-кодами.
            </p>
          </div>
          <div className="space-y-6">
            <ol className="space-y-4 text-base text-slate-200">
              <li>
                <span className="font-semibold text-purple-200">1.</span> Зарегистрируйтесь и заполните профиль с интересами.
              </li>
              <li>
                <span className="font-semibold text-purple-200">2.</span> Создайте мероприятие в день рождения месяца и поделитесь ссылкой.
              </li>
              <li>
                <span className="font-semibold text-purple-200">3.</span> Гости оплачивают билеты через Stripe и получают QR-билет.
              </li>
              <li>
                <span className="font-semibold text-purple-200">4.</span> После вечеринки система распределяет собранные средства.
              </li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
