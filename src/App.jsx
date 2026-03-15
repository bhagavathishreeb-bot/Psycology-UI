import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './Header'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import ShopPage from './pages/ShopPage'

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/shop" element={<ShopPage />} />
      </Routes>
    </div>
  )
}

export default App
