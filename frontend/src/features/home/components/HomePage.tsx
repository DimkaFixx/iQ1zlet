import { Link } from 'react-router-dom'
import './HomePage.css'

function decodeJwtPayload(token: string) {
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

export function HomePage() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const payload = token ? decodeJwtPayload(token) : null
  const nickname = payload?.nickname ?? null

  return (
    <main className="home-page">
      {nickname ? (
        <Link className="home-page__login" to={`/profile/${nickname}`}>
          {nickname}
        </Link>
      ) : (
        <Link className="home-page__login" to="/login">
          Вход
        </Link>
      )}

      <h1 className="home-page__title">iQ1zlet</h1>
    </main>
  )
}