import { Link, useNavigate } from 'react-router-dom'
import { getCookie } from '../../utils/cookies'
import './AppHeader.css'

function decodeJwtPayload(token: string | null) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export function AppHeader() {
  const navigate = useNavigate()
  const token = typeof window !== 'undefined' ? getCookie('access_token') || localStorage.getItem('access_token') : null
  const payload = decodeJwtPayload(token)
  const nickname = payload?.nickname ?? null

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    navigate('/login')
  }

  return (
    <header className="app-header">
      <Link className="app-header__brand" to="/">
        iQuizlet
      </Link>

      <div className="app-header__actions">
        {nickname ? (
          <>
            <Link className="app-header__action" to={`/profile/${nickname}`}>
              {nickname}
            </Link>
            <button className="app-header__logout" type="button" onClick={handleLogout}>
              Выйти
            </button>
          </>
        ) : (
          <Link className="app-header__action" to="/login">
            Войти
          </Link>
        )}
      </div>
    </header>
  )
}