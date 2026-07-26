# China Trip 2026 — инструкция для OpenCode

## Проект
Планирование групповой поездки в Китай (Шанхай → Нинбо → Ханчжоу → Хуаншань → Пекин).
Даты: 08–24 сентября 2026. Группа: 5–6 человек.
Сайт: https://maximkolmakovai.github.io/china-trip-2026/
Репозиторий: https://github.com/maximkolmakovAI/china-trip-2026

## Как опубликовать изменения
```bash
git add -A && git commit -m "описание" && git push
```
GitHub Actions сам соберёт и опубликует за ~70 сек.

## Технологии
- Next.js 16 (webpack, НЕ Turbopack)
- Tailwind v3, TypeScript
- Firebase Firestore (china-trip-2026-6231f) + fallback localStorage
- Framer Motion, @dnd-kit, react-leaflet
- Статический экспорт: `next.config.ts` → `output: "export"`

## ⚠️ Критичные правила
1. **basePath** = `/china-trip-2026/`. Пути к картинкам **только через `img()`** из `@/lib/img.ts`:
   ```tsx
   import { img } from "@/lib/img";
   <img src={img("/images/foo.jpg")} />
   ```
   `<img src="/images/foo.jpg">` сломается на GitHub Pages.

2. **Firebase**: конфиг в `src/lib/firebase.ts` (не env vars).

3. **Local сборка**: `npx next build --webpack && npx serve out`
   С basePath (как на проде): `$env:NEXT_PUBLIC_BASE_PATH="/china-trip-2026"; npx next build --webpack`

4. **Дизайн**: Brutal Expression — `#F5F0EB` фон, чёрные рамки 3px, `#E50071` розовый. Без градиентов, теней, glass.

5. **Genshin Auth**: 24 персонажа. Per-user localStorage с префиксом `*_${userId}`.

## Ключевые файлы
- `src/data/data.json` — отели, программа (16 дней), visited, идеи
- `src/data/aiSuggestions.json` — AI-идеи по городам
- `src/data/placeCoords.ts` — координаты мест
- `src/lib/types.ts` — IdeaItem: id, text, note, description, pros, cons, insight, link
- `src/lib/useUser.tsx` — Genshin auth + per-user localStorage
- `src/lib/useVotes.tsx` — голосовалка
- `src/lib/useDetailModal.tsx` — универсальная модалка
- `src/components/` — все компоненты

## Порядок блоков на странице
Отели → Идеи → Программа → Погода → Чеклист → Бюджет → Сравнение → Сейф → Голос → PDF → Таймлайн → Карта → Помощник

## Per-user localStorage ключи (префикс `china_trip_` + `_{userId}`)
- `votes_` — голоса
- `checklist_` — чеклист
- `budget_` — бюджет
- `program_order_` — порядок дней
- `items_order_*_d*` — порядок пунктов внутри дня
- `locks_` — зафиксированные пункты
- `custom_hotels_` / `custom_ideas_` — добавленные вручную
- `docs_` — документы
- `voice_` — голосовые заметки
- `feedback_` — фидбек (идеи/баги)

## Ограничения
- Firewall блокирует image CDN (Unsplash, Booking, Agoda и др.)
- `placehold.co` — доступен для плейсхолдеров
- `genshin.jmp.blue` — портреты уже скачаны в `public/images/characters/`
- Google Docs недоступен — данные сверяем по списку от пользователя
- Yandex Browser: старый SW может кэшировать — очистка через F12 → Clear storage
