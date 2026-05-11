import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCards } from '../hooks/useDeks'
import { Card } from './Card'
import { NotFoundPage } from '../../notfound/components/NotFoundPage'
import './Deck.css'

type StudyMode = 'cards' | 'memorization'

export function Deck() {
  const { uid } = useParams<{ uid: string }>()
  const { deck, loading, error } = useCards(uid)
  const cards = deck?.cards ?? []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [studyMode, setStudyMode] = useState<StudyMode>('cards')
  const [animClass, setAnimClass] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationTimeouts = useRef<ReturnType<typeof setTimeout>[]>([])
  const animMs = 160

  const clearAnimationTimeouts = () => {
    animationTimeouts.current.forEach((timeoutId) => clearTimeout(timeoutId))
    animationTimeouts.current = []
  }

  useEffect(() => {
    return () => {
      clearAnimationTimeouts()
    }
  }, [])

  // Show 404 if deck not found or error occurred
  if (!loading && (error || !deck || cards.length === 0)) {
    return <NotFoundPage />
  }

  const animateToIndex = (nextIndex: number, exitClass: string, enterClass: string) => {
    if (isAnimating || nextIndex === currentIndex) return

    clearAnimationTimeouts()
    setIsAnimating(true)
    setAnimClass(exitClass)

    const firstTimeoutId = setTimeout(() => {
      setCurrentIndex(nextIndex)
      setAnimClass(enterClass)

      const secondTimeoutId = setTimeout(() => {
        setAnimClass(null)
        setIsAnimating(false)
      }, animMs)

      animationTimeouts.current.push(secondTimeoutId)
    }, animMs)

    animationTimeouts.current.push(firstTimeoutId)
  }

  const handlePrev = () => {
    if (currentIndex === 0) return
    animateToIndex(currentIndex - 1, 'swipe-exit-right', 'swipe-enter-left')
  }

  const handleNext = () => {
    if (currentIndex >= cards.length - 1) return
    animateToIndex(currentIndex + 1, 'swipe-exit-left', 'swipe-enter-right')
  }

  const handleStudyAnswer = () => {
    handleNext()
  }

  const currentCard = cards[currentIndex]
  const isStudyMode = studyMode === 'memorization'
  const hasNextCard = currentIndex < cards.length - 1

  return (
    <section className="cards-page" aria-live="polite">
      <div className="cards-page__mode-switcher" role="tablist" aria-label="Режим обучения">
        <button
          type="button"
          className={`cards-page__mode-btn${studyMode === 'cards' ? ' cards-page__mode-btn--active' : ''}`}
          onClick={() => setStudyMode('cards')}
          aria-pressed={studyMode === 'cards'}
        >
          Карточки
        </button>

        <button
          type="button"
          className={`cards-page__mode-btn${studyMode === 'memorization' ? ' cards-page__mode-btn--active' : ''}`}
          onClick={() => setStudyMode('memorization')}
          aria-pressed={studyMode === 'memorization'}
        >
          Заучивание карточек
        </button>
      </div>

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
      ) : currentCard ? (
        <>
          <div className={`cards-page__card-area ${animClass ?? ''}`}>
            <Card key={currentIndex} card={currentCard} />
          </div>

          <div className="cards-page__nav">
            {isStudyMode ? (
              <button
                type="button"
                className="cards-page__answer-btn cards-page__answer-btn--wrong"
                onClick={handleStudyAnswer}
                aria-label="Не помню"
                disabled={!hasNextCard || isAnimating}
              >
                ✕
              </button>
            ) : (
              <button
                type="button"
                className="cards-page__nav-btn"
                onClick={handlePrev}
                aria-label="Предыдущая карточка"
                disabled={currentIndex === 0 || isAnimating}
              >
                ‹
              </button>
            )}

            <div className="cards-page__counter" aria-hidden>
              {currentIndex + 1} / {cards.length}
            </div>

            {isStudyMode ? (
              <button
                type="button"
                className="cards-page__answer-btn cards-page__answer-btn--right"
                onClick={handleStudyAnswer}
                aria-label="Помню"
                disabled={!hasNextCard || isAnimating}
              >
                ✓
              </button>
            ) : (
              <button
                type="button"
                className="cards-page__nav-btn"
                onClick={handleNext}
                aria-label="Следующая карточка"
                disabled={currentIndex === cards.length - 1 || isAnimating}
              >
                ›
              </button>
            )}
          </div>
        </>
      ) : null}
    </section>
  )
}
