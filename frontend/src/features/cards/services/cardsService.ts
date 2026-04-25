import { apiRequest } from '../../../services/api'

export interface Card {
  firstSide: string
  secondSide: string
}

export interface Deck {
  name: string
  ownerNickname: string
  cards: Card[]
}

interface CardApi {
  first_side: string
  second_side: string
}

interface DeckApi {
  name: string
  owner_nickname: string
  deck: CardApi[]
}

export async function getDeck(uid: string): Promise<Deck> {
  const data = await apiRequest<DeckApi>(`/cards/${encodeURIComponent(uid)}/`)

  return {
    name: data.name,
    ownerNickname: data.owner_nickname,
    cards: data.deck.map((card) => ({
      firstSide: card.first_side,
      secondSide: card.second_side,
    })),
  }
}