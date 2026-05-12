import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppHeader } from './components/layout/AppHeader'
import { HomePage } from './features/home/components/HomePage'
import { LoginPage } from './features/auth/components/LoginPage'
import { RegisterPage } from './features/auth/components/RegisterPage'
import { ProfilePage } from './features/profile/ProfilePage'
import { Deck } from './features/cards/components/Deck'
import { NotFoundPage } from './features/notfound/components/NotFoundPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-shell">
        <AppHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/deks/:uid" element={<Deck />} />
          <Route path="/profile/:nickname" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App