import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, register } from '../services/authService'
import './AuthPage.css'

type AuthMode = 'login' | 'register'

interface AuthPageProps {
  mode: AuthMode
}

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate()
  const isLogin = mode === 'login'
  const [identifier, setIdentifier] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isLogin) {
        const response = await login({ identifier, password })
        setMessage(response.message)
        // Save tokens to localStorage as backup for cookies
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token)
        }
        if ((response as any).refresh_token) {
          localStorage.setItem('refresh_token', (response as any).refresh_token)
        }
        navigate('/')
        return
      }

      const response = await register({ nickname, email: email || undefined, password })
      setMessage(response.message)
      // Save tokens to localStorage as backup for cookies
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token)
      }
      if ((response as any).refresh_token) {
        localStorage.setItem('refresh_token', (response as any).refresh_token)
      }
      navigate('/login')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Что-то пошло не так')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__header">
          <p className="auth-card__eyebrow">iQ1zlet</p>
          <h1>{isLogin ? 'Вход' : 'Регистрация'}</h1>
          <p>{isLogin ? 'Войди в свой аккаунт' : 'Создай новый аккаунт'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isLogin ? (
            <label className="auth-field">
              <span>Никнейм или email</span>
              <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" />
            </label>
          ) : (
            <label className="auth-field">
              <span>Никнейм</span>
              <input value={nickname} onChange={(event) => setNickname(event.target.value)} autoComplete="nickname" />
            </label>
          )}

          {!isLogin ? (
            <label className="auth-field">
              <span>Email</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            </label>
          ) : null}

          <label className="auth-field">
            <span>Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </label>

          {error ? <p className="auth-form__error">{error}</p> : null}
          {message ? <p className="auth-form__message">{message}</p> : null}

          <button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? 'Подождите...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-card__footer">
          {isLogin ? (
            <p>
              Нет аккаунта? <Link to="/register">Регистрация</Link>
            </p>
          ) : (
            <p>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          )}
        </div>
      </section>
    </main>
  )
}