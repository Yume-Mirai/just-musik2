import { useState } from 'react'
import '../../styles/SearchBar.css'

const SearchBar = ({ onSearch, placeholder = "Search songs..." }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-button"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  )
}

export default SearchBar