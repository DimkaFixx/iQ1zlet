import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelloCard } from './features/hello/components/HelloCard'
import { Cards } from './features/cards/components/Card'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HelloCard />} />
        <Route path="/deks/:uid" element={<Cards />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App