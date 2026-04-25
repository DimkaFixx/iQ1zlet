import { useEffect, useState } from 'react'
import { getDeck } from '../services/cardsService'
import type { Deck } from '../services/cardsService'

interface UseCardsState {
  deck: Deck | null
  loading: boolean
  error: string | null
}

const initialState: UseCardsState = {
  deck: null,
  loading: true,
  error: null,
}

export function useCards(uid?: string) {
  const [state, setState] = useState<UseCardsState>(initialState)

  useEffect(() => {
    let isMounted = true

    async function loadDeck() {
      try {
        if (!uid) {
          throw new Error('Missing deck uid')
        }

        const data = await getDeck(uid)

        if (!isMounted) {
          return
        }

        setState({
          deck: data,
          loading: false,
          error: null,
        })
      } catch {
        if (!isMounted) {
          return
        }

        setState({
          deck: null,
          loading: false,
          error: 'Не удалось получить ответ от сервера',
        })
      }
    }

    loadDeck()

    return () => {
      isMounted = false
    }
  }, [uid])

  return state
}
