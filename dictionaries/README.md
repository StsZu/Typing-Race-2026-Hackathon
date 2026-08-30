# Словники та навчальні матеріали

Каталог має однакову структуру для обох мов:

~~~text
dictionaries/
├── en/
│   ├── wordlists/
│   └── training/
├── uk/
│   ├── wordlists/
│   └── training/
├── manifest.yml
└── CHECKSUMS.sha256
~~~

## Англійська

### Wordlists

- [FrequencyWords 50k](en/wordlists/frequencywords-2018/en_50k.txt) — слово та частота, 50 000 записів, MIT.
- [FrequencyWords full](en/wordlists/frequencywords-2018/en_full.txt) — 1 656 996 записів, MIT.
- [DWYL English Words](en/wordlists/dwyl-english-words/words_alpha.txt) — 370 105 слів, Unlicense.
- [Hunspell](en/wordlists/hunspell-en/index.dic) — 49 568 словникових записів; файл index.aff містить правила словозміни.

### Training

- [Typing-race-2026](en/training/typing-race-2026/) — Академія, Tutor, Бібліотека знань та словник інтерфейсу.
- [TT exercises](en/training/tt-exercises/INDEX.md) — 1 066 вправ у п’яти курсах.

## Українська

### Wordlists

- [FrequencyWords 50k](uk/wordlists/frequencywords-2018/uk_50k.txt) — слово та частота, 50 000 записів, MIT.
- [FrequencyWords full](uk/wordlists/frequencywords-2018/uk_full.txt) — 290 325 записів, MIT.
- [Hunspell](uk/wordlists/hunspell-uk/index.dic) — 336 673 словникові записи; файл index.aff містить правила словозміни.

### Training

- [Typing-race-2026](uk/training/typing-race-2026/) — Академія, Tutor, Бібліотека знань, особисті вправи та словник інтерфейсу.
- [TT exercises](uk/training/tt-exercises/INDEX.md) — 713 вправ у чотирьох курсах.
- [Радіодиктанти](uk/training/radio-dictations/) — 16 навчальних текстів за 2010–2025 роки.

## Формати

- FrequencyWords: UTF-8, один запис у рядку у форматі «слово частота».
- DWYL: одне англійське слово в рядку.
- Hunspell: index.dic використовується разом з index.aff.
- Training: вихідні файли TS, JSON, Markdown і TXT.

## Правила використання

1. Не змінюйте вихідні файли; очищені дані створюйте у власному проєкті.
2. Зберігайте атрибуцію і ліцензію кожного відкритого набору.
3. Перевіряйте слова перед показом користувачеві.
4. Не змішуйте набори з різними ліцензіями без опису походження.
5. Матеріали без заявленої ліцензії використовуйте лише в межах, погоджених організатором.
6. Для української зберігайте літери і, ї, є, ґ та нормалізуйте Unicode до NFC.

## Перевірка

У корені репозиторію виконайте:

~~~bash
./scripts/verify-data.sh
~~~

Докладні метадані: [manifest.yml](manifest.yml).
