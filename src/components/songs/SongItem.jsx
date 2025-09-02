import { useState } from 'react'
import { favoritesAPI } from '../../services/favorites'
import { songsAPI } from '../../services/songs'
import { useAuth } from '../../context/AuthContext'
import { isAdmin } from '../../utils/helpers'
import '../../styles/SongList.css'

const SongItem = ({ song, onPlay, isCurrent, isPlaying, onDelete, showDelete, onRemoveFavorite, showRemoveFavorite, onEdit }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const { currentUser } = useAuth()
  const userIsAdmin = isAdmin(currentUser)
  const canDownload = !!currentUser

  const handlePlayClick = () => {
    onPlay(song)
  }

  const handleFavoriteToggle = async () => {
    if (!currentUser) return

    setLoading(true)
    try {
      if (isFavorite) {
        await favoritesAPI.remove(song.id)
        setIsFavorite(false)
      } else {
        await favoritesAPI.add(song.id)
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(song.id)
    }
  }

  const handleDownload = async () => {
    if (!canDownload) return

    setDownloading(true)
    try {
      const response = await songsAPI.download(song.id)
      const downloadUrl = response.data.downloadUrl

      // Create a temporary link to trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${song.title} - ${song.artist}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading song:', error)
      alert('Failed to download song. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(song)
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`song-item ${isCurrent ? 'current' : ''}`}>
      <div className="song-image">
        {song.imageUrl ? (
          <img
            src={song.imageUrl}
            alt={`${song.title} cover`}
            className="song-cover"
            onError={(e) => {
              e.target.src = '/default-album-art.png' // Fallback image
            }}
          />
        ) : (
          <div className="song-cover-placeholder">
            <span>🎵</span>
          </div>
        )}
      </div>

      <div className="song-info">
        <div className="song-details">
          <h3 className="song-title">{song.title}</h3>
          <p className="song-artist">{song.artist}</p>
          {song.album && <p className="song-album">{song.album}</p>}
          {song.genre && <span className="song-genre">{song.genre}</span>}
        </div>

        <div className="song-duration">
          {formatDuration(song.duration)}
        </div>
      </div>

      <div className="song-actions">
        <button
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayClick}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        {currentUser && (
          <button
            className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
            onClick={handleFavoriteToggle}
            disabled={loading}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {loading ? '⏳' : (isFavorite ? '❤️' : '🤍')}
          </button>
        )}

        {showDelete && userIsAdmin && (
          <button
            className="edit-button"
            onClick={handleEdit}
            title="Edit song"
          >
            ✏️
          </button>
        )}

        {showDelete && userIsAdmin && (
          <button
            className="delete-button"
            onClick={handleDelete}
            title="Delete song"
          >
            🗑️
          </button>
        )}

        {showRemoveFavorite && (
          <button
            className="remove-favorite-button"
            onClick={() => onRemoveFavorite(song.id)}
            title="Remove from favorites"
          >
            💔
          </button>
        )}

        {canDownload && (
          <button
            className="download-button"
            onClick={handleDownload}
            disabled={downloading}
            title="Download song"
          >
            {downloading ? '⏳' : '⬇️'}
          </button>
        )}
      </div>
    </div>
  )
}

export default SongItem