import SongItem from './SongItem'
import '../../styles/SongList.css'

const SongList = ({ songs, onPlay, currentSong, isPlaying, onDelete, showDelete, onRemoveFavorite, showRemoveFavorite, onEdit }) => {
  if (songs.length === 0) {
    return <div className="no-songs">No songs found</div>
  }

  return (
    <div className="song-list">
      {songs.map(song => (
        <SongItem
          key={song.id}
          song={song}
          onPlay={onPlay}
          isCurrent={currentSong && currentSong.id === song.id}
          isPlaying={isPlaying && currentSong && currentSong.id === song.id}
          onDelete={onDelete}
          showDelete={showDelete}
          onRemoveFavorite={onRemoveFavorite}
          showRemoveFavorite={showRemoveFavorite}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}

export default SongList