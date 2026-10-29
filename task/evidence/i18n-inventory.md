# Інвентар рядків для перекладу (T04)

Згенеровано скриптом `task/evidence/T04-inventory.mjs` з `index.html`, `app.js`, `catalog.json` за поточним станом файлів. Не редагувати вручну — перегенерувати.

Ключі за контрактом плану (`розділ.елемент`). Якщо ключ уже записано в розмітку (`data-i18n`, `data-i18n-attr`, T06), інвентар бере його звідти. Для вкладеної розмітки (`<br>`, `<em>`, `<b>`) одиницею перекладу є весь блок разом з тегами.

## Підсумок

| Тип | Що це | Кількість | Перекладається |
|---|---|---|---|
| статичний | текст у HTML | 139 | так |
| атрибут | `alt`, `aria-label`, `content` у HTML | 14 | так |
| динамічний | словник `#i18n-messages` у `index.html` для `app.js` (T07) | 63 | так |
| каталог | описи, переваги, `imageAlt` у `catalog.json` | 25 | так (T14) |
| вправа | текст швидкісного тесту | 1 | ні — окремий текст для кожної мови (T15, T18) |
| дані | символи розкладки `uk` | 3 | ні |
| оригінал | назви пісень, назви тренажерів, імена авторів | 14 | ні |
| **Разом** | | **259** | **241** |

Шаблони пісень (`<template class="song-data">`, 5 шт.) — оригінальний контент, до інвентаря не входять; їхні підписи частин — ключі `song.part.*` у словнику.

### Звірка з умовою Done

| Підрахунок | Грубий (регулярний вираз, як в `idea.md`) | Точний (розбір дерева) | Покрито інвентарем |
|---|---|---|---|
| Текстові вузли з кирилицею в HTML (без шаблонів) | 158 | 158 | 158 у 206 одиницях; непокритих: 0 |
| Атрибути з кирилицею в HTML | 14 | 14 | 14 |
| Літерали з кирилицею в `app.js` | — | 4 | 4 |

Грубий підрахунок (як в `idea.md`) рахує фрагменти між `>` і `<`; для Done використано точний розбір дерева.

Унікальних ключів для перекладу: 227. Спільні ключі (той самий рядок у кількох місцях — очікувано): `keyboard.noteUk` ×2, `calculator.currentLabelWpm` ×2, `calculator.targetLabelWpm` ×2, `calculator.volumeLabelWords` ×2, `calculator.minutes` ×2, `calculator.hoursMinutes` ×2, `calculator.result` ×2, `test.durationLabel` ×5, `plan.progress` ×2, `music.coverAlt` ×2, `music.audioLabel` ×2. Літералів `app.js` без ключа: 0.

## Розбіжності між початковим текстом HTML і текстом app.js

| Що | Факт | Рекомендація |
|---|---|---|
| `learn.layoutNote` ≠ `keyboard.noteUk` | Примітка до схеми UK мала два тексти: при першому відкритті й після повернення на UK | Вирішено (C8, T07): один ключ `keyboard.noteUk` з текстом першого відкриття |
| `learn.keyTip` ≠ `keyboard.homeUk` | Підказка при першому відкритті — «А та О: вказівні пальці. Знайди виступи на клавішах F і J.»; після повернення на UK — «Домашня позиція: Ф І В А · О Л Д Ж.» | Прийнятно як два різні повідомлення; лишити обидва ключі |
| `test.testStatus` ≠ `test.statusReady` | До першого тесту — «Таймер почнеться з першого символу.»; після скидання — «Друкуй протягом {seconds} секунд. Таймер почнеться з першого символу.» | Прийнятно; лишити обидва ключі |

Інші особливості:

- **Перевірка словника:** статичних одиниць HTML із ключем словника — 14, розбіжностей зі словником — 0.
- **Заповнювачі:** 10 одиниць містять вкладені елементи з `id` або `<input>`. У тексті перекладу вони записані як `{$1}`, `{$2}`…; генератор (T08) підставляє на їхнє місце оригінальну розмітку. Тексти самих вкладених елементів — окремі ключі.
- **SC-02:** кириличні власні назви на сторінці позначено `lang="uk"` (T06); у перекладах назви «Соло», «Гами» тощо треба брати в `<span lang="uk">`.
- **Переклад:** 8 одиниць згадують клавіші Ф І В А · О Л Д Ж — для en/pl їх треба замінити на A S D F · J K L ;, а не перекладати дослівно.

## meta

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `meta.title` | `Сенсорний друк — навичка цифрової епохи` | `index.html <title>` | статичний |  |
| `meta.description` | `Опануй сенсорний друк: інтерактивна клавіатура, тест швидкості, план на 30 днів і п’ять тренажерів Typing Race 2026.` | `index.html <meta> @content` | атрибут |  |
| `meta.ogTitle` | `Думай про зміст. Пальці знайдуть клавіші.` | `index.html <meta> @content` | атрибут |  |
| `meta.ogDescription` | `Твій старт у сенсорному друці. 5 тренажерів, 3 розкладки, 30 днів практики.` | `index.html <meta> @content` | атрибут |  |

## page

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `page.link1` | `Перейти до змісту` | `index.html <a.skip>` | статичний |  |
| `nav.languages` | `Мова сайту` | `index.html <nav#langs> @aria-label` | атрибут |  |

## nav

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `nav.link1` | `<span class="logo">t<span>_</span></span>сенсорний друк<span class="edition">/ 2026</span>` | `index.html <a.brand>` | статичний |  |
| `nav.ariaLabel1` | `Головна навігація` | `index.html <nav> @aria-label` | атрибут |  |
| `nav.link2` | `Як це працює` | `index.html <a>` | статичний |  |
| `nav.link3` | `Мінітест` | `index.html <a>` | статичний |  |
| `nav.link4` | `Тренажери` | `index.html <a>` | статичний |  |
| `nav.link5` | `План навчання` | `index.html <a>` | статичний |  |
| `nav.link6` | `Музика` | `index.html <a>` | статичний |  |
| `nav.ariaLabel2` | `Перемкнути світлу й темну тему` | `index.html <button#theme> @aria-label` | атрибут |  |
| `nav.link7` | `До тренажерів ↗` | `index.html <a.button>` | статичний |  |

## hero

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `hero.text1` | `<span class="dot"></span> НАВИЧКА ЦИФРОВОЇ ЕПОХИ` | `index.html <p.eyebrow>` | статичний |  |
| `hero.heading1` | `Опануй<br><em>сенсорний друк.</em>` | `index.html <h1>` | статичний |  |
| `hero.text2` | `Думай швидше —<br>працюй ефективніше!` | `index.html <p.hero-sub>` | статичний |  |
| `hero.text3` | `Сенсорний друк — важлива цифрова навичка для навчання, роботи та творчості. Опануй десятипальцевий метод і відкрий новий рівень роботи з комп’ютером.` | `index.html <p.lead>` | статичний |  |
| `hero.link1` | `Почати тренування <span>↗</span>` | `index.html <a.button>` | статичний |  |
| `hero.link2` | `Чому це важливо? ↓` | `index.html <a.text-link>` | статичний |  |
| `hero.text4` | `Без реєстрації <span>·</span> У власному темпі <span>·</span> 10–15 хв на день` | `index.html <p.micro>` | статичний |  |
| `hero.label1` | `МЕНШЕ ПОШУКУ. БІЛЬШЕ ПОТОКУ.` | `index.html <span>` | статичний |  |
| `hero.div1` | `думай про <span>зміст</span><i></i>` | `index.html <div.typed>` | статичний |  |
| `hero.label2` | `<b>Ф І В А</b> ліва рука` | `index.html <span>` | статичний | клавіші домашнього ряду UK: для en/pl — A S D F · J K L ; |
| `hero.label3` | `<b>О Л Д Ж</b> права рука` | `index.html <span>` | статичний | клавіші домашнього ряду UK: для en/pl — A S D F · J K L ; |
| `hero.div2` | `✦ Точність спочатку. Швидкість згодом.` | `index.html <div.float-note>` | статичний |  |

## ribbon

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `ribbon.label1` | `<b>10</b> пальців в одній команді` | `index.html <span>` | статичний |  |
| `ribbon.label2` | `<b>3</b> розкладки для практики` | `index.html <span>` | статичний |  |
| `ribbon.label3` | `<b>5</b> тренажерів хакатону` | `index.html <span>` | статичний |  |
| `ribbon.label4` | `<b>30</b> днів для нової звички` | `index.html <span>` | статичний |  |

## learn

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `learn.text1` | `01 / ОСНОВИ` | `index.html <p.eyebrow>` | статичний |  |
| `learn.heading1` | `Очі на тексті.<br>Пальці знають шлях.` | `index.html <h2>` | статичний |  |
| `learn.text2` | `Сенсорний друк — це набір усіма десятьма пальцями без погляду на клавіатуру. Замість пошуку кожної літери ти поступово запам’ятовуєш рух.` | `index.html <p>` | статичний |  |
| `learn.heading2` | `Знайди свою домашню позицію` | `index.html <h3>` | статичний |  |
| `learn.ariaLabel1` | `Розкладка` | `index.html <div> @aria-label` | атрибут |  |
| `learn.text3` | `Натисни клавішу на схемі — дізнайся, який палець її набирає.` | `index.html <p.muted>` | статичний |  |
| `learn.altgr` | `Шар AltGr: ą ć ę ł ń ó ś ź ż` | `index.html <button#altgr.outline>` | статичний |  |
| `learn.keyTip` | `А та О: вказівні пальці. Знайди виступи на клавішах F і J.` | `index.html <p#key-tip.key-tip>` | статичний |  |
| `learn.label1` | `① Мізинець` | `index.html <span>` | статичний |  |
| `learn.label2` | `② Безіменний` | `index.html <span>` | статичний |  |
| `learn.label3` | `③ Середній` | `index.html <span>` | статичний |  |
| `learn.label4` | `④ Вказівний` | `index.html <span>` | статичний |  |
| `keyboard.noteUk` | `Українська ЙЦУКЕН. Домашній ряд: Ф І В А · О Л Д Ж. Ґ може потребувати окремої клавіші або комбінації залежно від ОС.` | `index.html <p#layout-note.micro>` | статичний | клавіші домашнього ряду UK: для en/pl — A S D F · J K L ; |
| `learn.heading3` | `Поверни пальці додому` | `index.html <h3>` | статичний |  |
| `learn.text4` | `Ліва рука — Ф І В А, права — О Л Д Ж. Великі пальці відповідають за пробіл.` | `index.html <p>` | статичний | клавіші домашнього ряду UK: для en/pl — A S D F · J K L ; |
| `learn.heading4` | `Дай рукам свободу` | `index.html <h3>` | статичний |  |
| `learn.text5` | `Розслаб плечі, тримай зап’ястки рівно, не притискай їх до краю столу. Схема показує зони пальців, а не форму конкретної клавіатури.` | `index.html <p>` | статичний |  |
| `learn.heading5` | `Не поспішай` | `index.html <h3>` | статичний |  |
| `learn.text6` | `Спочатку правильний палець і точність. Якщо помилок багато — зменш темп. Замість постійних поглядів униз повертай увагу до тексту.` | `index.html <p>` | статичний |  |

## benefits

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `benefits.text1` | `02 / НАВІЩО ЦЕ ТОБІ` | `index.html <p.eyebrow>` | статичний |  |
| `benefits.heading1` | `Менше рухів між думкою і текстом.` | `index.html <h2>` | статичний |  |
| `benefits.heading2` | `Економія часу` | `index.html <h3>` | статичний |  |
| `benefits.text2` | `Менше пауз на пошук клавіш, коли пишеш лист або заповнюєш документ.` | `index.html <p>` | статичний |  |
| `benefits.heading3` | `Концентрація` | `index.html <h3>` | статичний |  |
| `benefits.text3` | `Стеж за реченням на екрані й формулюй думку, не шукаючи кожну літеру.` | `index.html <p>` | статичний |  |
| `benefits.heading4` | `Продуктивність` | `index.html <h3>` | статичний |  |
| `benefits.text4` | `Документи, код, повідомлення та запити до AI — навичка працює щодня.` | `index.html <p>` | статичний |  |
| `benefits.heading5` | `Навчання` | `index.html <h3>` | статичний |  |
| `benefits.text5` | `Зручніше записувати власні ідеї, конспекти та виконувати письмові завдання.` | `index.html <p>` | статичний |  |
| `benefits.heading6` | `Цифрова грамотність` | `index.html <h3>` | статичний |  |
| `benefits.text6` | `Знайомство з клавіатурою додає впевненості дітям і дорослим.` | `index.html <p>` | статичний |  |
| `benefits.heading7` | `Професійний розвиток` | `index.html <h3>` | статичний |  |
| `benefits.text7` | `Практична основа для роботи менеджера, аналітика, програміста й офісної команди.` | `index.html <p>` | статичний |  |

## calculator

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `calculator.text1` | `03 / ТВОЯ ЕКОНОМІЯ ЧАСУ` | `index.html <p.eyebrow>` | статичний |  |
| `calculator.heading1` | `Маленька навичка.<br>Помітна різниця.` | `index.html <h2>` | статичний |  |
| `calculator.text2` | `Скільки хвилин повернеться тобі, якщо той самий текст набирати швидше?` | `index.html <p.muted>` | статичний |  |
| `calculator.legend1` | `Одиниці швидкості та обсягу` | `index.html <legend>` | статичний |  |
| `calculator.label1` | `{$1} WPM — слова` | `index.html <label>` | статичний | 1 заповнювач(і) {$n}: вкладені елементи з `id` або `<input>` не перекладаються |
| `calculator.label2` | `{$1} SPM — символи` | `index.html <label>` | статичний | 1 заповнювач(і) {$n}: вкладені елементи з `id` або `<input>` не перекладаються |
| `calculator.currentLabelWpm` | `Поточна швидкість, слів/хв (WPM)` | `index.html <span#current-label>` | статичний |  |
| `calculator.targetLabelWpm` | `Бажана швидкість, слів/хв (WPM)` | `index.html <span#target-label>` | статичний |  |
| `calculator.volumeLabelWords` | `Обсяг тексту за день, умовних слів` | `index.html <span#volume-label>` | статичний |  |
| `calculator.text3` | `Для перерахунку 1 умовне слово = 5 символів із пробілами. Оцінка лише часу набору: обсяг ÷ поточна швидкість − обсяг ÷ бажана швидкість. Без часу на обдумування й редагування. 5 робочих днів на тиждень, 20 на місяць.` | `index.html <p.micro>` | статичний |  |
| `calculator.text4` | `ТВІЙ ПОТЕНЦІАЛ ЗА ДЕНЬ` | `index.html <p>` | статичний |  |
| `calculator.label3` | `хвилин` | `index.html <span>` | статичний |  |
| `calculator.label4` | `{$1}за тиждень` | `index.html <span>` | статичний | 1 заповнювач(і) {$n}: вкладені елементи з `id` або `<input>` не перекладаються |
| `calculator.minutes` | `100 хв` | `index.html <b#saved-week>` | статичний | параметри {"minutes":100}; українське джерело — шаблон у `locales/uk.json` (T07) |
| `calculator.label5` | `{$1}за місяць` | `index.html <span>` | статичний | 1 заповнювач(і) {$n}: вкладені елементи з `id` або `<input>` не перекладаються |
| `calculator.hoursMinutes` | `6 год 40 хв` | `index.html <b#saved-month>` | статичний | параметри {"hours":6,"minutes":40}; українське джерело — шаблон у `locales/uk.json` (T07) |
| `calculator.result` | `Більше часу на те, що має значення.` | `index.html <p#calc-note>` | статичний |  |

## test

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `test.text1` | `04 / СПРОБУЙ ПРОСТО ЗАРАЗ` | `index.html <p.eyebrow>` | статичний |  |
| `test.heading1` | `Твоя перша маленька перемога.` | `index.html <h2>` | статичний |  |
| `test.text2` | `Перевір свій стартовий темп. Під’єднай фізичну клавіатуру, обери українську розкладку й почни друкувати.` | `index.html <p>` | статичний |  |
| `test.text3` | `Друкуй текст нижче протягом {$1}. Відлік починається з першого символу. Коли час вийде, з’явиться результат.` | `index.html <p.test-instruction>` | статичний | 1 заповнювач(і) {$n}: вкладені елементи з `id` або `<input>` не перекладаються |
| `test.durationLabel` | `30 секунд` | `index.html <strong#duration-label>` | статичний | параметри {"seconds":30}; українське джерело — шаблон у `locales/uk.json` (T07) |
| `test.ariaLabel1` | `Тривалість` | `index.html <div> @aria-label` | атрибут |  |
| `test.durationLabel` | `30 секунд` | `index.html <button>` | статичний | параметри {"seconds":30}; українське джерело — шаблон у `locales/uk.json` (T07) |
| `test.durationLabel` | `60 секунд` | `index.html <button>` | статичний | параметри {"seconds":60}; українське джерело — шаблон у `locales/uk.json` (T07) |
| `test.label1` | `{$1} сек` | `index.html <span>` | статичний | 1 заповнювач(і) {$n}: вкладені елементи з `id` або `<input>` не перекладаються |
| `test.label2` | `{$1} WPM <small>слів/хв</small>` | `index.html <span>` | статичний | 1 заповнювач(і) {$n}: вкладені елементи з `id` або `<input>` не перекладаються |
| `test.label3` | `{$1} SPM <small>символів/хв</small>` | `index.html <span>` | статичний | 1 заповнювач(і) {$n}: вкладені елементи з `id` або `<input>` не перекладаються |
| `test.label4` | `{$1} символів <small>правильно / набрано</small>` | `index.html <span>` | статичний | 1 заповнювач(і) {$n}: вкладені елементи з `id` або `<input>` не перекладаються |
| `test.label5` | `{$1} точність` | `index.html <span>` | статичний | 1 заповнювач(і) {$n}: вкладені елементи з `id` або `<input>` не перекладаються |
| `test.label6` | `Залишок часу` | `index.html <label>` | статичний |  |
| `test.durationLabel` | `30 секунд` | `index.html <progress#test-time>` | статичний | параметри {"seconds":30}; українське джерело — шаблон у `locales/uk.json` (T07) |
| `test.finishTitle` | `Час вийшов!` | `index.html <h3#finish-title>` | статичний |  |
| `test.text4` | `Результат зафіксовано. Натисни «Спробувати ще раз», щоб розпочати новий тест.` | `index.html <p>` | статичний | цитує `test.restart` — переклад має збігатися з підписом кнопки |
| `test.ariaLabel2` | `Текст для набору` | `index.html <div#sample> @aria-label` | атрибут |  |
| `test.label7` | `Введи текст із прикладу` | `index.html <label.sr-only>` | статичний |  |
| `test.placeholder1` | `Натисни тут і почни друкувати…` | `index.html <textarea#typing> @placeholder` | атрибут |  |
| `test.testStatus` | `Таймер почнеться з першого символу.` | `index.html <p#test-status>` | статичний |  |
| `test.restart` | `↻ Спробувати ще раз` | `index.html <button#restart.outline>` | статичний |  |
| `test.text5` | `SPM = правильні символи ÷ хвилини. WPM = SPM ÷ 5. Умовне слово — 5 символів; пробіли та пунктуація враховуються. Лічильник показує правильні та всі символи у введеному тексті. Точність враховує всі введені символи, включно з виправленими помилками. Апострофи ' / ’ / ʼ приймаються однаково. Вставлення тексту вимкнено. Нічого не надсилаємо й не зберігаємо.` | `index.html <p.micro>` | статичний |  |

## trainers

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `trainers.text1` | `05 / СТВОРЕНО, ЩОБ НАВЧАТИ` | `index.html <p.eyebrow>` | статичний |  |
| `trainers.heading1` | `Знайди свій тренажер.` | `index.html <h2>` | статичний |  |
| `trainers.text2` | `П’ять різних підходів із Typing Race 2026. Обирай за своєю метою: послідовний курс, аналітика, гра чи перегони.` | `index.html <p>` | статичний |  |
| `trainers.summary1` | `Результати хакатону 2026 <span>Відкрити ↗</span>` | `index.html <summary>` | статичний |  |
| `trainers.text3` | `За оголошенням результатів аудиту 6 жовтня 2026. Це оцінка конкурсних робіт, а не рейтинг придатності для кожного учня.` | `index.html <p>` | статичний |  |
| `— (оригінал)` | `<b>01 / Соло</b>Гайдук Анна · 100/100` | `index.html <p>` | оригінал | оригінал (lang="uk") |
| `— (оригінал)` | `<b>03 / TypTap</b>Артем (artyd) · 73/100` | `index.html <p>` | оригінал | оригінал (lang="uk") |
| `trainers.text6` | `«Гами» подано після завершення оцінювання. Touch Type Race Academy — робота організатора поза конкурсом.` | `index.html <p>` | статичний |  |
| `trainers.text7` | `Джерела: index.html, описи sites/ та ANNOUNCEMENT.md з матеріалів хакатону. Ілюстрації можливостей тренажерів.` | `index.html <p.micro>` | статичний |  |

## plan

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `plan.text1` | `06 / ВІД СПРОБИ ДО ЗВИЧКИ` | `index.html <p.eyebrow>` | статичний |  |
| `plan.heading1` | `30 днів. У твоєму ритмі.` | `index.html <h2>` | статичний |  |
| `plan.text2` | `Виділяй 10–15 хвилин щодня. Роби перерви й повертайся до складних клавіш. Конкретна швидкість за 30 днів не гарантується.` | `index.html <p>` | статичний |  |
| `plan.note1` | `ДНІ 01–07` | `index.html <small>` | статичний |  |
| `plan.heading2` | `Знайомство` | `index.html <h3>` | статичний |  |
| `plan.text3` | `Постановка пальців, домашній ряд. Повільні гами без погляду вниз.` | `index.html <p>` | статичний |  |
| `plan.note2` | `ДНІ 08–14` | `index.html <small>` | статичний |  |
| `plan.heading3` | `Точність` | `index.html <h3>` | статичний |  |
| `plan.text4` | `Верхній і нижній ряди, цифри, Shift. Додавай клавіші поступово.` | `index.html <p>` | статичний |  |
| `plan.note3` | `ДНІ 15–21` | `index.html <small>` | статичний |  |
| `plan.heading4` | `Ритм` | `index.html <h3>` | статичний |  |
| `plan.text5` | `Короткі слова й часті поєднання. Рівний темп і робота над помилками.` | `index.html <p>` | статичний |  |
| `plan.note4` | `ДНІ 22–30` | `index.html <small>` | статичний |  |
| `plan.heading5` | `Впевненість` | `index.html <h3>` | статичний |  |
| `plan.text6` | `Листи, нотатки, реальні тексти. Порівняй результат із першим днем.` | `index.html <p>` | статичний |  |
| `plan.heading6` | `Твій календар практики` | `index.html <h3>` | статичний |  |
| `plan.progress` | `0 / 30 днів` | `index.html <span#progress-label>` | статичний | параметри {"done":0}; українське джерело — шаблон у `locales/uk.json` (T07) |
| `plan.storageNote` | `Позначай завершені дні. Прогрес зберігається лише в цьому браузері й не синхронізується між пристроями.` | `index.html <p#storage-note.micro>` | статичний |  |

## music

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `music.text1` | `ПІСНІ ДЛЯ НАТХНЕННЯ` | `index.html <p.eyebrow>` | статичний |  |
| `music.heading1` | `Знайди свій ритм.` | `index.html <h2>` | статичний |  |
| `music.text2` | `П’ять пісень із колекції Touch Type Race. Обери настрій для наступного тренування.` | `index.html <p.lead>` | статичний |  |
| `music.coverAlt` | `Обкладинка пісні Не гальмуй / Just Type` | `index.html <img#player-cover> @alt` | атрибут | параметри {"title":"Не гальмуй / Just Type"}; українське джерело — шаблон у `locales/uk.json` (T07) |
| `— (оригінал)` | `Не гальмуй / Just Type` | `index.html <h3#player-title>` | оригінал | оригінал (lang="uk") |
| `music.audioLabel` | `Пісня Не гальмуй / Just Type` | `index.html <audio#player-audio> @aria-label` | атрибут | параметри {"title":"Не гальмуй / Just Type"}; українське джерело — шаблон у `locales/uk.json` (T07) |
| `music.playerPrev` | `← Попередня` | `index.html <button#player-prev.outline>` | статичний |  |
| `music.playerNext` | `Наступна →` | `index.html <button#player-next.outline>` | статичний |  |
| `music.playerDownload` | `Завантажити MP3` | `index.html <a#player-download>` | статичний |  |
| `music.lyricsTitle` | `Слова` | `index.html <h3#lyrics-title.lyrics-title>` | статичний |  |
| `music.ariaLabel1` | `Слова пісні` | `index.html <div#lyrics> @aria-label` | атрибут |  |
| `music.ariaLabel2` | `Пісні` | `index.html <ol#tracks> @aria-label` | атрибут |  |
| `— (оригінал)` | `Не гальмуй / Just Type` | `index.html <b>` | оригінал | оригінал (lang="uk") |
| `music.text3` | `Пісні вмикаються лише після натискання Play. Одночасно звучить один запис; початок тесту призупиняє музику.` | `index.html <p.micro>` | статичний |  |

## about

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `about.text1` | `07 / ЛЮДИ + ТЕХНОЛОГІЇ` | `index.html <p.eyebrow>` | статичний |  |
| `about.heading1` | `Від ідеї —<br>до корисного застосунку.` | `index.html <h2>` | статичний |  |
| `about.text2` | `Typing Race 2026 — хакатон освітніх тренажерів. Його мета: створити послідовне навчання, у якому точність і правильні рухи передують швидкості.` | `index.html <p.lead>` | статичний |  |
| `about.text3` | `AI може допомагати з проєктуванням інтерфейсів, написанням коду, тестами та документацією. Людина формулює завдання, перевіряє результат і відповідає за якість навчання. Використання конкретних моделей окремими авторами тут не припускається.` | `index.html <p>` | статичний |  |
| `about.link1` | `Спробуй результати цієї роботи ↗` | `index.html <a.text-link>` | статичний |  |

## finalCta

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `finalCta.text1` | `ТВОЯ НАСТУПНА ДІЯ` | `index.html <p.eyebrow>` | статичний |  |
| `finalCta.heading1` | `Поклади пальці на Ф І В А.<br>І почни.` | `index.html <h2>` | статичний | клавіші домашнього ряду UK: для en/pl — A S D F · J K L ; |
| `finalCta.link1` | `Обрати тренажер ↗` | `index.html <a.button>` | статичний |  |
| `finalCta.text2` | `Десять пальців. Одна нова звичка.` | `index.html <p>` | статичний |  |

## footer

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `footer.link1` | `сенсорний друк<span class="edition">/ 2026</span>` | `index.html <a.brand>` | статичний |  |
| `footer.text1` | `Навичка, що залишається з тобою.` | `index.html <p>` | статичний |  |
| `footer.link2` | `На початок ↑` | `index.html <a>` | статичний |  |

## app.js

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `— (layouts)` | `йцукенгшщзхї` | `app.js:9` | дані | символи розкладки, не перекладаються |
| `— (layouts)` | `фівапролджє` | `app.js:9` | дані | символи розкладки, не перекладаються |
| `— (layouts)` | `ячсмитьбю.` | `app.js:9` | дані | символи розкладки, не перекладаються |
| `— (passage)` | `Кожна нова навичка починається з маленького кроку. Поклади пальці на клавіатуру, розслаб плечі та дивись на текст. Друкуй уважно і спокійно. Нехай руки запам\'ятовують рух, а думки залишаються вільними. Точність важливіша за поспіх. Щоденна практика допомагає краще відчувати ритм. ` | `app.js:17` | вправа | текст тесту; окремий текст для кожної мови (FR-08) |

## messages

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `keyboard.finger.leftPinky` | `лівий мізинець` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.finger.leftRing` | `лівий безіменний` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.finger.leftMiddle` | `лівий середній` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.finger.leftIndex` | `лівий вказівний` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.finger.rightIndex` | `правий вказівний` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.finger.rightMiddle` | `правий середній` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.finger.rightRing` | `правий безіменний` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.finger.rightPinky` | `правий мізинець` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.keyTip` | `{key} — {finger}. Після натискання поверни палець у домашню позицію.` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.keyTipAltGr` | `{key} — AltGr + {base}, {finger}. Після натискання поверни палець у домашню позицію.` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.space` | `пробіл` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.spaceTip` | `Пробіл — великий палець. Обери зручний для себе.` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.homeUk` | `Домашня позиція: Ф І В А · О Л Д Ж.` | `index.html <script#i18n-messages>` | динамічний | клавіші домашнього ряду UK: для en/pl — A S D F · J K L ; |
| `keyboard.homeLatin` | `Домашня позиція: A S D F · J K L ;` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.noteUk` | `Українська ЙЦУКЕН. Домашній ряд: Ф І В А · О Л Д Ж. Ґ може потребувати окремої клавіші або комбінації залежно від ОС.` | `index.html <script#i18n-messages>` | динамічний | клавіші домашнього ряду UK: для en/pl — A S D F · J K L ; |
| `keyboard.noteEn` | `Англійська QWERTY. Виступи на F та J допомагають знайти домашній ряд навпомацки.` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.notePl` | `Польська програміста (QWERTY): ą ć ę ł ń ó ś ź ż — правий Alt (AltGr) + a c e l n o s x z у Windows, Option + ті самі клавіші в розкладці «Polish Pro» на macOS. Розкладка «Polish» на macOS влаштована інакше. Схема не перемикає розкладку ОС.` | `index.html <script#i18n-messages>` | динамічний |  |
| `keyboard.altgrTip` | `Шар AltGr: польську літеру набирає той самий палець, що й базову, з затиснутим AltGr (на macOS — Option).` | `index.html <script#i18n-messages>` | динамічний |  |
| `calculator.minutes` | `{minutes} хв` | `index.html <script#i18n-messages>` | динамічний |  |
| `calculator.hoursMinutes` | `{hours} год {minutes} хв` | `index.html <script#i18n-messages>` | динамічний |  |
| `calculator.errorInvalid` | `Введи коректні додатні швидкості та невід’ємний обсяг тексту.` | `index.html <script#i18n-messages>` | динамічний |  |
| `calculator.errorTarget` | `Щоб заощадити час, бажана швидкість має бути вищою.` | `index.html <script#i18n-messages>` | динамічний |  |
| `calculator.result` | `Більше часу на те, що має значення.` | `index.html <script#i18n-messages>` | динамічний |  |
| `calculator.currentLabelWpm` | `Поточна швидкість, слів/хв (WPM)` | `index.html <script#i18n-messages>` | динамічний |  |
| `calculator.currentLabelSpm` | `Поточна швидкість, символів/хв (SPM)` | `index.html <script#i18n-messages>` | динамічний |  |
| `calculator.targetLabelWpm` | `Бажана швидкість, слів/хв (WPM)` | `index.html <script#i18n-messages>` | динамічний |  |
| `calculator.targetLabelSpm` | `Бажана швидкість, символів/хв (SPM)` | `index.html <script#i18n-messages>` | динамічний |  |
| `calculator.volumeLabelWords` | `Обсяг тексту за день, умовних слів` | `index.html <script#i18n-messages>` | динамічний |  |
| `calculator.volumeLabelChars` | `Обсяг тексту за день, символів` | `index.html <script#i18n-messages>` | динамічний |  |
| `test.timeUp` | `Час вийшов! Тест завершено.` | `index.html <script#i18n-messages>` | динамічний |  |
| `test.textDone` | `Текст завершено!` | `index.html <script#i18n-messages>` | динамічний |  |
| `test.summary` | `{spm} SPM · {wpm} WPM · точність {accuracy} · символи: {characters}.` | `index.html <script#i18n-messages>` | динамічний |  |
| `test.statusDone` | `Результат зафіксовано. Розпочни новий тест, коли будеш готовий.` | `index.html <script#i18n-messages>` | динамічний |  |
| `test.durationLabel` | `one: {seconds} секунда / few: {seconds} секунди / many: {seconds} секунд / other: {seconds} секунди` | `index.html <script#i18n-messages>` | динамічний | форми множини |
| `test.statusReady` | `one: Друкуй протягом {seconds} секунди. Таймер почнеться з першого символу. / few: Друкуй протягом {seconds} секунд. Таймер почнеться з першого символу. / many: Друкуй протягом {seconds} секунд. Таймер почнеться з першого символу. / other: Друкуй протягом {seconds} секунди. Таймер почнеться з першого символу.` | `index.html <script#i18n-messages>` | динамічний | форми множини |
| `test.statusRunning` | `Тест триває. Не поспішай — тримай рівний ритм.` | `index.html <script#i18n-messages>` | динамічний |  |
| `plan.progress` | `{done} / 30 днів` | `index.html <script#i18n-messages>` | динамічний |  |
| `plan.dayLabel` | `День {day}: позначити практику` | `index.html <script#i18n-messages>` | динамічний |  |
| `plan.storageError` | `Браузер не дозволяє збереження. Прогрес доступний лише до закриття сторінки.` | `index.html <script#i18n-messages>` | динамічний |  |
| `trainers.iconAlt` | `Піктограма {name}` | `index.html <script#i18n-messages>` | динамічний |  |
| `trainers.imageAltFallback` | `{name}: ілюстрація можливостей тренажера` | `index.html <script#i18n-messages>` | динамічний |  |
| `trainers.placeholderKeys` | `ф і в а` | `index.html <script#i18n-messages>` | динамічний | клавіші домашнього ряду UK: для en/pl — A S D F · J K L ; |
| `trainers.tag.course` | `ПОСЛІДОВНИЙ КУРС` | `index.html <script#i18n-messages>` | динамічний |  |
| `trainers.tag.analytics` | `АНАЛІТИКА ТА ПЕРЕГОНИ` | `index.html <script#i18n-messages>` | динамічний |  |
| `trainers.tag.game` | `НАВЧАННЯ ЧЕРЕЗ ГРУ` | `index.html <script#i18n-messages>` | динамічний |  |
| `trainers.tag.method` | `МЕТОДИЧНА ПРАКТИКА` | `index.html <script#i18n-messages>` | динамічний |  |
| `trainers.tag.languages` | `ТРИ МОВИ` | `index.html <script#i18n-messages>` | динамічний |  |
| `trainers.linkOpen` | `Відкрити тренажер ↗` | `index.html <script#i18n-messages>` | динамічний |  |
| `trainers.linkGithubPrivate` | `GitHub · приватний ↗` | `index.html <script#i18n-messages>` | динамічний |  |
| `trainers.linkAlternative` | `Альтернативна версія ↗` | `index.html <script#i18n-messages>` | динамічний |  |
| `trainers.linkGuide` | `Інструкція ↗` | `index.html <script#i18n-messages>` | динамічний |  |
| `trainers.loadError` | `Не вдалося завантажити каталог. Онови сторінку.` | `index.html <script#i18n-messages>` | динамічний |  |
| `song.part.intro` | `Вступ` | `index.html <script#i18n-messages>` | динамічний |  |
| `song.part.verse1` | `Куплет 1` | `index.html <script#i18n-messages>` | динамічний |  |
| `song.part.verse2` | `Куплет 2` | `index.html <script#i18n-messages>` | динамічний |  |
| `song.part.preChorus` | `Передприспів` | `index.html <script#i18n-messages>` | динамічний |  |
| `song.part.chorus` | `Приспів` | `index.html <script#i18n-messages>` | динамічний |  |
| `song.part.bridge` | `Бридж` | `index.html <script#i18n-messages>` | динамічний |  |
| `song.part.finalChorus` | `Фінальний приспів` | `index.html <script#i18n-messages>` | динамічний |  |
| `song.part.outro` | `Кінцівка` | `index.html <script#i18n-messages>` | динамічний |  |
| `music.audioLabel` | `Пісня {title}` | `index.html <script#i18n-messages>` | динамічний |  |
| `music.coverAlt` | `Обкладинка пісні {title}` | `index.html <script#i18n-messages>` | динамічний |  |
| `test.leaveWarning` | `Тест ще триває. Заверши його або натисни мову ще раз, щоб перейти без результату.` | `index.html <script#i18n-messages>` | динамічний |  |

## catalog.json

| Ключ | Текст | Де | Тип | Примітка |
|---|---|---|---|---|
| `— (solo.name)` | `Соло` | `catalog.json[0].name` | оригінал | власна назва |
| `— (solo.author)` | `Гайдук Анна` | `catalog.json[0].author` | оригінал | ім’я автора |
| `catalog.solo.description` | `Послідовний курс сенсорного друку: від перших клавіш до впевненого набору тексту.` | `catalog.json[0].description` | каталог |  |
| `catalog.solo.feature1` | `Залік без екранної клавіатури й підказок: потрібні 3 успішні спроби поспіль.` | `catalog.json[0].features[0]` | каталог |  |
| `catalog.solo.feature2` | `Поріг точності видно ще до старту; формули швидкості й точності показано в інтерфейсі.` | `catalog.json[0].features[1]` | каталог |  |
| `catalog.solo.feature3` | `Прогрес зберігається в браузері.` | `catalog.json[0].features[2]` | каталог |  |
| `catalog.solo.imageAlt` | `Ілюстрація: руки на домашньому ряді, сходинки з клавіш ведуть до аркуша з текстом і трьох позначок успішних спроб.` | `catalog.json[0].imageAlt` | каталог |  |
| `— (typing-race.name)` | `Typing-Race` | `catalog.json[1].name` | оригінал | власна назва |
| `— (typing-race.author)` | `prodelt · GitHub` | `catalog.json[1].author` | оригінал | ім’я автора |
| `catalog.typing-race.description` | `Навчальна система з підказками пальців, детальною аналітикою та перегонами з друзями.` | `catalog.json[1].description` | каталог |  |
| `catalog.typing-race.feature1` | `Після вправи — помилки за символами, найповільніший перехід, ритм і порада, що тренувати далі.` | `catalog.json[1].features[0]` | каталог |  |
| `catalog.typing-race.feature2` | `Перегони в приватній кімнаті за кодом із живим прогресом суперника й рейтингом.` | `catalog.json[1].features[1]` | каталог |  |
| `catalog.typing-race.feature3` | `Теми, розмір тексту до 40 px, режим зменшеного руху.` | `catalog.json[1].features[2]` | каталог |  |
| `catalog.typing-race.imageAlt` | `Ілюстрація: три машини на гоночній трасі поруч із карткою аналітики — графіками й клавіатурою з підсвіченими помилками.` | `catalog.json[1].imageAlt` | каталог |  |
| `— (typtap.name)` | `TypTap` | `catalog.json[2].name` | оригінал | власна назва |
| `— (typtap.author)` | `Артем · artyd` | `catalog.json[2].author` | оригінал | ім’я автора |
| `catalog.typtap.description` | `Тренажер із мініграми та мультиплеєром: навчання, яке легко перетворити на гру.` | `catalog.json[2].description` | каталог |  |
| `catalog.typtap.feature1` | `16 мініігор і гонка одним текстом до 8 гравців.` | `catalog.json[2].features[0]` | каталог |  |
| `catalog.typtap.feature2` | `Режим «Слабкі клавіші» добирає вправи за вашими помилками.` | `catalog.json[2].features[1]` | каталог |  |
| `catalog.typtap.feature3` | `Свій текст: вставте його або завантажте файл .txt чи .md.` | `catalog.json[2].features[2]` | каталог |  |
| `catalog.typtap.imageAlt` | `Ілюстрація: вісім усміхнених персонажів-гравців над чотирма мініграми з клавіш.` | `catalog.json[2].imageAlt` | каталог |  |
| `— (gamy.name)` | `Гами` | `catalog.json[3].name` | оригінал | власна назва |
| `— (gamy.author)` | `apteka95video-source · GitHub` | `catalog.json[3].author` | оригінал | ім’я автора |
| `catalog.gamy.description` | `Вправи як гами на фортепіано: короткий рух, одна мета, нова складність лише після засвоєння.` | `catalog.json[3].description` | каталог |  |
| `catalog.gamy.feature1` | `Залік без клавіатури й підказок, поріг точності 95–97 %, 3 успішні спроби поспіль.` | `catalog.json[3].features[0]` | каталог |  |
| `catalog.gamy.feature2` | `Розбір помилок, найповільніші переходи, графік ритму, вправа «Слабкі місця».` | `catalog.json[3].features[1]` | каталог |  |
| `catalog.gamy.feature3` | `Працює офлайн, як застосунок (PWA), і нічого не надсилає в мережу.` | `catalog.json[3].features[2]` | каталог |  |
| `catalog.gamy.imageAlt` | `Ілюстрація: палець натискає клавіші, що піднімаються, як гама на фортепіано, над ними нотний стан.` | `catalog.json[3].imageAlt` | каталог |  |
| `— (academy.name)` | `Touch Type Race Academy` | `catalog.json[4].name` | оригінал | власна назва |
| `— (academy.author)` | `Stanislav Zubar і Myroslav Zubar` | `catalog.json[4].author` | оригінал | ім’я автора |
| `catalog.academy.description` | `Великий тренажер із перегонами: соло, проти бота або онлайн, трьома мовами.` | `catalog.json[4].description` | каталог |  |
| `catalog.academy.feature1` | `Режими «Соло», «Проти AI» (4 швидкості бота) і «Онлайн» у кімнатах на 2, 4 або 6 гравців.` | `catalog.json[4].features[0]` | каталог |  |
| `catalog.academy.feature2` | `Українська, англійська й польська; до шести профілів на одному комп'ютері.` | `catalog.json[4].features[1]` | каталог |  |
| `catalog.academy.feature3` | `Аналітика після заїзду, щоденний лічильник тренувань, досягнення.` | `catalog.json[4].features[2]` | каталог |  |
| `catalog.academy.imageAlt` | `Ілюстрація: три машини в кольорах прапорів мчать дорогою, поруч робот із картатим прапорцем і глобус онлайн-гри.` | `catalog.json[4].imageAlt` | каталог |  |
