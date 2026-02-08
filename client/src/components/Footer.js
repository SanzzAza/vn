import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🎬 DRACinema</h3>
            <p>Platform streaming video terlengkap dengan konten pilihan terbaik untuk Anda.</p>
          </div>

          <div className="footer-section">
            <h4>Navigasi</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/#">Trending</a></li>
              <li><a href="/#">Tentang</a></li>
              <li><a href="/#">Kontak</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Bantuan</h4>
            <ul>
              <li><a href="/#">FAQ</a></li>
              <li><a href="/#">Kebijakan Privacy</a></li>
              <li><a href="/#">Syarat & Ketentuan</a></li>
              <li><a href="/#">Hubungi Kami</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Ikuti Kami</h4>
            <div className="social-links">
              <a href="/#" title="Facebook"><FiFacebook /></a>
              <a href="/#" title="Twitter"><FiTwitter /></a>
              <a href="/#" title="Instagram"><FiInstagram /></a>
              <a href="/#" title="YouTube"><FiYoutube /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} DRACinema. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
