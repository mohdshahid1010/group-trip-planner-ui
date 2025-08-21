import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import SearchResultsPage from './pages/SearchResultsPage'
import CreatePage from './pages/CreatePage'
import ProfilePage from './pages/ProfilePage'
import TripDetailsPage from './pages/TripDetailsPage'
import InboxPage from './pages/InboxPage'
import BookingPage from './pages/BookingPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/search-results" element={<SearchResultsPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/trip/:id" element={<TripDetailsPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
          </Routes>
        </main>
        <PWAInstallPrompt />
      </div>
    </Router>
  )
}

export default App