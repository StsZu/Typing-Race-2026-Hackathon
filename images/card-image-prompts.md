# Промпти для картинок карток тренажерів

## Розмір

Блок `.app-image` у `style.css`: `object-fit: cover`, `object-position: top`.

| Екран | Ширина картки | Висота картинки | Пропорція |
|---|---|---|---|
| Десктоп, 3 колонки | ~377 px | 177 px | 2,13 : 1 |
| Планшет, 2 колонки | 357–482 px | 177 px | 2,0–2,7 : 1 |
| Телефон, 1 колонка | 320–720 px | 200 px | 1,6–3,6 : 1 |

- Генерувати: 1600×752 (2,13:1). Експорт: WebP 1280×600, ~40–80 КБ.
- Безпечна зона: центральні 75 % ширини, верхні 60 % висоти. Нижні 40 % — порожнє тло.
- «Гами» зараз без картинки (заглушка «ф і в а»).
- Для Academy `app.js` примусово показує піктограму 148×148; банер з'явиться лише після правки коду.
- Підпис «Знімки — архівні, з аудиту» треба змінити: це ілюстрації, не скриншоти.

## Спільний блок стилю (додати до кожного промпту)

```
Style: clean flat-vector editorial illustration with soft subtle depth, rounded shapes, generous negative space. Palette: light background #e9eef5, white surfaces, deep navy #14273b, accent blue #2364df, small lime #d3f477 highlights. Wide banner 1600x752 (2.13:1). Place the main subject in the upper-center area: within the central 75% of the width and the top 60% of the height; keep the bottom 40% as plain background. No text, no letters, no numbers, no logos, no UI labels, no watermark. Keycaps are blank.
```

## 1. Соло — послідовний курс

```
A calm learning path: a gently ascending staircase made of blank keyboard keycaps, starting from a highlighted home row and rising step by step toward a simple sheet of paper with abstract lines of text. Two stylized hands rest on the home-row keys at the bottom of the path. Beside the top step, three small round checkmark badges in a row symbolize three successful attempts in a row. Mood: focused, orderly, encouraging. Minimal, one clear diagonal composition from left to right.
```

## 2. Typing-Race — аналітика і перегони

```
Split composition. Left half: a stylized top-down race track with three lanes and three small rounded cars racing to the right with soft motion streaks, one car in accent blue slightly ahead. Right half: a floating white analytics card with abstract charts — a short bar chart with one bar highlighted in lime, a smooth rhythm line graph, and a small heat grid of blank keycaps where two keys glow softly to show mistakes. Mood: energetic but precise, friendly competition plus insight.
```

## 3. TypTap — мініігри й мультиплеєр

```
A playful arcade scene: a loose grid of small rounded game tiles floating in space, each showing a different tiny minigame motif made of blank keycaps — falling keys, a keycap maze, a keycap target, a keycap bridge. Above them, a row of eight small round friendly avatars of different colors cheering, suggesting up to eight players. Soft confetti dots in lime and blue. Mood: fun, light, social, game-like, but still clean and uncluttered.
```

## 4. Гами — вправи як гами на фортепіано

```
A visual metaphor of musical scales: a stylized piano-like row of blank keyboard keycaps where a short sequence of keys rises like a scale, each step glowing slightly brighter in accent blue, with one lime-highlighted key marking the next new key unlocked only after mastery. Above the keys, a few thin flowing musical staff lines with round note dots aligned to the highlighted keys. A single stylized hand with one finger pressing a key. Mood: rhythmic, patient, methodical, calm.
```

## 5. Touch Type Race Academy — три мови, боти й онлайн

Лише якщо в коді прибрати примусову піктограму.

```
A wide racing scene on a smooth road heading toward the horizon, viewed from slightly above and behind: three small rounded race cars side by side, each with a simple colored stripe pattern evoking a different flag (blue-yellow, red-white-blue, white-red) without any actual flag emblems or text. On one side of the road, a small friendly robot figure waving a checkered flag represents bots; on the other side, a softly glowing globe icon represents online opponents. Mood: dynamic, international, welcoming.
```
