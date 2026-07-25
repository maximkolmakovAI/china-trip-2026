# CHINA TRIP 2026 — План проекта

## ✅ Реализовано

### Базовый функционал
- [x] Данные 16 отелей, 16 дней программы, идеи
- [x] Дизайн Brutal Expression (светлый `#F5F0EB`, рамки 3px, розовый `#E50071`)
- [x] Навигация (Navbar) по 14 секциям
- [x] Hero с фото Шанхая
- [x] Отели: секция + карточки + фильтры (бюджет/WOW/Unique)
- [x] Программа: DayCard с чекбоксами + статусы
- [x] Идеи: категории + IdeaCard + голосование
- [x] Ассистент: советы ИИ (AssistantSection)

### Фичи
- [x] WeatherWidget — погода сентября
- [x] TravelChecklist — чеклист с прогресс-баром (per-user)
- [x] BudgetCalculator — калькулятор бюджета (ночи/комнаты, per-user)
- [x] HotelComparison — сравнение 2-3 отелей
- [x] DragDropTimeline — перетаскивание дней (dnd-kit, per-user)
- [x] RouteMap — анимированная SVG-карта по дням
- [x] AddItemPanel — формы добавления отеля/идеи (per-user)
- [x] AI-рекомендации (53 места для 5 городов)
- [x] RouteOptimizer — TSP-оптимизатор маршрута дня (встроен в DayCard)
- [x] PinMap — Leaflet-карта всех мест (отели + достопримечательности)
- [x] VoiceNotes — запись голоса + транскрибация через Newton AI (токен встроен)
- [x] ExportPdf — открыть/распечатать программу как PDF
- [x] SplitwiseCalculator — долги между участниками с авто-расчётом (greedy settle)
- [x] GalleryWall — фотогалерея (drag&drop, base64, сжатие до 1280px, localStorage)
- [x] Service Worker — офлайн-кэш (cache-first, bg-update)
- [x] Реальные фото всех 16 отелей + 5 городов (Wikimedia Commons, JPEG)

### Пользователи и данные
- [x] Auth: Genshin Impact (24 персонажа, register/login/logout)
- [x] Per-user: голоса, чеклист, бюджет, порядок дней, кастомные отели/идеи, доки, голос
- [x] DocumentVault — сейф документов с паролем на каждый

### Инфраструктура
- [x] Next.js 16, webpack, Tailwind v3, TypeScript
- [x] Статический экспорт (`output: "export"`)
- [x] start-preview.bat (build → serve :5000 → auto-open)
- [x] vercel.json
- [x] GitHub Actions workflow (`.github/workflows/deploy.yml`) — авто-деплой на GitHub Pages
- [x] `basePath` конфигурируемый через `NEXT_PUBLIC_BASE_PATH`
- [x] Service Worker + регистрация
- [x] AGENTS.md, HANDOVER.md, PLAN.md

---

## ❌ Не реализовано (почему и что нужно)

### 1. Firebase Firestore (live sync)
**Проблема:** Голоса уходят в localStorage. Firebase config (`NEXT_PUBLIC_FIREBASE_*`) не заполнен.
**Что делать:**
- Создать проект Firebase Console
- Заполнить переменные в Vercel / .env.local
- Включить Firestore Database
- Голоса начнут синхронизироваться (VoteProvider уже подписан)

### 2. Деплой на Vercel / GitHub Pages
**Проблема:** Не выполнен push в Git.
**Что делать:**
- **GitHub Pages:** `git push origin main` — workflow `.github/workflows/deploy.yml` соберёт и опубликует автоматически. В Settings → Pages выбрать Source: GitHub Actions.
- **Vercel:** `vercel --prod` после Firebase config.

### 3. Live Collaborative Editing
**Проблема:** Требует Firestore writes + onSnapshot для чек-боксов, порядка дней, бюджета.
**Статус:** Можно сделать после пункта 1 (Firebase config).

---

## 📋 Оставшиеся приоритеты

1. **Firebase config** — критично для live sync (не для локального использования)
2. **Push в Git + GitHub Pages** — группа сможет пользоваться

---

## 📁 Структура компонентов

```
src/components/
├── AuthModal.tsx              ✅ Genshin login/register
├── DocumentVault.tsx          ✅ Сейф с паролями
├── RouteOptimizer.tsx         ✅ TSP маршрутов
├── PinMap.tsx                 ✅ Leaflet-карта
├── VoiceNotes.tsx             ✅ Голос + Newton
├── ExportPdf.tsx              ✅ PDF экспорт
├── SplitwiseCalculator.tsx    ✅ Долги (greedy settle, балансы, фильтр split)
├── GalleryWall.tsx            ✅ Фотогалерея (base64, сжатие, lightbox)
├── ServiceWorkerRegister.tsx  ✅ SW регистрация (prod-only)
├── Navbar.tsx                 ✅ 14 секций + user info
├── DayCard.tsx                ✅ RouteOptimizer встроен
├── VoteButton.tsx             ✅ Per-user голоса
├── TravelChecklist.tsx        ✅ Per-user
├── BudgetCalculator.tsx       ✅ Per-user
├── DragDropTimeline.tsx       ✅ Per-user
├── AddItemPanel.tsx           ✅ Per-user
└── ...

src/data/
├── placeCoords.ts             ✅ Координаты для оптимизатора + карты
├── aiSuggestions.json         ✅ 53 AI-рекомендации
└── data.json                  ✅ 16 отелей, 16 дней, идеи

src/lib/
├── useUser.tsx                ✅ UserProvider + контекст
├── useVotes.tsx               ✅ Per-user голоса
└── firebase.ts                ⚠️ Ждёт config

public/
├── service-worker.js          ✅ Офлайн-кэш
├── images/hotels/.../*.svg    ✅ SVG-заглушки (нужны реальные .jpg)
└── images/cities/...          ✅ Shanghai, Hangzhou (.jpg) + Beijing, Huangshan, Ningbo (.svg)
```

---

## ✅ Что доделано в текущей сессии

| Фича | Файл | Статус |
|------|------|--------|
| **DetailModal** — универсальная модалка (программа/идеи/отели/AI) | `DetailModal.tsx`, `useDetailModal.tsx` | ✅ |
| **PinMap** — переписан: CARTO тайлы, маршруты городов (пунктир) + дни (цветные), клик → DetailModal | `PinMap.tsx` | ✅ |
| **HotelCard** — галерея 3 фото (точки-переключатели), клик → DetailModal | `HotelCard.tsx` | ✅ |
| **DayCard** — перетаскивание пунктов внутри дня (HTML5 DnD), per-user local | `DayCard.tsx` | ✅ |
| **IdeaCard** — кликабельно → DetailModal | `IdeaCard.tsx` | ✅ |
| Navbar — 14 секций, user info | `Navbar.tsx` | ✅ |

---

*Последнее обновление: 25.07.2026 текущая сессия*
