import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiPlay, FiBookmark, FiShare2, FiChevronUp } from 'react-icons/fi';
import { FiBookmark as FiBookmarkFilled } from 'react-icons/fi';
import { toast } from 'react-toastify';
import QRCode from 'qrcode.react';
import api from '../utils/api';
import './Series.css';

function Series() {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    loadSeriesData();
  }, [id]);

  const loadSeriesData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/series/${id}`);
      setSeries(response.data.data);

      // Check if bookmarked
      const bookmarkRes = await api.get(`/bookmarks/check/${id}`);
      setIsBookmarked(bookmarkRes.data.isBookmarked);
    } catch (error) {
      toast.error('Error loading series');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${id}`);
        setIsBookmarked(false);
        toast.success('Bookmark dihapus');
      } else {
        await api.post('/bookmarks', { seriesId: id });
        setIsBookmarked(true);
        toast.success('Ditambahkan ke bookmark');
      }
    } catch (error) {
      toast.error('Error toggling bookmark');
    }
  };

  if (isLoading) {
    return (
      <div className="series-page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="series-page">
        <div className="container mt-8">
          <p className="error-message">Series tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const seasons = [...new Set(series.episodes.map(e => e.season))].sort((a, b) => a - b);
  const currentSeasonEpisodes = series.episodes
    .filter(e => e.season === selectedSeason)
    .sort((a, b) => a.episode - b.episode);

  const shareUrl = `${window.location.origin}/series/${series._id}`;

  return (
    <div className="series-page">
      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: `url(${series.bannerUrl})` }}>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <img src={series.posterUrl} alt={series.title} className="hero-poster" />
            <div className="hero-info">
              <h1 className="hero-title">{series.title}</h1>
              <div className="hero-meta">
                <span className="meta-badge">⭐ {series.rating}/10</span>
                <span className="meta-badge">📅 {series.year}</span>
                <span className={`meta-badge status ${series.status?.toLowerCase()}`}>
                  {series.status}
                </span>
              </div>
              <p className="hero-description">{series.description}</p>
              <div className="hero-actions">
                {series.episodes.length > 0 && (
                  <a href={`/watch/${series.episodes[0]._id}`} className="btn btn-primary">
                    <FiPlay /> Tonton Sekarang
                  </a>
                )}
                <button className="btn btn-secondary" onClick={handleBookmarkToggle}>
                  {isBookmarked ? <FiBookmarkFilled /> : <FiBookmark />}
                  {isBookmarked ? 'Dihapus dari Bookmark' : 'Tambah ke Bookmark'}
                </button>
                <button className="btn btn-secondary" onClick={() => setShowShare(!showShare)}>
                  <FiShare2 /> Bagikan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container series-content">
        {/* Share Section */}
        {showShare && (
          <div className="share-section mb-8">
            <div className="qr-code">
              <QRCode value={shareUrl} size={150} />
            </div>
            <div className="share-links">
              <h3>Bagikan Series</h3>
              <a href={`https://facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                📘 Facebook
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=Tonton ${series.title} di DRACinema!`} target="_blank" rel="noopener noreferrer">
                𝕏 Twitter
              </a>
              <a href={`https://wa.me/?text=Tonton ${series.title} di ${shareUrl}`} target="_blank" rel="noopener noreferrer">
                💬 WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* About Section */}
        <div className="about-section mb-8">
          <h2>Tentang Series Ini</h2>
          <div className="about-grid">
            <div className="about-item">
              <h4>Deskripsi</h4>
              <p>{series.description}</p>
            </div>
            <div className="about-item">
              <h4>Informasi</h4>
              <ul>
                <li><strong>Genre:</strong> {series.genre.join(', ')}</li>
                <li><strong>Total Season:</strong> {series.totalSeasons}</li>
                <li><strong>Total Episode:</strong> {series.episodes.length}</li>
                <li><strong>Negara:</strong> {series.country}</li>
                {series.director.length > 0 && (
                  <li><strong>Sutradara:</strong> {series.director.join(', ')}</li>
                )}
              </ul>
            </div>
            {series.cast.length > 0 && (
              <div className="about-item">
                <h4>Pemain Utama</h4>
                <p>{series.cast.join(', ')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Seasons & Episodes */}
        <div className="episodes-section">
          <h2>Episodes</h2>

          {seasons.length > 1 && (
            <div className="seasons-selector mb-4">
              <div className="season-buttons">
                {seasons.map(season => (
                  <button
                    key={season}
                    className={`season-btn ${selectedSeason === season ? 'active' : ''}`}
                    onClick={() => setSelectedSeason(season)}
                  >
                    Season {season}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="episodes-list">
            {currentSeasonEpisodes.length > 0 ? (
              currentSeasonEpisodes.map(episode => (
                <div key={episode._id} className="episode-card">
                  <div className="episode-thumbnail">
                    <img src={episode.thumbnailUrl} alt={episode.title} />
                    <a href={`/watch/${episode._id}`} className="play-overlay">
                      <FiPlay />
                    </a>
                  </div>
                  <div className="episode-info">
                    <div className="episode-number">
                      E{episode.episode}: {episode.title}
                    </div>
                    <p className="episode-desc">{episode.description || 'Deskripsi tidak tersedia'}</p>
                    <div className="episode-meta">
                      <span>{Math.floor(episode.duration / 60)} menit</span>
                      <span>{episode.quality}</span>
                      <span>👁️ {episode.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <a href={`/watch/${episode._id}`} className="watch-btn">
                    <FiPlay /> Tonton
                  </a>
                </div>
              ))
            ) : (
              <p className="text-center">Episode tidak tersedia</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Series;
