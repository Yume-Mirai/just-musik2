import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { songsAPI } from '../services/songs'
import { useAuth } from '../context/AuthContext'
import { isAdmin } from '../utils/helpers'
import SongList from '../components/songs/SongList'
import SearchBar from '../components/common/SearchBar'
import Player from '../components/songs/Player'
import Pagination from '../components/common/Pagination'
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
  const [sortBy, setSortBy] = useState('title')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [paginatedSongs, setPaginatedSongs] = useState([])

  useEffect(() => {
    fetchSongs()
  }, [])

  useEffect(() => {
    sortSongs()
  }, [songs, sortBy, selectedGenre, currentPage])

  const fetchSongs = async () => {
    try {
      const response = await songsAPI.getAll()
      setSongs(response.data)
      setFilteredSongs(response.data)
      const uniqueGenres = [...new Set(response.data.map(song => song.genre).filter(Boolean))]
      setGenres(uniqueGenres)
    } catch (error) {
      console.error('Error fetching songs:', error)
      setError('Failed to load songs')
    } finally {
      setLoading(false)
    }
  }

  const sortSongs = () => {
    let filtered = filteredSongs.length > 0 ? filteredSongs : songs
    if (selectedGenre) {
      filtered = (filteredSongs.length > 0 ? filteredSongs : songs).filter(song => song.genre === selectedGenre)
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      } else if (sortBy === 'artist') {
        return a.artist.localeCompare(b.artist)
      } else if (sortBy === 'genre') {
        return (a.genre || '').localeCompare(b.genre || '')
      }
      return 0
    })
    setFilteredSongs(sorted)

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginated = sorted.slice(startIndex, endIndex)
    setPaginatedSongs(paginated)
  }

  const handleSearch = (query) => {
    let filtered = songs
    if (query) {
      filtered = songs.filter(song =>
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        song.genre?.toLowerCase().includes(query.toLowerCase()) ||
        song.album?.toLowerCase().includes(query.toLowerCase())
      )
    }

    if (selectedGenre) {
      filtered = filtered.filter(song => song.genre === selectedGenre)
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      } else if (sortBy === 'artist') {
        return a.artist.localeCompare(b.artist)
      } else if (sortBy === 'genre') {
        return (a.genre || '').localeCompare(b.genre || '')
      }
      return 0
    })
    setFilteredSongs(sorted)
    setCurrentPage(1) // Reset to first page when searching

    // Update pagination for the filtered results
    const startIndex = 0 // Since we reset to page 1
    const endIndex = startIndex + itemsPerPage
    const paginated = sorted.slice(startIndex, endIndex)
    setPaginatedSongs(paginated)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
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
        <div className="controls">
          <SearchBar onSearch={handleSearch} />
          <select value={selectedGenre} onChange={(e) => { setSelectedGenre(e.target.value); setCurrentPage(1); }} className="filter-select">
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }} className="sort-select">
            <option value="title">Sort by Title</option>
            <option value="artist">Sort by Artist</option>
            <option value="genre">Sort by Genre</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="songs-section">
        <div className="section-header">
          <h2>All Songs ({filteredSongs.length})</h2>
        </div>

        <SongList
          songs={paginatedSongs}
          onPlay={handlePlay}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onDelete={handleDelete}
          showDelete={isAdmin(currentUser)}
          onEdit={handleEdit}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredSongs.length / itemsPerPage)}
          onPageChange={handlePageChange}
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