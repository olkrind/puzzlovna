import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router'
import './index.css'
import { ScrollToTop } from './components/ScrollToTop.tsx'
import { TelegramBack } from './components/TelegramBack.tsx'
import { PuzzleAlbumPage } from './pages/PuzzleAlbumPage.tsx'
import { PuzzleHome } from './pages/PuzzleHome.tsx'
import { initStorage } from './storage.ts'
import { initTelegram } from './telegram.ts'

await initTelegram()
await initStorage()

// Адрес хранится в памяти: адресной строки нет ни в Telegram, ни на экране «Домой», а Telegram занимает # данными запуска.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MemoryRouter>
      <ScrollToTop />
      <TelegramBack />
      <Routes>
        <Route path="/" element={<PuzzleHome />} />
        <Route path="/:slug" element={<PuzzleAlbumPage />} />
        <Route path="/:slug/:tab" element={<PuzzleAlbumPage />} />
      </Routes>
    </MemoryRouter>
  </StrictMode>,
)
