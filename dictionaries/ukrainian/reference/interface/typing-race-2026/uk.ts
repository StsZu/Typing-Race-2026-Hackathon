/**
 * Ukrainian locale — the source of truth for every UI string.
 *
 * Phase 0 of TASK/i18n-tech-spec_01-08-2026.md: this is the *registry* only.
 * Nothing imports it yet — the components still hold their hardcoded strings.
 * Phase 1 adds the provider and `translate()`, Phases 2–4 move the components
 * over to `t()` key by key, and `pl.ts` / `en.ts` are typed as
 * `Record<keyof typeof uk, string>` so a missing key becomes a compile error.
 *
 * Conventions (spec §4.3, §4.4):
 * - Keys describe the place and role, never the Ukrainian phrase.
 * - One key = one whole sentence. Never concatenate translated fragments.
 * - `{placeholders}` are interpolated by `translate()`.
 * - Plural forms carry a `#one` / `#few` / `#many` / `#other` suffix and are
 *   selected with `Intl.PluralRules`; `#other` is the fallback.
 * - Emoji are part of the value so a translator can drop or swap them.
 *
 * NOT in this registry, on purpose:
 * - "Touch Type Race" — brand name, identical in all three languages.
 * - "SPM" / "WPM" — product-wide units (spec §7.1); only their expansion is
 *   translated, via `unit.spm.expanded` / `unit.wpm.expanded`.
 * - Course, lesson and exercise content of any kind.
 *
 * TODO(Phase 6): the two `online.toast.*` values below were rewritten to avoid
 * the masculine "приєднався" / "покинув". Final wording needs the PL/UA
 * proofreader's sign-off (spec §13.3) so all three languages stay parallel.
 */
export const uk = {
  // ── app shell ────────────────────────────────────────────────────────────
  'app.tagline': 'Академія сенсорного друку — спокійно й ефективно',
  'app.header.title': 'Академія сенсорного друку',
  // Opens public/guide/ in a new tab, carrying ?lang= so the guide matches the UI.
  'app.guide': 'Інструкція з навчання',

  // ── theme switch ─────────────────────────────────────────────────────────
  'theme.to-light.aria': 'Увімкнути світлу тему',
  'theme.to-dark.aria': 'Увімкнути темну тему',
  'theme.light': '🌓 Світла',
  'theme.dark': '🌓 Темна',

  // ── lobby: mode ──────────────────────────────────────────────────────────
  'lobby.mode.section': 'Режим змагання',
  'lobby.mode.bot.title': 'Проти AI',
  'lobby.mode.bot.desc': 'Змагайся з ботом на обраній швидкості',
  'lobby.mode.solo.title': 'Соло',
  'lobby.mode.solo.desc': 'Тренуйся самостійно без суперника',
  'lobby.mode.online.title': 'Онлайн',
  'lobby.mode.online.desc': 'Створи кімнату або приєднайся',
  'lobby.nickname.label': 'Ваш нікнейм',
  'lobby.nickname.placeholder': 'Гравець...',
  'lobby.bot-speed': 'Швидкість бота',

  // ── profiles ─────────────────────────────────────────────────────────────
  // Several people share one browser; each has their own meter, streak,
  // history and course progress. Profile names are user data and are never
  // translated — only the placeholder for an unnamed one is.
  'profile.section': 'Профіль',
  'profile.unnamed': 'Без імені',
  'profile.chip.aria': 'Зараз грає: {name}',
  'profile.switch.aria': 'Перемкнути на профіль {name}',
  'profile.switch.disabled': 'Профіль не можна змінити під час гонки',
  'profile.create.aria': 'Створити новий профіль',
  'profile.create.limit': 'Більше ніж {max} профілів не буде',
  // Deleting drops the meter, streak, history and course progress of that
  // person and cannot be undone, so the question names them.
  'profile.delete.aria': 'Видалити профіль {name}',
  'profile.delete.confirm': 'Видалити «{name}» разом з усім прогресом?',
  'profile.delete.yes': 'Видалити',
  'profile.delete.cancel': 'Скасувати',

  // ── training tiers ───────────────────────────────────────────────────────
  // The four stages of the programme published in public/guide/index.html §4.
  // The numbers live in utils/trainingTiers.ts and are checked against the
  // guide by `npm run check:profiles` — only the names are here.
  'tier.1.title': 'Освоєння руху',
  'tier.2.title': 'Впевнена механіка',
  'tier.3.title': 'Робочий рівень',
  'tier.4.title': 'Високий рівень',

  // ── achievements ─────────────────────────────────────────────────────────
  // Titles stay at three words or fewer: the badge grid is meant to be read by
  // a nine-year-old at a glance, with the sentence in the tooltip.
  'achievement.first-run.title': 'Перший заїзд',
  'achievement.first-run.desc': 'Одна вправа пройдена від початку до кінця.',
  'achievement.exercise-passed-1.title': 'Вправа освоєна',
  'achievement.exercise-passed-1.desc': 'Три чисті проходи однієї вправи поспіль — за критерієм гайда.',
  'achievement.exercise-passed-5.title': 'Пʼять вправ',
  'achievement.exercise-passed-5.desc': 'Пʼять різних вправ освоєно на своєму рівні.',
  'achievement.exercise-passed-20.title': 'Двадцять вправ',
  'achievement.exercise-passed-20.desc': 'Двадцять різних вправ освоєно на своєму рівні.',
  'achievement.perfect-run.title': 'Без жодної помилки',
  'achievement.perfect-run.desc': 'Заїзд зі стовідсотковою точністю.',
  'achievement.clean-25.title': 'Двадцять пʼять чистих',
  'achievement.clean-25.desc': 'Двадцять пʼять заїздів із точністю 98% і вище.',
  'achievement.weak-letter-1.title': 'Літера приборкана',
  'achievement.weak-letter-1.desc': 'Літера, що постійно псувала заїзди, тричі поспіль набрана без помилок.',
  'achievement.weak-letter-5.title': 'Пʼять літер',
  'achievement.weak-letter-5.desc': 'Пʼять слабких літер виправлено.',
  'achievement.rhythm-steady.title': 'Рівний ритм',
  'achievement.rhythm-steady.desc': 'Довгий заїзд із рівномірними паузами між натисканнями.',
  'achievement.rhythm-master.title': 'Метроном',
  'achievement.rhythm-master.desc': 'Дуже рівний ритм на довгому заїзді.',
  'achievement.tier-1.title': 'Перший рівень',
  'achievement.tier-1.desc': '150 SPM при точності 96% — темп Мудрого Слона.',
  'achievement.tier-2.title': 'Другий рівень',
  'achievement.tier-2.desc': '250 SPM при точності 97%.',
  'achievement.tier-3.title': 'Третій рівень',
  'achievement.tier-3.desc': '300 SPM при точності 97% — темп Швидкої Зебри.',
  'achievement.tier-4.title': 'Четвертий рівень',
  'achievement.tier-4.desc': '475 SPM при точності 98% — темп Чорної Пантери.',
  'achievement.days-3.title': 'Три дні',
  'achievement.days-3.desc': 'Тренування у три різні дні.',
  'achievement.week-3-sessions.title': 'Тричі на тиждень',
  'achievement.week-3-sessions.desc': 'Три заняття за один тиждень.',
  'achievement.streak-7.title': 'Тиждень поспіль',
  'achievement.streak-7.desc': 'Сім днів тренувань підряд.',
  'achievement.streak-30.title': 'Місяць поспіль',
  'achievement.streak-30.desc': 'Тридцять днів тренувань підряд.',
  'achievement.tutor-certificate.title': 'Перший сертифікат',
  'achievement.tutor-certificate.desc': 'Курс Тренажера пройдено до кінця.',
  'achievement.knowledge-10.title': 'Десять уроків',
  'achievement.knowledge-10.desc': 'Десять уроків Бібліотеки знань пройдено.',
  'achievement.chars-total-10k.title': 'Десять тисяч',
  'achievement.chars-total-10k.desc': 'Десять тисяч символів набрано за весь час.',
  'achievement.chars-total-50k.title': 'Пʼятдесят тисяч',
  'achievement.chars-total-50k.desc': 'Пʼятдесят тисяч символів набрано за весь час.',
  'profile.toast.achievement': '🏅 Досягнення: {name}',
  'profile.toast.achievements#one': '🏅 {count} нове досягнення',
  'profile.toast.achievements#few': '🏅 {count} нові досягнення',
  'profile.toast.achievements#many': '🏅 {count} нових досягнень',
  'profile.toast.achievements#other': '🏅 {count} нового досягнення',

  // ── the session from the guide ───────────────────────────────────────────
  // Four steps of "One session", public/guide/index.html §4. Ticked off from
  // what actually happened today; the hints carry the guide's own timings.
  'plan.title': 'Заняття сьогодні',
  'plan.warmup.title': 'Розігрів',
  'plan.warmup.hint': '3 хв · знайома вправа',
  'plan.target.title': 'Цільова вправа',
  'plan.target.hint': '7 хв · нова або слабке місце',
  'plan.consolidate.title': 'Закріплення',
  'plan.consolidate.hint': '5 хв · та сама вправа двічі чисто',
  'plan.transfer.title': 'Перенесення',
  'plan.transfer.hint': '3–5 хв · текст із Бібліотеки знань або файл',
  'plan.toast.complete': '✅ Заняття складене повністю — час на перерву',
  'achievement.session-complete-1.title': 'Заняття за програмою',
  'achievement.session-complete-1.desc': 'Усі чотири кроки заняття зроблені за один день.',
  'achievement.session-complete-10.title': 'Десять занять',
  'achievement.session-complete-10.desc': 'Десять днів із повним заняттям за програмою.',

  // ── profile panel ────────────────────────────────────────────────────────
  // Block order is deliberate: the goal first, the session second, the badges
  // third, the numbers last and folded away.
  'profile.close': 'Закрити',
  'profile.level': 'Рівень {level}',
  'profile.since': 'З нами з {date}',
  'profile.goal.title': 'Наступна ціль',
  'profile.goal.none': 'Усі найближчі цілі закриті — лишилися довгі.',
  'profile.badges.title': 'Досягнення',
  'profile.badges.count#one': '{count} із {total}',
  'profile.badges.count#few': '{count} із {total}',
  'profile.badges.count#many': '{count} із {total}',
  'profile.badges.count#other': '{count} із {total}',
  'profile.avatar.locked': 'Відкриє «{name}»',
  'profile.stats.title': 'Статистика',
  'profile.chart.title': 'Останні 30 днів',
  'profile.records.best-spm': 'Найкращий SPM',
  'profile.records.best-accuracy': 'Найкраща точність',
  'profile.records.chars': 'Символів усього',
  'profile.records.days': 'Днів тренувань',
  'profile.records.goals': 'Днів із виконаною ціллю',
  'profile.records.races': 'Заїздів',
  'profile.group.technique': 'Техніка',
  'profile.group.precision': 'Точність',
  'profile.group.weak': 'Слабкі літери',
  'profile.group.rhythm': 'Ритм',
  'profile.group.tier': 'Рівні швидкості',
  'profile.group.regularity': 'Регулярність',
  'profile.group.session': 'Заняття',
  'profile.group.course': 'Курси',
  'profile.group.volume': 'Обсяг',

  // ── lobby: text source ───────────────────────────────────────────────────
  'lobby.source.section': 'Джерело тексту',
  'lobby.source.academy.title': 'Академія',
  'lobby.source.academy.desc': 'Структуровані вправи для всіх рівнів',
  'lobby.source.tutor.title': 'Тренажер',
  'lobby.source.tutor.desc': 'Курси сенсорного набору, урок за уроком',
  'lobby.source.knowledge.title': 'Бібліотека знань',
  'lobby.source.knowledge.desc': 'Навчальні тексти за темами',
  'lobby.source.file.title': 'З файлу',
  'lobby.source.file.desc': 'Завантажте .txt або .md',
  'lobby.file.choose': 'Оберіть файл',

  // ── lobby: settings + start ──────────────────────────────────────────────
  'lobby.settings.section': 'Налаштування гри',
  'lobby.settings.volume': 'Гучність клавіш',
  'lobby.start.loading': 'Завантаження...',
  'lobby.start.exercise': 'Почати вправу',
  'lobby.start.lesson': 'Почати урок',
  'lobby.start.create-room': 'Створити кімнату',
  'lobby.start.ready': 'Готовий до заїзду',

  // ── lobby: marketing panel ───────────────────────────────────────────────
  'lobby.feature.analytics.title': 'Аналітика',
  'lobby.feature.analytics.desc': 'SPM, точність і пост-гонковий розбір',
  'lobby.feature.multiplayer.title': 'Мультиплеєр',
  'lobby.feature.multiplayer.desc': 'Соло, бот або онлайн-кімната',
  'lobby.pitch.headline': 'Touch typing економить роки життя',
  'lobby.pitch.headline-tail': '— і зберігає здоровʼя очей та хребта.',
  'lobby.pitch.body':
    'Сенсорний друк — метод введення тексту десятьма пальцями без погляду на клавіатуру. ' +
    'Швидкість зростає у 3–5 разів, а фокус залишається на екрані.',
  'lobby.credits.label': 'Розробники:',
  // Proper names, transliterated once and identical in all three locales.
  'lobby.credits.authors': 'Stanislav Zubar and Myroslav Zubar',

  // ── online: create / join ────────────────────────────────────────────────
  'online.tab.create': 'Створити',
  'online.tab.join': 'Приєднатись',
  'online.visibility.label': 'Видимість кімнати',
  'online.visibility.public': 'Відкрита',
  'online.visibility.private': 'Закрита',
  'online.max-players.label': 'Гравців у кімнаті',
  'online.join.by-code': 'За кодом',
  'online.code.placeholder': 'XXXXX',
  'online.rooms.title': 'Відкриті кімнати',
  'online.rooms.empty': 'Немає відкритих кімнат',
  'online.rooms.enter': 'Зайти',

  // ── online: waiting room ─────────────────────────────────────────────────
  'online.room-code.label': 'Код кімнати',
  'online.copy': 'Скопіювати',
  'online.copied': 'Код скопійовано!',
  'online.status.lobby': 'В лобі',
  'online.you': 'Ви',
  'online.host-badge': 'Host',
  'online.waiting-host': 'Очікуємо старту від хоста...',
  'online.waiting-players': 'Очікування гравців...',
  'online.start-race': 'Розпочати гонку',
  'online.leave': 'Покинути кімнату',
  'online.players-count': 'Гравці ({count}/{max})',
  'online.players-count-open': 'Гравці ({count})',
  'online.player-fallback': 'Гравець',
  'online.toast.joined': '{name} у кімнаті',
  'online.toast.left': '{name} більше не в кімнаті',

  // ── online: server error codes (spec §5) ─────────────────────────────────
  'online.error.room-not-found': 'Кімнату {code} не знайдено',
  'online.error.race-started': 'Гонка вже почалася',
  'online.error.room-full': 'Кімната заповнена',
  'online.error.only-host-start': 'Почати гонку може лише господар кімнати',
  'online.error.already-started': 'Гонка вже триває',
  'online.error.need-min-players#one': 'Для старту потрібен щонайменше {min} гравець',
  'online.error.need-min-players#few': 'Для старту потрібні щонайменше {min} гравці',
  'online.error.need-min-players#many': 'Для старту потрібно щонайменше {min} гравців',
  'online.error.need-min-players#other': 'Для старту потрібно щонайменше {min} гравця',
  'online.error.only-host-restart': 'Перезапустити гонку може лише господар кімнати',
  'online.error.room-expired': 'Час кімнати вичерпано',
  'online.error.generic': 'Помилка зʼєднання',

  // ── race screen ──────────────────────────────────────────────────────────
  'race.sound.on': 'Звук: увімк',
  'race.sound.off': 'Звук: вимк',
  'race.sound.mechanical': 'Механічний',
  'race.sound.synthetic': 'Синтетичний',
  'race.errors.show': 'Помилки: видно',
  'race.errors.block': 'Помилки: блок',
  'race.accents.soft': 'Акценти: мʼяко',
  'race.accents.strict': 'Акценти: точно',
  'race.accents.hint': 'Набір базової літери зараховується за акцентовану (напр. s замість ś)',
  'race.volume.label': 'Гучність клавіш',
  'race.volume.aria': 'Гучність звуку клавіш',
  'race.skip': 'Закінчити достроково',
  'race.you-suffix': '(Ви)',
  'race.done': 'Готово!',
  'race.opponent-finished': 'Фініш',
  'race.countdown.go': 'Починаємо!',

  // ── results ──────────────────────────────────────────────────────────────
  'results.tab.protocol': 'Результати',
  'results.tab.analysis': 'Аналіз',
  'results.protocol.title': 'Фінішний протокол',
  'results.play-again': 'Грати знову',
  'results.replay': 'Повторити',
  'results.next-exercise': 'Наступна вправа',
  'results.next-lesson': 'Наступний урок',
  'results.new-exercise': 'Нова вправа',
  'results.exit': 'Вийти',
  'results.source.label': 'Джерело:',
  'results.source.verified': '· Актуальність перевірена: {date}',

  // ── post-race analysis ───────────────────────────────────────────────────
  'analysis.title': 'Аналіз набору',
  'analysis.unavailable': 'Дані аналізу недоступні — завершіть гонку повністю.',
  'analysis.spm': 'Ваш SPM',
  'analysis.brutto': 'потенціал: {value}',
  'analysis.accuracy': 'Точність',
  'analysis.rhythm': 'Ритмічність',
  'analysis.rhythm.excellent': 'відмінно',
  'analysis.rhythm.good': 'добре',
  'analysis.rhythm.ragged': 'рвано',
  'analysis.speed-curve': 'Крива швидкості',
  'analysis.top-errors': 'Найчастіші помилки',
  'analysis.no-errors': 'Жодної помилки — бездоганний набір!',
  'analysis.slow-bigrams': 'Повільні пари символів',
  'analysis.milliseconds': '{ms} мс',
  'analysis.recommended': 'Рекомендована вправа',
  'analysis.try': 'Спробувати',
  'analysis.history': 'Остання активність',
  'analysis.accuracy-value': '{accuracy}% точність',

  // ── tutor picker ─────────────────────────────────────────────────────────
  'tutor.loading-course': 'Завантаження курсу...',
  'tutor.lesson-title': 'Урок {order}: {title}',
  'tutor.search.placeholder': 'Пошук вправи або уроку...',
  'tutor.search.aria': 'Пошук вправ',
  'tutor.prev': 'Попередня',
  'tutor.next': 'Наступна',
  'tutor.prev.aria': 'Попередня вправа',
  'tutor.next.aria': 'Наступна вправа',
  'tutor.link.copy': 'Посилання на урок',
  'tutor.teacher-link': 'Посилання вчителя: урок {order} · {course}',
  'tutor.course-progress': 'Прогрес курсу: {done} / {total}',
  'tutor.link.copied': 'Скопійовано!',
  'tutor.certificate.get': 'Отримати сертифікат',
  'tutor.progress.save': 'Зберегти прогрес',
  'tutor.progress.restore': 'Відновити',
  'tutor.progress.merge': 'Обʼєднати',
  'tutor.progress.replace': 'Замінити',
  'tutor.progress.import-mode': 'Режим імпорту',
  'tutor.progress.import-mode.aria': 'Режим імпорту прогресу',
  'tutor.progress.read-error': 'Не вдалося прочитати файл прогресу',
  'tutor.progress.merged': 'Прогрес обʼєднано',
  'tutor.progress.restored': 'Прогрес відновлено',
  'tutor.lessons-count#one': '{count} урок',
  'tutor.lessons-count#few': '{count} уроки',
  'tutor.lessons-count#many': '{count} уроків',
  'tutor.lessons-count#other': '{count} уроку',
  'tutor.exercises-count#one': '{count} вправа',
  'tutor.exercises-count#few': '{count} вправи',
  'tutor.exercises-count#many': '{count} вправ',
  'tutor.exercises-count#other': '{count} вправи',

  // ── knowledge library ────────────────────────────────────────────────────
  'knowledge.intro': 'Навчальні тексти за темами. Тренуйте друк і водночас вивчайте матеріал.',
  'knowledge.breadcrumb': 'Бібліотека',
  'knowledge.open-course': 'Відкрити курс →',
  'knowledge.loading-library': 'Завантаження бібліотеки...',
  'knowledge.loading-course': 'Завантаження курсу...',
  'knowledge.error.library': 'Не вдалося завантажити бібліотеку',
  'knowledge.error.course': 'Не вдалося завантажити курс',
  'knowledge.retry': 'Повторити',
  'knowledge.choose': 'Обрати',
  'knowledge.chosen': '✓ Обрано',
  'knowledge.verified': '· перевірено {date}',
  'knowledge.minutes': '{count} хв',
  'knowledge.lessons-count#one': '{count} урок',
  'knowledge.lessons-count#few': '{count} уроки',
  'knowledge.lessons-count#many': '{count} уроків',
  'knowledge.lessons-count#other': '{count} уроку',
  'knowledge.course-progress': 'Прогрес курсу: {done} / {total}',
  'knowledge.lesson-title': 'Урок {order}: {title}',
  'knowledge.record': 'Рекорд: {spm} SPM · {accuracy}%',
  'knowledge.difficulty.beginner': 'Початковий',
  'knowledge.difficulty.intermediate': 'Середній',
  'knowledge.difficulty.advanced': 'Просунутий',

  // ── certificate (modal + canvas) ─────────────────────────────────────────
  'certificate.title': 'Сертифікат',
  'certificate.heading': 'Сертифікат про завершення курсу',
  'certificate.subheading': 'сенсорного методу друку',
  'certificate.confirms': 'Цим підтверджується, що',
  'certificate.completed': 'успішно завершив(ла) курс',
  'certificate.default-student': 'Учень',
  'certificate.exercises-done': 'Вправ завершено: {done} з {total}',
  'certificate.date': 'Дата: {date}',
  'certificate.footer': 'touch-type-race · тренажер сенсорного друку',
  'certificate.course-complete': 'Курс «{course}» завершено повністю',
  'certificate.download-png': 'Завантажити PNG',
  'certificate.save-pdf': 'Зберегти як PDF',
  'certificate.pdf-hint': 'PDF: у діалозі друку оберіть «Зберегти як PDF»',
  'certificate.preview.aria': 'Попередній перегляд сертифіката',

  // ── daily training meter ─────────────────────────────────────────────────
  'training.meter.title': 'Заряд тренування',
  'training.reset': 'Скинути',
  'training.reset.aria': 'Обнулити денний прогрес',
  'training.level.1': 'Розігрів',
  'training.level.2': 'Набираємо темп',
  'training.level.3': 'Активне тренування',
  'training.level.4': 'Сильна сесія',
  'training.level.5': 'Денну ціль виконано',
  'training.goal-with-bonus': 'Денну ціль виконано · +{count} бонусних',
  'training.toast.goal': 'Денну ціль виконано 🎉',
  'training.toast.delta': '+{delta} до заряду тренування',
  'training.toast.bonus': '+1 бонусний заїзд 💪',
  'training.toast.reset': 'Денний заряд скинуто',
  'training.streak#one': '{count} день поспіль',
  'training.streak#few': '{count} дні поспіль',
  'training.streak#many': '{count} днів поспіль',
  'training.streak#other': '{count} дня поспіль',
  'training.stats.races#one': '{count} заїзд',
  'training.stats.races#few': '{count} заїзди',
  'training.stats.races#many': '{count} заїздів',
  'training.stats.races#other': '{count} заїзду',
  'training.stats.chars#one': '{count} символ',
  'training.stats.chars#few': '{count} символи',
  'training.stats.chars#many': '{count} символів',
  'training.stats.chars#other': '{count} символа',
  'training.stats.clean': '{count} чистих',

  // ── bots (local only — MockSocket never talks to the network) ────────────
  'bot.name.snail': 'Равлик Турбо',
  'bot.name.elephant': 'Мудрий Слон',
  'bot.name.zebra': 'Швидка Зебра',
  'bot.name.panther': 'Чорна Пантера',
  'player.local': 'Гравець 1',

  // ── validation toasts (currently alert(), see spec Фаза 2) ───────────────
  'validation.select-file': 'Оберіть файл .txt або .md',
  'validation.select-tutor-exercise': 'Оберіть вправу тренажера',
  'validation.select-knowledge-lesson': 'Оберіть урок бібліотеки знань',

  // ── shared ───────────────────────────────────────────────────────────────
  'common.close': 'Закрити',
  // Endonyms of the *content* languages. Not translated — a Polish course is
  // labelled "Polski" whatever the interface language is. Registered so that
  // "no Cyrillic left in components" stays a mechanical check.
  'content.language.ukr': 'Українська',
  'content.language.eng': 'English',
  'content.language.pl': 'Polski',
  'unit.spm.expanded': 'знаків за хвилину',
  'unit.wpm.expanded': 'слів за хвилину',

  // ── language switcher (spec §6.2 — codes visible, endonyms in aria) ──────
  'language.switcher.aria': 'Мова інтерфейсу',
  'language.uk.aria': 'Українська',
  'language.pl.aria': 'Polski',
  'language.en.aria': 'English',
} as const;

/**
 * Registry size (Phase 0, measured 2026-08-01):
 *   224 entries, of which 28 are plural forms of 7 logical keys → 203 logical strings.
 *
 * That is the number `pl.ts` and `en.ts` must each match exactly. It replaces the
 * "≈194 unique fragments" grep estimate in the spec: the registry is larger than the
 * grep because one source string can serve two roles (e.g. the sound toggle appears in
 * both the lobby and the race screen — one key), while several source strings collapse
 * into one key, and aria-labels/placeholders that grep for Cyrillic missed are included.
 */

