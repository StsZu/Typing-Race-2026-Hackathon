# Інвентар даних

Дата інвентаризації: 30 серпня 2026 року.

Усі матеріали розкладено за мовою та призначенням. Службові файли macOS перенесено до локального каталогу, який не входить у Git.

## Набори

| Мова | Каталог | Тип | Файлів | Ліцензія або статус |
|---|---|---|---:|---|
| EN | dictionaries/english/wordlists/frequencywords-2018/ | частотний список | 3 | MIT |
| EN | dictionaries/english/wordlists/hunspell-en/ | Hunspell | 5 | див. LICENSE |
| EN | dictionaries/english/wordlists/dwyl-english-words/ | алфавітний список | 2 | Unlicense |
| EN | dictionaries/english/academy/typing-race-2026/ | Академія | 2 | не заявлена |
| EN | dictionaries/english/tutor/ | курси й вправи | 1 069 | не заявлена |
| UK | dictionaries/ukrainian/wordlists/frequencywords-2018/ | частотний список | 3 | MIT |
| UK | dictionaries/ukrainian/wordlists/hunspell-uk/ | Hunspell | 5 | GPL-3.0 та умови пакета |
| UK | dictionaries/ukrainian/academy/typing-race-2026/ | Академія | 2 | не заявлена |
| UK | dictionaries/ukrainian/tutor/ | курси й вправи | 716 | не заявлена |
| UK | dictionaries/ukrainian/texts/radio-dictations/ | навчальні тексти | 16 | потребує перевірки |

## Обсяг основних списків

| Мова | Набір | Записів |
|---|---|---:|
| EN | FrequencyWords 50k | 50 000 |
| EN | FrequencyWords full | 1 656 996 |
| EN | DWYL | 370 105 |
| EN | Hunspell | 49 568 |
| UK | FrequencyWords 50k | 50 000 |
| UK | FrequencyWords full | 290 325 |
| UK | Hunspell | 336 673 |

Заголовок Hunspell із заявленою кількістю не враховується як словниковий запис.

## Точні дублікати

Знайдено дві групи побітових дублікатів, усього чотири файли. Це навмисно збережені копії ліцензій біля відповідних мовних наборів:

- PACKAGE-LICENSE-MIT у двох Hunspell-каталогах;
- LICENSE у двох FrequencyWords-каталогах.

Словникових або навчальних файлів із однаковою SHA-256 не знайдено.

## Копії з Typing-race-2026

Ревізія відстежуваних джерел: 4a238aa38014073ed96dde7a32c1a101456136b4.

| Мова | Склад |
|---|---|
| EN | 83 вправи Академії; 2 Tutor-курси, 382 вправи; 22 уроки Бібліотеки знань; словник інтерфейсу |
| UK | 63 вправи Академії; 2 Tutor-курси, 472 вправи; 20 уроків Бібліотеки знань; 2 особисті вправи; словник інтерфейсу |

## Карта переміщень

| Старий шлях | Новий шлях |
|---|---|
| TECHNICAL_SPECIFICATION.md | docs/TECHNICAL_SPECIFICATION.md |
| SOURCES.md | docs/SOURCES.md |
| dictionaries/TASK/ | docs/tasks/ |
| dictionaries/en/frequencywords-2018/ | dictionaries/english/wordlists/frequencywords-2018/ |
| dictionaries/en/hunspell-en/ | dictionaries/english/wordlists/hunspell-en/ |
| dictionaries/en/dwyl-english-words/ | dictionaries/english/wordlists/dwyl-english-words/ |
| dictionaries/en/typing-race-2026/ | dictionaries/english/academy/, tutor/, knowledge/ і reference/ |
| dictionaries/tt-exercises-en/ | dictionaries/english/tutor/tt-exercises/ |
| dictionaries/uk/frequencywords-2018/ | dictionaries/ukrainian/wordlists/frequencywords-2018/ |
| dictionaries/uk/hunspell-uk/ | dictionaries/ukrainian/wordlists/hunspell-uk/ |
| dictionaries/uk/typing-race-2026/ | dictionaries/ukrainian/academy/, tutor/, knowledge/, texts/ і reference/ |
| dictionaries/tt-exercises/ | dictionaries/ukrainian/tutor/tt-exercises/ |
| dictionaries/Radiodyktanty_Natsionalnoi_Yednosti/ | dictionaries/ukrainian/texts/radio-dictations/ |
| усі .DS_Store | _local/macos-metadata/ |

## Цілісність

Жоден словниковий або навчальний файл не видалено. Після перейменування TT змінено лише службове позначення джерела та назви полів метаданих; самі тексти вправ не редагувалися. Актуальні SHA-256 зберігаються в [CHECKSUMS.sha256](../dictionaries/CHECKSUMS.sha256).
