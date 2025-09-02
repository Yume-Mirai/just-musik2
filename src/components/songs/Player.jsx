import { useState, useEffect, useRef } from 'react'
import { songsAPI } from '../../services/songs'
import '../../styles/Player.css'

const Player = ({ song, isPlaying, onPlayPause }) => {
  const [audioUrl, setAudioUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef(null)

  useEffect(() => {
    if (song) {
      fetchAudioUrl()
    }
  }, [song])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const fetchAudioUrl = async () => {
    if (!song) return

    setLoading(true)
    try {
      const response = await songsAPI.getStreamUrl(song.id)
      setAudioUrl(response.data)
    } catch (error) {
      console.error('Error fetching audio URL:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    const newTime = e.target.value
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const formatTime = (time) => {
    if (!time) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    onPlayPause()
  }

  if (!song) return null

  return (
    <div className="player">
      <div className="player-info">
        <div className="song-details">
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
        </div>
      </div>

      <div className="player-controls">
        <button
          className="play-pause-btn"
          onClick={handlePlayPause}
          disabled={loading}
        >
          {loading ? '⏳' : (isPlaying ? '⏸️' : '▶️')}
        </button>

        <div className="progress-container">
          <span className="time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
          />
          <span className="time">{formatTime(duration)}</span>
        </div>

        <div className="volume-container">
          <span className="volume-icon">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={() => onPlayPause()}
        />
      )}
    </div>
  )
}

export default Player