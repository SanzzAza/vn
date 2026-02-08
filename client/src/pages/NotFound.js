import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <p>Halaman tidak ditemukan</p>
          <p className="subtitle">Maaf, halaman yang Anda cari tidak ada atau telah dihapus.</p>
          <Link to="/" className="btn btn-primary">
            Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
