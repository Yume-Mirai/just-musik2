import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { songsAPI } from '../services/songs'
import SongList from '../components/songs/SongList'
import SearchBar from '../components/common/SearchBar'
import Player from '../components/songs/Player'
import '../styles/Home.css'

const Home = () => {
  const navigate = useNavigate()
  const [songs, setSongs] = useState([])
  const [filteredSongs, setFilteredSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)

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
      song.genre.toLowerCase().includes(query.toLowerCase())
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

  const handleEdit = (song) => {
    navigate(`/edit-song/${song.id}`)
  }

  if (loading) {
    return <div className="loading">Loading songs...</div>
  }

  return (
    <div className="home">
      <div className="home-header">
        <h1>Welcome to JustSpotify</h1>
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="songs-section">
        <h2>All Songs</h2>
        <SongList
          songs={filteredSongs}
          onPlay={handlePlay}
          currentSong={currentSong}
          isPlaying={isPlaying}
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

export default Home