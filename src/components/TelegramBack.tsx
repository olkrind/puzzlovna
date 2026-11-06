import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { telegramBackButton } from '../telegram.ts'

// Кнопка «Назад» в шапке Telegram: на первом экране вместо неё — «Закрыть».
export function TelegramBack() {
  const navigate = useNavigate()
  const canGoBack = useLocation().key !== 'default'

  useEffect(() => {
    const button = telegramBackButton()
    if (!button || !canGoBack) return
    const back = () => navigate(-1)
    button.show()
    button.onClick(back)
    return () => {
      button.offClick(back)
      button.hide()
    }
  }, [canGoBack, navigate])

  return null
}
