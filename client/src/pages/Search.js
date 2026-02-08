import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SeriesCard from '../components/SeriesCard';
import api from '../utils/api';
import './Search.css';

function Search() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchQuery = searchParams.get('q') || '';
  const genre = searchParams.get('genre');
  const year = searchParams.get('year');

  useEffect(() => {
    setPage(1);
    setResults([]);
    if (searchQuery || genre || year) {
      performSearch(1);
    }
  }, [searchQuery, genre, year]);

  const performSearch = async (pageNum) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('q', searchQuery);
      if (genre) params.append('genre', genre);
      if (year) params.append('year', year);
      params.append('page', pageNum);
      params.append('limit', 12);

      const response = await api.get(`/search?${params.toString()}`);
      
      if (pageNum === 1) {
        setResults(response.data.data);
      } else {
        setResults(prev => [...prev, ...response.data.data]);
      }
      
      setTotalPages(response.data.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      performSearch(page + 1);
    }
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1>Hasil Pencarian</h1>
          {searchQuery && <p>Mencari: <strong>"{searchQuery}"</strong></p>}
        </div>

        {isLoading && results.length === 0 ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="search-results">
              <p className="result-count">Ditemukan {results.length} hasil</p>
              <div className="grid-auto">
                {results.map(series => (
                  <SeriesCard key={series._id} series={series} />
                ))}
              </div>
            </div>

            {page < totalPages && (
              <div className="load-more-container">
                <button 
                  className="btn btn-primary"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Muat Lebih Banyak'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-results">
            <p>Tidak ada hasil yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
