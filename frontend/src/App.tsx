import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './features/home/components/HomePage'
import { LoginPage } from './features/auth/components/LoginPage'
import { RegisterPage } from './features/auth/components/RegisterPage'
import { Deck } from './features/cards/components/Deck'
import { NotFoundPage } from './features/notfound/components/NotFoundPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/deks/:uid" element={<Deck />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App