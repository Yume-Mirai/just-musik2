import { useState, useEffect } from 'react'
import { favoritesAPI } from '../services/favorites'
import SongList from '../components/songs/SongList'
import Player from '../components/songs/Player'
import '../styles/Favorites.css'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const response = await favoritesAPI.getAll()
      setFavorites(response.data)
    } catch (error) {
      console.error('Error fetching favorites:', error)
      setError('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (song) => {
    if (currentSong && currentSong.id === song.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  const handleRemoveFavorite = async (songId) => {
    try {
      await favoritesAPI.remove(songId)
      setFavorites(favorites.filter(song => song.id !== songId))

      if (currentSong && currentSong.id === songId) {
        setCurrentSong(null)
        setIsPlaying(false)
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
      alert('Failed to remove from favorites')
    }
  }

  if (loading) {
    return <div className="loading">Loading your favorites...</div>
  }

  return (
    <div className="favorites">
      <div className="favorites-header">
        <h1>Your Favorite Songs</h1>
        <p>Listen to the music you love</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="favorites-content">
        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <h2>No favorite songs yet</h2>
            <p>Start exploring and add songs to your favorites!</p>
          </div>
        ) : (
          <>
            <div className="favorites-stats">
              <p>{favorites.length} favorite song{favorites.length !== 1 ? 's' : ''}</p>
            </div>

            <SongList
              songs={favorites}
              onPlay={handlePlay}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onRemoveFavorite={handleRemoveFavorite}
              showRemoveFavorite={true}
            />
          </>
        )}
      </div>

      {currentSong && (
        <Player
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
        />
      )}
    </div>
  )
}

export default Favorites