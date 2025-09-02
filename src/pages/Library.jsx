import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { songsAPI } from '../services/songs'
import { useAuth } from '../context/AuthContext'
import { isAdmin } from '../utils/helpers'
import SongList from '../components/songs/SongList'
import SearchBar from '../components/common/SearchBar'
import Player from '../components/songs/Player'
import '../styles/Library.css'

const Library = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [songs, setSongs] = useState([])
  const [filteredSongs, setFilteredSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = async () => {
    try {
      const response = await songsAPI.getAll()
      setSongs(response.data)
      setFilteredSongs(response.data)
    } catch (error) {
      console.error('Error fetching songs:', error)
      setError('Failed to load songs')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    if (!query) {
      setFilteredSongs(songs)
      return
    }

    const filtered = songs.filter(song =>
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase()) ||
      song.genre?.toLowerCase().includes(query.toLowerCase()) ||
      song.album?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredSongs(filtered)
  }

  const handlePlay = (song) => {
    if (currentSong && currentSong.id === song.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  const handleDelete = async (songId) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      try {
        await songsAPI.delete(songId)
        const updatedSongs = songs.filter(song => song.id !== songId)
        setSongs(updatedSongs)
        setFilteredSongs(updatedSongs)

        if (currentSong && currentSong.id === songId) {
          setCurrentSong(null)
          setIsPlaying(false)
        }
      } catch (error) {
        console.error('Error deleting song:', error)
        alert('Failed to delete song')
      }
    }
  }

  const handleEdit = (song) => {
    navigate(`/edit-song/${song.id}`)
  }

  if (loading) {
    return <div className="loading">Loading your music library...</div>
  }

  return (
    <div className="library">
      <div className="library-header">
        <h1>Your Music Library</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="songs-section">
        <div className="section-header">
          <h2>All Songs ({filteredSongs.length})</h2>
        </div>

        <SongList
          songs={filteredSongs}
          onPlay={handlePlay}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onDelete={handleDelete}
          showDelete={isAdmin(currentUser)}
          onEdit={handleEdit}
        />
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

export default Library