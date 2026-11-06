# puzzlovna

Игра-пазл из фото: Vite + React, публикация на GitHub Pages. Одна страница работает в двух режимах: веб-приложение с экрана «Домой» и Telegram Mini App.

Адрес: https://olkrind.github.io/puzzlovna/

## Команды

```bash
npm install
npm run dev      # локальный сервер
npm run lint     # oxlint
npm run build    # проверка типов и сборка в dist/
npm run albums   # обновить список альбомов из соседнего проекта ../tcp
```

## Публикация

Push в `master` запускает `.github/workflows/deploy.yml`. В Settings → Pages → Source должно быть выбрано **GitHub Actions**.

## Режимы

| | Экран «Домой» и браузер | Telegram |
|---|---|---|
| Запуск | Safari → «Поделиться» → «На экран Домой» | бот, Mini App URL — адрес выше |
| Определение режима | в адресе нет `tgWebApp` | Telegram передаёт `#tgWebAppData=…` |
| Прогресс | `localStorage` | DeviceStorage (Bot API 9.0), при ошибке — `localStorage` |
| «Назад» | кнопки на странице | кнопки на странице и `BackButton` в шапке |
| Вибрация | нет | `HapticFeedback` |

Прогресс не общий: Telegram, Safari и экран «Домой» хранят его отдельно. Серверная часть бота и его токен игре не нужны.

## Фото

Фото отдаёт воркер проекта `tcp` (`https://tcp.olkrind.workers.dev`), лимит 100 000 запросов в сутки общий с сайтом. Список альбомов — копия в `src/generated/albums.json`: только альбомы со скачиванием, без видео. После новых альбомов в `tcp` — `npm run albums` и коммит.

## Игра

Код перенесён из `tcp`: `src/puzzle.ts`, `src/components/Puzzle.tsx`, `src/components/Confetti.tsx`, `src/pages/PuzzleAlbumPage.tsx`. Исправления переносятся в обе копии вручную.

Отличия от `tcp`:

- Адрес страницы хранится в памяти (`MemoryRouter`): адресной строки нет, а `#` занят данными запуска Telegram.
- `src/storage.ts`: весь прогресс — одна запись, у DeviceStorage нет списка ключей. Запись загружается до показа игры, чтение из памяти синхронное.
- `src/telegram.ts`: скрипт Telegram загружается только внутри Telegram.

## Отладка на устройстве

- iPhone: в Telegram 10 раз нажать на «Настройки» → «Allow Web View Inspection»; телефон по кабелю к Mac → Safari → Разработка → устройство.
- Android: Debug Settings → «Enable WebView Debug», затем `chrome://inspect`.
