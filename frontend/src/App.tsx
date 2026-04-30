import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelloCard } from './features/hello/components/HelloCard'
import { Deck } from './features/cards/components/Deck'
import { NotFoundPage } from './features/notfound/components/NotFoundPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HelloCard />} />
        <Route path="/deks/:uid" element={<Deck />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App