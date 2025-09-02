import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isAdmin } from "../../utils/helpers";
import "../../styles/Navbar.css";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <nav className="navbar">
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
      >
        {sidebarOpen ? "◁" : "▷"}
      </button>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <span className="logo-text">JustSpotify</span>
          </Link>
        </div>

        <div className="navbar-center">
          <div className="navbar-menu">
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <Link to="/library" className="navbar-link">
              Library
            </Link>
            {isAdmin(currentUser) && (
              <Link to="/upload" className="navbar-link">
                Upload
              </Link>
            )}
            <Link to="/favorites" className="navbar-link">
              Favorites
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          <Link to="/profile" className="user-info">
            <div className="user-avatar">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{currentUser?.username}</span>
          </Link>

          <button className="logout-btn" onClick={handleLogout} title="Logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
