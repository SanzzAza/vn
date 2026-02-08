import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark, FiPlay, FiStar } from 'react-icons/fi';
import { FiBookmark as FiBookmarkFilled } from 'react-icons/fi';
import './SeriesCard.css';

function SeriesCard({ series, onBookmarkToggle }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    if (onBookmarkToggle) {
      onBookmarkToggle(series._id, !isBookmarked);
    }
  };

  return (
    <Link to={`/series/${series._id}`} className="series-card">
      <div className="card-image">
        <img src={series.posterUrl} alt={series.title} />
        <div className="card-overlay">
          <button className="play-btn">
            <FiPlay /> Tonton
          </button>
        </div>
        <button 
          className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmarkClick}
          title={isBookmarked ? 'Hapus dari bookmark' : 'Tambah ke bookmark'}
        >
          {isBookmarked ? <FiBookmarkFilled /> : <FiBookmark />}
        </button>
      </div>
      <div className="card-content">
        <h3 className="card-title">{series.title}</h3>
        <div className="card-meta">
          <span className="year">{series.year}</span>
          <span className="rating">
            <FiStar /> {series.rating || 0}
          </span>
        </div>
        <div className="card-genres">
          {series.genre?.slice(0, 2).map((g, i) => (
            <span key={i} className="genre-tag">{g}</span>
          ))}
        </div>
        <span className={`status ${series.status?.toLowerCase()}`}>
          {series.status}
        </span>
      </div>
    </Link>
  );
}

export default SeriesCard;
