import { useAuth } from '../context/AuthContext'
import { isAdmin, getUserRoleDisplay } from '../utils/helpers'
import { Link } from 'react-router-dom'
import '../styles/Profile.css'

const Profile = () => {
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  if (!currentUser) {
    return <div className="loading">Loading profile...</div>
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="profile-info">
            <div className="info-group">
              <label>Username:</label>
              <span>{currentUser.username}</span>
            </div>

            <div className="info-group">
              <label>Email:</label>
              <span>{currentUser.email}</span>
            </div>

            <div className="info-group">
              <label>Role:</label>
              <span className="role-badge">
                {getUserRoleDisplay(currentUser)}
              </span>
            </div>


            <div className="info-group">
              <label>Member since:</label>
              <span>Recently joined</span>
            </div>
          </div>

          <div className="profile-actions">
            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h3>Music Library</h3>
            <p>Access your uploaded songs and favorites</p>
          </div>

          {isAdmin(currentUser) && (
            <div className="stat-card">
              <h3>Upload Songs</h3>
              <p>Share your music with the community</p>
            </div>
          )}

          <div className="stat-card">
            <h3>Favorites</h3>
            <p>Keep track of songs you love</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile