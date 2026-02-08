import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiLogOut, FiUser, FiBookmark, FiClock } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';
import './Navigation.css';

function Navigation() {
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          🎬 DRACinema
        </Link>

        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Cari series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FiSearch />
            </button>
          </form>
        </div>

        <div className={`nav-menu ${showMenu ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setShowMenu(false)}>
            Home
          </Link>
          
          {user ? (
            <>
              <Link to="/bookmarks" className="nav-link" onClick={() => setShowMenu(false)}>
                <FiBookmark /> Bookmark
              </Link>
              <Link to="/history" className="nav-link" onClick={() => setShowMenu(false)}>
                <FiClock /> History
              </Link>
              <div className="nav-user">
                <img 
                  src={user.profilePicture} 
                  alt={user.username}
                  className="user-avatar"
                />
                <span>{user.username}</span>
                <div className="dropdown-menu">
                  <Link to={`/profile/${user.id}`} onClick={() => setShowMenu(false)}>
                    <FiUser /> Profile
                  </Link>
                  <button onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link btn-primary" onClick={() => setShowMenu(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-link btn-secondary" onClick={() => setShowMenu(false)}>
                Register
              </Link>
            </>
          )}
        </div>

        <button 
          className="menu-toggle"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
