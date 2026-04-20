import { useHello } from '../hooks/useHello'

export function HelloCard() {
  const { text, loading, error } = useHello()

  return (
    <section className="hello-card" aria-live="polite">
      <h1>React + FastAPI</h1>
      <p className="hello-card__label">Ответ от сервера</p>
      <p className="hello-card__value">
        {loading ? 'Загрузка...' : error ?? text}
      </p>
    </section>
  )
}
