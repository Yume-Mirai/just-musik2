import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isAdmin } from '../utils/helpers'
import SongForm from '../components/songs/SongForm'
import '../styles/Upload.css'

const Upload = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser && !isAdmin(currentUser)) {
      // Redirect non-admin users after a short delay
      setTimeout(() => {
        navigate('/')
      }, 3000)
    }
  }, [currentUser, navigate])

  if (!currentUser) {
    return <div className="loading">Loading...</div>
  }

  if (!isAdmin(currentUser)) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h1>Access Denied</h1>
          <p>You don't have permission to upload songs.</p>
          <p>Only administrators can upload music to the platform.</p>
          <p>You will be redirected to the home page shortly...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="upload-page">
      <div className="upload-header">
        <h1>Upload Music</h1>
        <p>Share your favorite songs with the community</p>
      </div>

      <SongForm />
    </div>
  )
}

export default Upload