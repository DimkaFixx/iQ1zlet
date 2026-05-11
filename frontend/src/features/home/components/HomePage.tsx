import { Link } from 'react-router-dom'
import './HomePage.css'

export function HomePage() {
  return (
    <main className="home-page">
      <Link className="home-page__login" to="/login">
        Вход
      </Link>

      <h1 className="home-page__title">iQ1zlet</h1>
    </main>
  )
}