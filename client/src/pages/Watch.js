import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiShare2 } from 'react-icons/fi';
import QRCode from 'qrcode.react';
import VideoPlayer from '../components/VideoPlayer';
import api from '../utils/api';
import './Watch.css';

function Watch() {
  const { episodeId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    loadEpisodeData();
  }, [episodeId]);

  const loadEpisodeData = async () => {
    try {
      setIsLoading(true);
      // Fetch episode detail
      const episodeRes = await api.get(`/episodes/${episodeId}`);
      const episodeData = episodeRes.data.data;
      setEpisode(episodeData);
      setSeries(episodeData.series);
      setSelectedSeason(episodeData.season);

      // Fetch all episodes of series
      const episodesRes = await api.get(`/episodes/series/${episodeData.series._id}`);
      setEpisodes(episodesRes.data.data);

      // Save to history
      await api.post('/history', {
        seriesId: episodeData.series._id,
        episodeId: episodeId,
        currentTime: 0,
        duration: episodeData.duration,
        completed: false
      });
    } catch (error) {
      setError('Error loading episode');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = async (currentTime) => {
    if (episode && series) {
      try {
        await api.post('/history', {
          seriesId: series._id,
          episodeId: episode._id,
          currentTime,
          duration: episode.duration,
          completed: false
        });
      } catch (error) {
        console.error('Error updating history:', error);
      }
    }
  };

  const handleEpisodeEnded = async () => {
    if (episode && series) {
      try {
        await api.post('/history', {
          seriesId: series._id,
          episodeId: episode._id,
          currentTime: episode.duration,
          duration: episode.duration,
          completed: true
        });

        // Find next episode
        const currentIndex = episodes.findIndex(e => e._id === episode._id);
        if (currentIndex < episodes.length - 1) {
          const nextEpisode = episodes[currentIndex + 1];
          window.location.href = `/watch/${nextEpisode._id}`;
        }
      } catch (error) {
        console.error('Error marking episode as completed:', error);
      }
    }
  };

  const handleSelectEpisode = (episodeId) => {
    window.location.href = `/watch/${episodeId}`;
  };

  const currentSeasonEpisodes = episodes.filter(e => e.season === selectedSeason);
  const seasons = [...new Set(episodes.map(e => e.season))].sort((a, b) => a - b);

  if (isLoading) {
    return (
      <div className="watch-page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="watch-page">
        <div className="container mt-8">
          <p className="error-message">{error || 'Episode tidak ditemukan'}</p>
          <Link to="/" className="btn btn-primary">Kembali ke Home</Link>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/watch/${episode._id}`;

  return (
    <div className="watch-page">
      <div className="container mt-4 mb-8">
        <Link to={`/series/${series._id}`} className="back-link">
          <FiChevronLeft /> Kembali ke {series.title}
        </Link>

        {/* Video Player */}
        <div className="player-section mt-4 mb-8">
          <VideoPlayer
            videoUrl={episode.videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEpisodeEnded}
            episodeData={episode}
          />
        </div>

        <div className="episode-info">
          <div className="episode-header">
            <div>
              <h1 className="episode-title">
                {series.title}
              </h1>
              <p className="episode-subtitle">
                Season {episode.season}, Episode {episode.episode} - {episode.title}
              </p>
            </div>
            <button className="share-btn" onClick={() => setShowShare(!showShare)}>
              <FiShare2 /> Bagikan
            </button>
          </div>

          {showShare && (
            <div className="share-section">
              <div className="qr-code">
                <QRCode value={shareUrl} size={150} />
              </div>
              <div className="share-links">
                <p>Bagikan episode ini:</p>
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

          <p className="episode-description">{episode.description}</p>

          {/* Episode Details */}
          <div className="episode-details">
            <div className="detail-item">
              <span className="label">Durasi:</span>
              <span className="value">{Math.floor(episode.duration / 60)} menit</span>
            </div>
            <div className="detail-item">
              <span className="label">Kualitas:</span>
              <span className="value">{episode.quality}</span>
            </div>
            <div className="detail-item">
              <span className="label">Rilis:</span>
              <span className="value">{new Date(episode.releaseDate).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="detail-item">
              <span className="label">Penonton:</span>
              <span className="value">{episode.views.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Season & Episodes Section */}
        <div className="episodes-section">
          <div className="seasons-selector">
            <h3>Pilih Season:</h3>
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

          <div className="episodes-list">
            <h3>Episode Season {selectedSeason}</h3>
            <div className="episodes-grid">
              {currentSeasonEpisodes.map(ep => (
                <button
                  key={ep._id}
                  className={`episode-item ${ep._id === episode._id ? 'active' : ''}`}
                  onClick={() => handleSelectEpisode(ep._id)}
                >
                  <div className="episode-number">
                    E{ep.episode}
                  </div>
                  <div className="episode-details-grid">
                    <h4>{ep.title}</h4>
                    <p>{Math.floor(ep.duration / 60)} menit</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Series Info */}
        <div className="series-info-section mt-8">
          <h2>Tentang {series.title}</h2>
          <div className="series-info-grid">
            <div className="info-item">
              <h4>Deskripsi</h4>
              <p>{series.description}</p>
            </div>
            <div className="info-item">
              <h4>Informasi</h4>
              <ul>
                <li><strong>Tahun:</strong> {series.year}</li>
                <li><strong>Rating:</strong> ⭐ {series.rating}</li>
                <li><strong>Status:</strong> {series.status}</li>
                <li><strong>Total Season:</strong> {series.totalSeasons}</li>
                <li><strong>Genre:</strong> {series.genre.join(', ')}</li>
              </ul>
            </div>
            {series.cast && series.cast.length > 0 && (
              <div className="info-item">
                <h4>Pemain</h4>
                <p>{series.cast.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Watch;
