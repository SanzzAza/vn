# DRACinema - Video Streaming Platform

Platform streaming video modern seperti DRACinema dengan fitur lengkap untuk menonton anime, drama, dan series lainnya.

## 🎬 Fitur Utama

- **Video Player Modern** - Pemain video HTML5 dengan kontrol lengkap
- **Episode Management** - Navigasi season dan episode yang mudah
- **Bookmark System** - Simpan series favorit untuk ditonton nanti
- **Watch History** - Riwayat menonton dan fitur "Continue Watching"
- **Share Feature** - Bagikan link dengan QR code ke social media
- **Search** - Pencarian series berdasarkan judul, genre, tahun
- **User Authentication** - Login/Register dengan JWT
- **Responsive Design** - Mobile-friendly interface
- **Admin Panel** - Kelola series dan episodes
- **Premium System** - Status membership

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB
- JWT Authentication
- Socket.io (optional untuk real-time)
- Redis (caching)

### Frontend
- React 18
- React Router
- Axios
- Zustand (State Management)
- Video.js
- Tailwind CSS

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstall:
- Node.js v18+ ([download](https://nodejs.org/))
- MongoDB Community Edition ([download](https://www.mongodb.com/try/download/community))
- npm atau yarn package manager

## 🚀 Instalasi & Setup

### 1. Clone Repository

    git clone https://github.com/yourusername/dracinema.git
    cd dracinema

### 2. Setup Backend

    # Install dependencies
    npm install

    # Buat file .env dari template
    cp .env.example .env

    # Edit .env dengan konfigurasi Anda
    nano .env

    # Seed database dengan data contoh (optional)
    npm run seed

### 3. Setup Frontend

    cd client
    npm install
    cp .env.example .env

    # Edit konfigurasi API URL jika diperlukan
    nano .env

### 4. Jalankan Aplikasi

#### Development Mode

    # Terminal 1 - Backend
    npm run dev

    # Terminal 2 - Frontend
    cd client
    npm start

Aplikasi akan berjalan di:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 📁 Struktur Project

    dracinema/
    ├── models/              # Database schemas
    │   ├── User.js
    │   ├── Series.js
    │   ├── Episode.js
    │   ├── Bookmark.js
    │   └── History.js
    ├── routes/              # API endpoints
    │   ├── auth.js
    │   ├── series.js
    │   ├── episodes.js
    │   ├── users.js
    │   ├── bookmarks.js
    │   ├── history.js
    │   └── search.js
    ├── middleware/          # Custom middleware
    │   ├── auth.js
    │   └── validation.js
    ├── scripts/             # Utility scripts
    │   └── seedDatabase.js
    ├── public/              # Static files
    │   └── uploads/
    ├── client/              # React frontend
    │   ├── public/
    │   └── src/
    │       ├── components/  # Reusable components
    │       ├── pages/       # Page components
    │       ├── stores/      # Zustand stores
    │       └── utils/       # Utility functions
    ├── server.js            # Entry point backend
    ├── package.json
    ├── .env.example
    ├── docker-compose.yml
    └── README.md

## 🔧 Konfigurasi

### Backend .env

    NODE_ENV=development
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/dracinema
    JWT_SECRET=your_super_secret_key_change_this
    CLIENT_URL=http://localhost:3000
    REDIS_URL=redis://localhost:6379
    UPLOAD_DIR=./public/uploads
    MAX_FILE_SIZE=5000000000

### Frontend .env

    REACT_APP_API_URL=http://localhost:5000/api

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/refresh` - Refresh token

### Series
- `GET /api/series` - Dapatkan semua series (paginated)
- `GET /api/series/trending/all` - Series trending
- `GET /api/series/genre/:genre` - Series berdasarkan genre
- `GET /api/series/:id` - Detail series
- `POST /api/series` - Buat series (Admin)
- `PUT /api/series/:id` - Update series (Admin)
- `DELETE /api/series/:id` - Hapus series (Admin)

### Episodes
- `GET /api/episodes/series/:seriesId` - Dapatkan episodes
- `GET /api/episodes/:id` - Detail episode
- `POST /api/episodes` - Buat episode (Admin)
- `PUT /api/episodes/:id` - Update episode (Admin)
- `DELETE /api/episodes/:id` - Hapus episode (Admin)

### Users
- `GET /api/users/profile/:id` - Profile user
- `GET /api/users/me/current` - Profile user yang login
- `PUT /api/users/:id` - Update profile
- `PUT /api/users/:id/change-password` - Ubah password
- `GET /api/users` - Semua users (Admin)
- `PUT /api/users/:id/premium` - Berikan premium (Admin)

### Bookmarks
- `GET /api/bookmarks` - Dapatkan bookmarks
- `POST /api/bookmarks` - Tambah bookmark
- `DELETE /api/bookmarks/:seriesId` - Hapus bookmark
- `GET /api/bookmarks/check/:seriesId` - Check status bookmark

### History
- `GET /api/history` - Riwayat menonton
- `GET /api/history/continue/watching` - Continue watching
- `POST /api/history` - Simpan/update history
- `GET /api/history/series/:seriesId` - History series
- `DELETE /api/history/:id` - Hapus history
- `DELETE /api/history` - Hapus semua history

### Search
- `GET /api/search` - Cari series
- `GET /api/search/suggestions/query` - Saran pencarian

## 🐳 Docker Deployment

### Build & Run dengan Docker Compose

    docker-compose up -d

Aplikasi akan berjalan di http://localhost:5000

### Stop Services

    docker-compose down

### View Logs

    docker-compose logs -f backend

## 🧪 Testing

### Run Tests

    npm test

### Run Tests dengan Watch Mode

    npm run test:watch

## 📝 Contoh Penggunaan

### Register User Baru

    POST /api/auth/register
    {
      "username": "john_doe",
      "email": "john@example.com",
      "password": "password123"
    }

### Login

    POST /api/auth/login
    {
      "email": "john@example.com",
      "password": "password123"
    }

Response:
    {
      "success": true,
      "user": {
        "_id": "...",
        "username": "john_doe",
        "email": "john@example.com",
        "isPremium": false
      },
      "token": "eyJhbGc..."
    }

### Create Series (Requires Admin)

    POST /api/series
    Headers: Authorization: Bearer {token}
    {
      "title": "Demon Slayer",
      "description": "Anime action terbaik",
      "genre": ["Action", "Adventure"],
      "year": 2021,
      "totalSeasons": 3,
      "country": "Japan"
    }

### Add Episode

    POST /api/episodes
    Headers: Authorization: Bearer {token}
    {
      "seriesId": "...",
      "title": "Pilot Episode",
      "season": 1,
      "episode": 1,
      "videoUrl": "https://example.com/video.mp4",
      "duration": 1200,
      "quality": "720p"
    }

### Add Bookmark

    POST /api/bookmarks
    Headers: Authorization: Bearer {token}
    {
      "seriesId": "..."
    }

### Save Watch History

    POST /api/history
    Headers: Authorization: Bearer {token}
    {
      "seriesId": "...",
      "episodeId": "...",
      "currentTime": 600,
      "duration": 1200,
      "completed": false
    }

## 🚨 Troubleshooting

### MongoDB Connection Error

    Error: connect ECONNREFUSED 127.0.0.1:27017

**Solusi:**
- Pastikan MongoDB service sudah running
- Di Windows: `mongod` atau gunakan MongoDB Compass
- Di macOS: `brew services start mongodb-community`
- Di Linux: `sudo systemctl start mongod`

### Port Already in Use

    Error: listen EADDRINUSE: address already in use :::5000

**Solusi:**
- Ganti PORT di .env atau gunakan port lain
- Atau kill proses yang menggunakan port tersebut

### CORS Error

    Error: Access to XMLHttpRequest blocked by CORS policy

**Solusi:**
- Pastikan `CLIENT_URL` di backend .env sesuai dengan URL frontend
- Restart backend server

### Module Not Found

    Error: Cannot find module 'express'

**Solusi:**
    npm install

### Frontend Blank/White Screen

**Solusi:**
- Clear browser cache: Ctrl+Shift+Delete
- Check console browser untuk error
- Pastikan backend running dan API_URL benar

## 📱 Fitur Mobile

Aplikasi fully responsive dengan support lengkap untuk:
- Smartphone (iOS & Android)
- Tablet
- Desktop

## 🔐 Security Features

- Password hashing dengan bcrypt
- JWT token authentication
- Input validation
- SQL injection protection
- CORS configuration
- Environment variables untuk sensitive data

## 🎯 Roadmap

- [ ] Live chat antar user
- [ ] Rating dan review episodes
- [ ] Subtitle multi-language
- [ ] Downloading episodes
- [ ] Social sharing integration
- [ ] Payment gateway untuk premium
- [ ] Analytics dashboard

## 📄 License

MIT License - Bebas digunakan untuk tujuan apapun

## 🤝 Kontribusi

Contributions welcome! Silakan buat pull request untuk improvement apapun.

## 📧 Kontak & Support

- Email: support@dracinema.com
- Issues: GitHub Issues
- Discussion: GitHub Discussions

## 🙏 Credits

Built with ❤️ untuk komunitas streaming Indonesia

---

**Made with ❤️ by DRACinema Team**
