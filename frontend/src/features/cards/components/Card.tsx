import { useState } from 'react'
import type { Card as CardModel } from '../services/cardsService'

interface CardProps {
  card: CardModel
}

export function Card({ card }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped((currentValue) => !currentValue)
  }

  return (
    <button
      type="button"
      className={`flip-card${isFlipped ? ' flip-card--flipped' : ''}`}
      onClick={handleFlip}
      aria-pressed={isFlipped}
    >
      <span className="flip-card__inner">
        <span className="flip-card__face flip-card__face--front">
          <span className="flip-card__value">{card.firstSide}</span>
        </span>

        <span className="flip-card__face flip-card__face--back">
          <span className="flip-card__value">{card.secondSide}</span>
        </span>
      </span>
    </button>
  )
}
