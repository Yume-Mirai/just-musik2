import { useState } from 'react'
import { songsAPI } from '../../services/songs'
import { useNavigate } from 'react-router-dom'
import '../../styles/SongForm.css'

const SongForm = ({ song, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: song?.title || '',
    artist: song?.artist || '',
    album: song?.album || '',
    genre: song?.genre || '',
    duration: song?.duration || '',
    imageUrl: song?.imageUrl || '',
    audioFile: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const isEditing = !!song

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac']
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid audio file (MP3, WAV, OGG, FLAC)')
        return
      }

      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB')
        return
      }

      setFormData(prev => ({
        ...prev,
        audioFile: file
      }))
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.artist) {
      setError('Please fill in all required fields')
      return
    }

    if (!isEditing && !formData.audioFile) {
      setError('Please select an audio file')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('artist', formData.artist)
      if (formData.album) submitData.append('album', formData.album)
      if (formData.genre) submitData.append('genre', formData.genre)
      if (formData.duration) submitData.append('duration', parseInt(formData.duration))
      if (formData.imageUrl) submitData.append('imageUrl', formData.imageUrl)
      submitData.append('audioFile', formData.audioFile)

      if (isEditing) {
        await songsAPI.update(song.id, submitData)
        setSuccess('Song updated successfully!')
        if (onSuccess) onSuccess()
      } else {
        await songsAPI.create(submitData)
        setSuccess('Song uploaded successfully!')
        setFormData({
          title: '',
          artist: '',
          album: '',
          genre: '',
          duration: '',
          imageUrl: '',
          audioFile: null
        })

        // Reset file input
        const fileInput = document.getElementById('audioFile')
        if (fileInput) fileInput.value = ''

        // Redirect to library after a short delay
        setTimeout(() => {
          navigate('/library')
        }, 2000)
      }

    } catch (error) {
      console.error('Error uploading song:', error)
      setError(error.response?.data?.message || 'Failed to upload song')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="song-form-container">
      <div className="song-form">
        <h2>{isEditing ? 'Edit Song' : 'Upload New Song'}</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter song title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="artist">Artist *</label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                required
                placeholder="Enter artist name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="album">Album</label>
              <input
                type="text"
                id="album"
                name="album"
                value={formData.album}
                onChange={handleChange}
                placeholder="Enter album name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Enter genre"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (seconds)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter duration in seconds"
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Cover Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Enter image URL (optional)"
            />
            <small className="file-info">
              Provide a URL to an album cover image
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="audioFile">Audio File {isEditing ? '(Optional)' : '*'}</label>
            <input
              type="file"
              id="audioFile"
              accept="audio/*"
              onChange={handleFileChange}
              required={!isEditing}
            />
            <small className="file-info">
              {isEditing
                ? 'Leave empty to keep current audio file. Supported formats: MP3, WAV, OGG, FLAC (Max: 100MB)'
                : 'Supported formats: MP3, WAV, OGG, FLAC (Max: 100MB)'
              }
            </small>
            {formData.audioFile && (
              <div className="file-selected">
                Selected: {formData.audioFile.name} ({(formData.audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (isEditing ? 'Updating...' : 'Uploading...') : (isEditing ? 'Update Song' : 'Upload Song')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SongForm