import React, { useEffect, useState } from 'react';
import SeriesCard from '../components/SeriesCard';
import { useSeriesStore } from '../stores/seriesStore';
import { toast } from 'react-toastify';
import './Bookmarks.css';

function Bookmarks() {
  const { bookmarks, fetchBookmarks, removeBookmark, isLoading } = useSeriesStore();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadBookmarks(1);
  }, []);

  const loadBookmarks = async (pageNum) => {
    try {
      const response = await fetchBookmarks(pageNum);
      setTotalPages(response.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      toast.error('Error loading bookmarks');
    }
  };

  const handleRemoveBookmark = async (seriesId) => {
    try {
      await removeBookmark(seriesId);
      await loadBookmarks(1);
      toast.success('Bookmark dihapus');
    } catch (error) {
      toast.error('Error removing bookmark');
    }
  };

  return (
    <div className="bookmarks-page">
      <div className="container mt-8 mb-8">
        <div className="page-header">
          <h1>📚 Bookmark Saya</h1>
          <p>{bookmarks.length} series tersimpan</p>
        </div>

        {isLoading && bookmarks.length === 0 ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : bookmarks.length > 0 ? (
          <>
            <div className="grid-auto">
              {bookmarks.map(item => (
                <SeriesCard
                  key={item.series._id}
                  series={item.series}
                  onBookmarkToggle={() => handleRemoveBookmark(item.series._id)}
                />
              ))}
            </div>

            {page < totalPages && (
              <div className="pagination-container">
                <button 
                  className="btn btn-primary"
                  onClick={() => loadBookmarks(page + 1)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Muat Lebih Banyak'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>Belum ada bookmark. Mulai simpan series favorit Anda!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookmarks;
