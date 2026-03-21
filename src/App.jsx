import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './Header'
import ChatBot from './components/ChatBot'
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import CoursesPage from './pages/CoursesPage'
import ShopPage from './pages/ShopPage'
import CareersPage from './pages/CareersPage'
import CareersApplyPage from './pages/CareersApplyPage'

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/apply" element={<CareersApplyPage />} />
      </Routes>
      <ChatBot />
    </div>
  )
}

export default App
