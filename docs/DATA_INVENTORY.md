# Інвентар даних

Дата інвентаризації: 30 серпня 2026 року.

Усі матеріали розкладено за мовою та призначенням. Службові файли macOS перенесено до локального каталогу, який не входить у Git.

## Набори

| Мова | Каталог | Тип | Файлів | Ліцензія або статус |
|---|---|---|---:|---|
| EN | dictionaries/en/wordlists/frequencywords-2018/ | частотний список | 3 | MIT |
| EN | dictionaries/en/wordlists/hunspell-en/ | Hunspell | 5 | див. LICENSE |
| EN | dictionaries/en/wordlists/dwyl-english-words/ | алфавітний список | 2 | Unlicense |
| EN | dictionaries/en/training/typing-race-2026/ | навчальні банки | 28 | не заявлена |
| EN | dictionaries/en/training/tt-exercises/ | вправи | 1 066 | не заявлена |
| UK | dictionaries/uk/wordlists/frequencywords-2018/ | частотний список | 3 | MIT |
| UK | dictionaries/uk/wordlists/hunspell-uk/ | Hunspell | 5 | GPL-3.0 та умови пакета |
| UK | dictionaries/uk/training/typing-race-2026/ | навчальні банки | 28 | не заявлена |
| UK | dictionaries/uk/training/tt-exercises/ | вправи | 713 | не заявлена |
| UK | dictionaries/uk/training/radio-dictations/ | навчальні тексти | 16 | потребує перевірки |

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
| dictionaries/en/frequencywords-2018/ | dictionaries/en/wordlists/frequencywords-2018/ |
| dictionaries/en/hunspell-en/ | dictionaries/en/wordlists/hunspell-en/ |
| dictionaries/en/dwyl-english-words/ | dictionaries/en/wordlists/dwyl-english-words/ |
| dictionaries/en/typing-race-2026/ | dictionaries/en/training/typing-race-2026/ |
| dictionaries/tt-exercises-en/ | dictionaries/en/training/tt-exercises/ |
| dictionaries/uk/frequencywords-2018/ | dictionaries/uk/wordlists/frequencywords-2018/ |
| dictionaries/uk/hunspell-uk/ | dictionaries/uk/wordlists/hunspell-uk/ |
| dictionaries/uk/typing-race-2026/ | dictionaries/uk/training/typing-race-2026/ |
| dictionaries/tt-exercises/ | dictionaries/uk/training/tt-exercises/ |
| dictionaries/Radiodyktanty_Natsionalnoi_Yednosti/ | dictionaries/uk/training/radio-dictations/ |
| усі .DS_Store | _local/macos-metadata/ |

## Цілісність

Жоден словниковий або навчальний файл не видалено. Після перейменування TT змінено лише службове позначення джерела та назви полів метаданих; самі тексти вправ не редагувалися. Актуальні SHA-256 зберігаються в [CHECKSUMS.sha256](../dictionaries/CHECKSUMS.sha256).
