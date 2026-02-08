import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiPlay } from 'react-icons/fi';
import SeriesCard from '../components/SeriesCard';
import { useSeriesStore } from '../stores/seriesStore';
import './Home.css';

function Home() {
  const {
    trending,
    continueWatching,
    fetchTrendingSeries,
    fetchContinueWatching,
    fetchSeries,
    addBookmark,
    removeBookmark,
    checkBookmark,
    isLoading
  } = useSeriesStore();

  const [allSeries, setAllSeries] = useState([]);
  const [bookmarkedSeries, setBookmarkedSeries] = useState(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await fetchTrendingSeries();
      await fetchContinueWatching();
      const response = await fetchSeries(1, 12);
      setAllSeries(response.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleBookmarkToggle = async (seriesId, isBookmarked) => {
    try {
      if (isBookmarked) {
        await addBookmark(seriesId);
        setBookmarkedSeries(prev => new Set([...prev, seriesId]));
      } else {
        await removeBookmark(seriesId);
        setBookmarkedSeries(prev => {
          const updated = new Set(prev);
          updated.delete(seriesId);
          return updated;
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const featuredSeries = trending.length > 0 ? trending[0] : null;

  return (
    <div className="home">
      {/* Hero Banner */}
      {featuredSeries && (
        <div className="hero-banner" style={{ backgroundImage: `url(${featuredSeries.bannerUrl})` }}>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">{featuredSeries.title}</h1>
            <p className="hero-description">{featuredSeries.description}</p>
            <div className="hero-actions">
              <Link to={`/watch/${featuredSeries.episodes[0]?._id}`} className="btn btn-primary">
                <FiPlay /> Tonton Sekarang
              </Link>
              <Link to={`/series/${featuredSeries._id}`} className="btn btn-secondary">
                Info Lebih Lanjut
              </Link>
            </div>
            <div className="hero-meta">
              <span className="meta-item">⭐ {featuredSeries.rating}</span>
              <span className="meta-item">📅 {featuredSeries.year}</span>
              <span className="meta-item">🌍 {featuredSeries.country}</span>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2>Lanjutkan Menonton</h2>
              <Link to="/history" className="view-more">
                Lihat Semua <FiChevronRight />
              </Link>
            </div>
            <div className="series-grid">
              {continueWatching.slice(0, 6).map(item => (
                <div key={item._id} className="continue-item">
                  <Link to={`/watch/${item.episode._id}`} className="continue-link">
                    <img src={item.series.posterUrl} alt={item.series.title} />
                    <div className="continue-info">
                      <h4>{item.series.title}</h4>
                      <p>S{item.episode.season}E{item.episode.episode}: {item.episode.title}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Series */}
        {trending.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2>🔥 Sedang Trending</h2>
              <Link to="/series" className="view-more">
                Lihat Semua <FiChevronRight />
              </Link>
            </div>
            <div className="grid-auto">
              {trending.slice(0, 6).map(series => (
                <SeriesCard
                  key={series._id}
                  series={series}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Series */}
        {allSeries.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2>📺 Semua Series</h2>
              <Link to="/series" className="view-more">
                Lihat Semua <FiChevronRight />
              </Link>
            </div>
            <div className="grid-auto">
              {allSeries.slice(0, 12).map(series => (
                <SeriesCard
                  key={series._id}
                  series={series}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))}
            </div>
          </section>
        )}

        {/* Info Section */}
        <section className="info-section">
          <div className="info-card">
            <h3>🎬 Konten Berkualitas</h3>
            <p>Nikmati konten streaming dengan kualitas terbaik hingga 4K</p>
          </div>
          <div className="info-card">
            <h3>📱 Semua Perangkat</h3>
            <p>Tonton di desktop, tablet, atau smartphone kapan saja</p>
          </div>
          <div className="info-card">
            <h3>🎯 Rekomendasi Personal</h3>
            <p>Dapatkan rekomendasi series favorit berdasarkan riwayat menonton</p>
          </div>
          <div className="info-card">
            <h3>🌍 Konten Global</h3>
            <p>Akses koleksi anime, drama, dan film dari seluruh dunia</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
