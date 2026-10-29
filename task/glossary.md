# Глосарій перекладу (T05)

Терміни для української, англійської й польської версій головної сторінки. Джерела: розділ «Визначення та рекомендовані терміни» і «Якість перекладу» в `idea/multilingual-site-proposal.md`, рішення C1 у `task/spec.md`, частотні терміни з `task/evidence/i18n-inventory.md`.

Статус колонок: українська — чинний текст сайту; англійська — рекомендація; **польська — чернетка до перевірки редактором мови** (T17). Термін зі статусом «затверджено» змінюється лише через оновлення цього файлу.

## 1. Назва навички

**Touch typing** — техніка набору тексту на клавіатурі без потреби дивитися на клавіші, з опорою на м’язову пам’ять.

| Українська | English | Polski | Де вживати | Статус |
|---|---|---|---|---|
| **сенсорний друк** | **touch typing** | **pisanie bezwzrokowe** | Інтерфейс, заголовки, бренд, метадані (C1) | затверджено |
| сенсорний набір | touch typing | pisanie bezwzrokowe | Синонім у поясненнях, щоб уникнути повтору | затверджено |
| сенсорний метод друку | touch typing method | metoda pisania bezwzrokowego | Довгі пояснення, глосарій; не в інтерфейсі (C1) | затверджено |
| десятипальцевий метод (набір усіма десятьма пальцями) | ten-finger typing | pisanie dziesięcioma palcami | Коли йдеться саме про використання всіх пальців | затверджено (uk, en); чернетка (pl) |

Опис навички в пропозиції (`Pisanie metodą bezwzrokową` — набір без зорового контролю клавіатури) — допустимий варіант для довших речень польською.

### Назва сайту

| Мова | Назва | Статус |
|---|---|---|
| Українська | Сенсорний друк — навичка цифрової епохи | чинна (`<title>`), за C1 |
| English | Touch Typing — A Skill for the Digital Age | з пропозиції |
| Polski | Pisanie bezwzrokowe — umiejętność ery cyfrowej | з пропозиції; чернетка |

Пропозиція наводить українську назву з «сенсорним методом друку»; за рішенням C1 на сайті лишається коротка форма.

### Бренд у шапці й футері

| Українська | English | Polski |
|---|---|---|
| сенсорний друк / 2026 | touch typing / 2026 | pisanie bezwzrokowe / 2026 |

## 2. Небажані варіанти

Не вживати в текстах інтерфейсу жодної мови. Перевіряє `scripts/check-i18n.mjs` (T09) — шаблони нижче без урахування регістру.

| Мова | Небажано | Шаблон для перевірки | Замість |
|---|---|---|---|
| Українська | наосліп, друкувати наосліп | `наосліп` | сенсорний друк |
| Українська | сліпий друк, сліпого друку, сліпим друком | `сліп(ий\|ого\|ому\|им) друк` | сенсорний друк |
| English | blind typing, typing blind | `blind typing\|typing blind` | touch typing |
| Polski | pisanie na ślepo, pisanie ślepe | `na ślepo\|pisanie ślepe` | pisanie bezwzrokowe |

**Винятки — перевірка не застосовується:**

- слова пісень (`<template class="song-data">`) і назви пісень;
- описи учасників у `sites/` та інші дослівні тексти учасників;
- власні назви тренажерів і назви кнопок у чужих продуктах;
- цитати й пояснення термінів: цей глосарій, `idea/`, `task/multilingual-site-ideas-claude.md`, `task/spec.md`, `task/constitution.md`.

## 3. Предметні терміни

| Українська | English | Polski (чернетка) | Примітка |
|---|---|---|---|
| точність | accuracy | dokładność | З пропозиції; затверджено для uk, en |
| швидкість (набору) | (typing) speed | szybkość (pisania) | |
| темп | pace | tempo | «Рівний темп» → steady pace → równe tempo |
| ритм | rhythm | rytm | |
| клавіатура | keyboard | klawiatura | |
| клавіша | key | klawisz | |
| пробіл | space | spacja | Підпис клавіші на схемі; у реченнях англійською допустимо spacebar |
| розкладка (клавіатури) | (keyboard) layout | układ (klawiatury) | |
| розкладка ОС | system keyboard layout | układ klawiatury w systemie | «Схема не перемикає розкладку ОС» |
| домашній ряд | home row | rząd podstawowy | |
| домашня позиція | home position | pozycja wyjściowa | |
| виступи на клавішах F і J | the bumps on the F and J keys | wypustki na klawiszach F i J | |
| мізинець | little finger | mały palec | «лівий мізинець» → left little finger → lewy mały palec |
| безіменний палець | ring finger | palec serdeczny | |
| середній палець | middle finger | palec środkowy | |
| вказівний палець | index finger | palec wskazujący | |
| великий палець | thumb | kciuk | |
| ліва / права рука | left / right hand | lewa / prawa ręka | |
| шар AltGr | AltGr layer | warstwa AltGr | На macOS — Option (T03) |
| польська програміста | Polish (Programmers) | polski (programisty) | Офіційна назва розкладки Windows |
| діакритичні знаки | diacritics | znaki diakrytyczne (polskie znaki) | |
| тренажер | typing trainer | aplikacja do nauki pisania | Коротко в картках: trainer / aplikacja |
| тренування | practice | ćwiczenie, trening | «Почати тренування» → Start practising → Zacznij ćwiczyć |
| практика (щоденна) | (daily) practice | (codzienna) praktyka, ćwiczenia | |
| календар практики | practice calendar | kalendarz ćwiczeń | |
| звичка | habit | nawyk | |
| мінітест, тест швидкості | quick test, speed test | szybki test, test szybkości | |
| результат | result | wynik | |
| хакатон | hackathon | hackathon | |
| аудит, оцінювання | audit, evaluation | audyt, ocena | Розділ результатів хакатону |

## 4. Одиниці та формули

Абревіатури **SPM** і **WPM** та формули однакові для всіх мов (пропозиція, «Якість перекладу»). Перекладається лише розшифровка.

| Українська | English | Polski (чернетка) |
|---|---|---|
| SPM — символів/хв | SPM — characters/min | SPM — znaków/min |
| WPM — слів/хв | WPM — words/min | WPM — słów/min |
| умовне слово = 5 символів із пробілами | standard word = 5 characters including spaces | umowne słowo = 5 znaków ze spacjami |
| хв, год | min, h | min, godz. |
| сек | s | s |

## 5. Форми множини

Категорії визначає `Intl.PluralRules`; самі форми задаються в словнику для кожного ключа з числом.

| Слово | 1 | 2 | 5 | 22 | Категорії |
|---|---|---|---|---|---|
| день (uk) | 1 день | 2 дні | 5 днів | 22 дні | one, few, many |
| day (en) | 1 day | 2 days | 5 days | 22 days | one, other |
| dzień (pl) | 1 dzień | 2 dni | 5 dni | 22 dni | one, few, many |
| секунда (uk) | 1 секунда | 2 секунди | 5 секунд | 22 секунди | one, few, many |
| second (en) | 1 second | 2 seconds | 5 seconds | 22 seconds | one, other |
| sekunda (pl) | 1 sekunda | 2 sekundy | 5 sekund | 22 sekundy | one, few, many |
| хвилина (uk) | 1 хвилина | 2 хвилини | 5 хвилин | 22 хвилини | one, few, many |
| minute (en) | 1 minute | 2 minutes | 5 minutes | 22 minutes | one, other |
| minuta (pl) | 1 minuta | 2 minuty | 5 minut | 22 minuty | one, few, many |

Ці приклади — тестові дані для SC-09.

## 6. Стиль і типографіка

| Правило | Українська | English | Polski |
|---|---|---|---|
| Звертання | на «ти», наказовий спосіб: «Обери», «Почни» | you, імператив: “Choose”, “Start” | na „ty”, tryb rozkazujący: „Wybierz”, „Zacznij” |
| Лапки в текстах сайту | «…» | “…” | „…” |
| Апостроф | ’ | ’ | — |
| Тире | довге «—» з пробілами | довге «—» без пробілів | коротке «–» з пробілами (półpauza) |
| Десятковий роздільник | кома: 1,5 | крапка: 1.5 | przecinek: 1,5 |
| Числа з одиницями | нерозривний пробіл: 30 секунд | 30 seconds | 30 sekund |

Тест приймає будь-які лапки як рівнозначні (C5); правило вище стосується лише текстів сайту.

## 7. Що не перекладається

- **Назви:** Typing Race 2026, Touch Type Race, назви тренажерів (Соло, Typing-Race, TypTap, Гами, Touch Type Race Academy), імена авторів. Кириличні назви («Соло», «Гами», імена) на en/pl позначаються `lang="uk"` (T06).
- **Пісні:** назви та слова. Перекладаються лише підписи частин (`song.part.*`).
- **Клавіші в прикладах:** не перекладаються, а замінюються на клавіші розкладки мови сторінки. Для en і pl: «Ф І В А · О Л Д Ж» → «A S D F · J K L ;», «ф і в а» → «a s d f». Таких місць 7 (`task/evidence/i18n-inventory.md`).
