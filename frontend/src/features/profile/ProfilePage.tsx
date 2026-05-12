import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../../services/api'
import './ProfilePage.css'

type DeckItem = {
  id: number
  name: string
  uid: string
  owner_nickname?: string
}

function decodeJwtPayload(token: string | null) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded
  } catch {
    return null
  }
}

export function ProfilePage() {
  const { nickname } = useParams<{ nickname: string }>()
  const navigate = useNavigate()
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const payload = decodeJwtPayload(token)
  const myNickname = payload?.nickname ?? null

  const [available, setAvailable] = useState<DeckItem[]>([])
  const [mine, setMine] = useState<DeckItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'mine' | 'available'>('mine')

  useEffect(() => {
    if (!myNickname) {
      // Not logged in — redirect to login
      navigate('/login')
      return
    }

    if (nickname && myNickname !== nickname) {
      // redirect to own profile
      navigate(`/profile/${myNickname}`)
      return
    }

    async function load() {
      setLoading(true)
      try {
        const [allRes, myRes] = await Promise.all([
          apiRequest<DeckItem[]>('/decks'),
          apiRequest<DeckItem[]>('/decks/me'),
        ])
        setAvailable(allRes)
        setMine(myRes)
      } catch (e) {
        // apiRequest will redirect to /login on failure
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [nickname, myNickname, navigate])

  const handleCreate = async () => {
    const name = prompt('Название новой колоды')
    if (!name) return
    try {
      const created = await apiRequest<DeckItem>('/decks', { method: 'POST', body: { name } })
      // navigate to the deck page or refresh
      navigate(`/deks/${created.uid}`)
    } catch (e) {
      // handled by apiRequest
    }
  }

  if (!myNickname) return null

  return (
    <main className="profile-page">
      <header className="profile-top">
        <div className="profile-meta">
          <div className="avatar">{myNickname.slice(0, 1).toUpperCase()}</div>
          <div className="meta-text">
            <h1 className="nickname">{myNickname}</h1>
            <div className="stats">
              <span>{mine.length} мои</span>
              <span>{available.length} доступно</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={handleCreate} className="btn-create">Создать колоду</button>
        </div>
      </header>

      <nav className="profile-tabs">
        <button className={"tab-btn " + (tab === 'mine' ? 'active' : '')} onClick={() => setTab('mine')}>Мои колоды</button>
        <button className={"tab-btn " + (tab === 'available' ? 'active' : '')} onClick={() => setTab('available')}>Доступные</button>
      </nav>

      <section className="decks-grid">
        {loading ? <p className="loading">Загрузка...</p> : (
          (tab === 'mine' ? mine : available).map(d => (
            <article key={d.uid} className="deck-card">
              <h3 className="deck-title"><Link to={`/deks/${d.uid}`}>{d.name}</Link></h3>
              {tab === 'available' && <p className="deck-owner">by {d.owner_nickname}</p>}
              <div className="deck-actions">
                <Link to={`/deks/${d.uid}`} className="btn-small">Открыть</Link>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  )
}
