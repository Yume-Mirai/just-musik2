import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Library from './pages/Library'
import Upload from './pages/Upload'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import EditSong from './pages/EditSong'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ProtectedRoute from './components/common/ProtectedRoute'
import './styles/App.css'

function App() {
  const { currentUser } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="app">
      {currentUser && <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
      <div className="app-body">
        {currentUser && <Sidebar isOpen={sidebarOpen} />}
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/library" element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/edit-song/:id" element={
              <ProtectedRoute>
                <EditSong />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
      {currentUser && <Footer />}
    </div>
  )
}

export default App