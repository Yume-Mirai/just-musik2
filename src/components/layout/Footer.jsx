import '../../styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>JustMusik</h3>
          <p>Your personal music streaming platform</p>
        </div>

        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li>Upload Music</li>
            <li>Create Playlists</li>
            <li>Share with Friends</li>
            <li>High Quality Audio</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <span>📧</span>
            <span>📱</span>
            <span>🌐</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 JustMusik. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer