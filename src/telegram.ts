const SDK_URL = 'https://telegram.org/js/telegram-web-app.js'

export interface DeviceStorage {
  getItem(key: string, callback: (error: string | null, value?: string | null) => void): void
  setItem(key: string, value: string, callback?: (error: string | null) => void): void
}

interface BackButton {
  show(): void
  hide(): void
  onClick(callback: () => void): void
  offClick(callback: () => void): void
}

interface WebApp {
  ready(): void
  expand(): void
  disableVerticalSwipes(): void
  isVersionAtLeast(version: string): boolean
  BackButton: BackButton
  DeviceStorage: DeviceStorage
  HapticFeedback: {
    impactOccurred(style: 'light'): void
    notificationOccurred(type: 'success'): void
  }
}

declare global {
  interface Window {
    Telegram?: { WebApp: WebApp }
  }
}

// null — сайт открыт не в Telegram.
export let telegram: WebApp | null = null

export const telegramBackButton = () => (telegram?.isVersionAtLeast('6.1') ? telegram.BackButton : null)
export const telegramDeviceStorage = () => (telegram?.isVersionAtLeast('9.0') ? telegram.DeviceStorage : null)

// Telegram передаёт данные запуска в адресе страницы после #. На экране «Домой» и в браузере скрипт не загружается:
// при недоступном telegram.org он задержал бы запуск игры.
export async function initTelegram() {
  if (!location.hash.includes('tgWebApp')) return
  const loaded = await new Promise<boolean>((resolve) => {
    const script = document.createElement('script')
    script.src = SDK_URL
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.append(script)
  })
  if (!loaded || !window.Telegram) return
  telegram = window.Telegram.WebApp
  telegram.ready()
  telegram.expand()
  // Иначе часть, которую ведут вниз, сворачивает приложение.
  if (telegram.isVersionAtLeast('7.7')) telegram.disableVerticalSwipes()
}

export const hapticPlaced = () => {
  if (telegram?.isVersionAtLeast('6.1')) telegram.HapticFeedback.impactOccurred('light')
}

export const hapticSolved = () => {
  if (telegram?.isVersionAtLeast('6.1')) telegram.HapticFeedback.notificationOccurred('success')
}
