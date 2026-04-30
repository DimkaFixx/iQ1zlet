import { useParams } from 'react-router-dom'
import { useCards } from '../hooks/useDeks'
import { Card } from './Card'
import { NotFoundPage } from '../../notfound/components/NotFoundPage'
import './Deck.css'

export function Deck() {
  const { uid } = useParams<{ uid: string }>()
  const { deck, loading, error } = useCards(uid)
  const firstCard = deck?.cards?.[0]

  // Show 404 if deck not found or error occurred
  if (!loading && (error || !deck || !firstCard)) {
    return <NotFoundPage />
  }

  return (
    <section className="cards-page" aria-live="polite">
      <div className="cards-page__header">
        <h1>{loading ? 'Загрузка...' : deck?.name ?? 'Колода'}</h1>
        <h3 className="cards-page__owner">{loading ? 'Загрузка...' : `by ${deck?.ownerNickname ?? 'Неизвестный пользователь'}`}</h3>
        <p>Нажми на карточку, чтобы перевернуть её</p>
      </div>

      {loading ? (
        <button type="button" className="flip-card" disabled>
          <span className="flip-card__inner">
            <span className="flip-card__face flip-card__face--front">
              <span className="flip-card__label">firstSide</span>
              <span className="flip-card__value">Загрузка...</span>
            </span>
          </span>
        </button>
      ) : firstCard ? (
        <Card card={firstCard} />
      ) : null}
    </section>
  )
}
