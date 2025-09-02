import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isAdmin } from '../../utils/helpers'
import '../../styles/Sidebar.css'

const Sidebar = ({ isOpen }) => {
  const location = useLocation()
  const { currentUser } = useAuth()

  const menuItems = [
    {
      path: '/',
      label: 'Home',
      icon: '🏠'
    },
    {
      path: '/library',
      label: 'My Library',
      icon: '📚'
    },
    ...(isAdmin(currentUser) ? [{
      path: '/upload',
      label: 'Upload Music',
      icon: '⬆️'
    }] : []),
    {
      path: '/favorites',
      label: 'Favorites',
      icon: '❤️'
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: '👤'
    }
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>JustSpotify</p>
          <small>© 2024 Music Platform</small>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar