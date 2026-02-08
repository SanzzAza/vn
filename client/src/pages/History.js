import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlay } from 'react-icons/fi';
import { useSeriesStore } from '../stores/seriesStore';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './History.css';

function History() {
  const { history, fetchHistory, isLoading } = useSeriesStore();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadHistory(1);
  }, []);

  const loadHistory = async (pageNum) => {
    try {
      const response = await fetchHistory(pageNum);
      setTotalPages(response.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      toast.error('Error loading history');
    }
  };

  const handleDeleteHistory = async (historyId) => {
    try {
      await api.delete(`/history/${historyId}`);
      await loadHistory(1);
      toast.success('History dihapus');
    } catch (error) {
      toast.error('Error deleting history');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Hapus semua riwayat menonton?')) {
      try {
        await api.delete('/history');
        await loadHistory(1);
        toast.success('Semua history dihapus');
      } catch (error) {
        toast.error('Error clearing history');
      }
    }
  };

  return (
    <div className="history-page">
      <div className="container mt-8 mb-8">
        <div className="page-header">
          <div>
            <h1>📺 Riwayat Menonton</h1>
            <p>{history.length} episode ditonton</p>
          </div>
          {history.length > 0 && (
            <button className="btn btn-secondary" onClick={handleClearAll}>
              <FiTrash2 /> Hapus Semua
            </button>
          )}
        </div>

        {isLoading && history.length === 0 ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : history.length > 0 ? (
          <>
            <div className="history-list">
              {history.map(item => (
                <div key={item._id} className="history-item">
                  <Link to={`/watch/${item.episode._id}`} className="history-content">
                    <div className="history-poster">
                      <img src={item.series.posterUrl} alt={item.series.title} />
                    </div>
                    <div className="history-info">
                      <h3>{item.series.title}</h3>
                      <p className="episode-name">
                        S{item.episode.season}E{item.episode.episode}: {item.episode.title}
                      </p>
                      <p className="watch-date">
                        Ditonton: {new Date(item.watchedAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <button className="play-btn" onClick={(e) => {
                      e.preventDefault();
                    }}>
                      <FiPlay /> Lanjutkan
                    </button>
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteHistory(item._id)}
                    title="Hapus dari history"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            {page < totalPages && (
              <div className="pagination-container">
                <button 
                  className="btn btn-primary"
                  onClick={() => loadHistory(page + 1)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Muat Lebih Banyak'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>Belum ada riwayat menonton. Mulai tonton series favorit Anda!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
