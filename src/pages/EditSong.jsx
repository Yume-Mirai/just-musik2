import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { songsAPI } from '../services/songs'
import SongForm from '../components/songs/SongForm'
import LoadingSpinner from '../components/common/LoadingSpinner'
import '../styles/EditSong.css'

const EditSong = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [song, setSong] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSong()
  }, [id])

  const fetchSong = async () => {
    try {
      const response = await songsAPI.getById(id)
      setSong(response.data)
    } catch (err) {
      setError('Failed to load song data')
      console.error('Error fetching song:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSuccess = () => {
    // Navigate back to library or show success message
    navigate('/library')
  }

  if (loading) {
    return (
      <div className="edit-song-container">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="edit-song-container">
        <div className="error-message">
          {error}
          <button onClick={() => navigate('/library')} className="back-button">
            Back to Library
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-song-container">
      <SongForm song={song} onSuccess={handleUpdateSuccess} />
    </div>
  )
}

export default EditSong