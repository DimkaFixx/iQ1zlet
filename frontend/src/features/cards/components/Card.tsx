import { useCards } from '../hooks/useDeks'
import { useParams } from 'react-router-dom'

export function Cards() {
  const { uid } = useParams<{ uid: string }>()
  const { deck, loading, error } = useCards(uid)
  const firstCard = deck?.cards?.[0]

  return (
    <section className="hello-card" aria-live="polite">
      <h1>React + FastAPI</h1>
      <p className="hello-card__label">Ответ от сервера</p>
      <p className="hello-card__value">
        {loading ? 'Загрузка...' : error ?? deck?.name}
      </p>
      <p className="hello-card__value">
        {loading ? 'Загрузка...' : error ?? (firstCard ? `${firstCard.firstSide} - ${firstCard.secondSide}` : 'Колода пуста')}
      </p>
    </section>
  )
}
