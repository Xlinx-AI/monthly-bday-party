export default function Footer() {
  return (
    <footer className="glass-effect border-t border-white/10 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-gradient">12DR</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              12 дней рождения в год. Помогаем находить людей по интересам, отмечать чаще и зарабатывать на каждом празднике.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Платформа</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/events" className="hover:text-purple-400 transition-colors">Лента событий</a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-purple-400 transition-colors">Мои мероприятия</a>
              </li>
              <li>
                <a href="/profile" className="hover:text-purple-400 transition-colors">Профиль</a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Проект</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Создано <span className="text-purple-400 font-semibold">Лаврентьевым Кириллом</span> в рамках проекта{" "}
              <a 
                href="https://github.com/Xlinx-AI" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                iXlinx Tech Partnership
              </a>
            </p>
            <p className="text-xs text-gray-500">
              © 2025 12DR. Проприетарная лицензия — Team Only
            </p>
            <a
              href="https://github.com/Xlinx-AI/monthly-bday-party"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
