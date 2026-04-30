import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export function NotFoundPage() {
  return (
    <section className="not-found-page" aria-live="polite">
      <div className="not-found-page__content">
        <h1 className="not-found-page__code">404</h1>
        <p className="not-found-page__message">Страница не найдена</p>
        <p className="not-found-page__description">
          К сожалению, мы не можем найти нужную вам страницу.
        </p>
        <Link to="/" className="not-found-page__link">
          Вернуться на главную
        </Link>
      </div>
    </section>
  )
}
