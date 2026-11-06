import { telegramDeviceStorage, type DeviceStorage } from './telegram.ts'

// Весь прогресс — одна запись: у DeviceStorage нет списка ключей, а сетка альбома читает все игры сразу.
// Запись загружается в память до показа игры, поэтому чтение синхронное.
const STORE_KEY = 'puzzlovna'
const READ_TIMEOUT = 3000

const readLocal = () => {
  try {
    return localStorage.getItem(STORE_KEY)
  } catch {
    return null
  }
}

const writeLocal = (value: string) => {
  try {
    localStorage.setItem(STORE_KEY, value)
  } catch {
    // Без localStorage (приватный режим) игра работает, но не сохраняется.
  }
}

const readDevice = (device: DeviceStorage) =>
  new Promise<string | null>((resolve, reject) => {
    setTimeout(() => reject(new Error('timeout')), READ_TIMEOUT)
    device.getItem(STORE_KEY, (error, value) => (error ? reject(new Error(error)) : resolve(value || null)))
  })

let records: Record<string, string> = {}
let write = writeLocal
let writeQueued = false

const queueWrite = () => {
  if (writeQueued) return
  writeQueued = true
  // Сброс альбома меняет сотни записей подряд: на диск они попадают одним сохранением.
  queueMicrotask(() => {
    writeQueued = false
    write(JSON.stringify(records))
  })
}

export async function initStorage() {
  const device = telegramDeviceStorage()
  let stored: string | null
  try {
    stored = device ? await readDevice(device) : readLocal()
    if (device) write = (value) => device.setItem(STORE_KEY, value)
  } catch {
    // Если DeviceStorage не ответил, запись в него затёрла бы прогресс пустым: сеанс работает с localStorage.
    stored = readLocal()
  }
  try {
    records = JSON.parse(stored ?? '{}')
  } catch {
    records = {}
  }
}

export const getItem = (key: string) => records[key] ?? null

export function setItem(key: string, value: string) {
  records[key] = value
  queueWrite()
}

export function removeItem(key: string) {
  delete records[key]
  queueWrite()
}
