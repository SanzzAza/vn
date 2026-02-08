import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Series from '../models/Series.js';
import Episode from '../models/Episode.js';
import User from '../models/User.js';

dotenv.config();

const seedData = [
  {
    title: 'Demon Slayer',
    description: 'Tanjiro memulai perjalanannya sebagai demon slayer untuk menyelamatkan adiknya Nezuko yang telah berubah menjadi demon.',
    posterUrl: 'https://via.placeholder.com/300x450?text=Demon+Slayer',
    bannerUrl: 'https://via.placeholder.com/1280x720?text=Demon+Slayer',
    genre: ['Action', 'Adventure', 'Fantasy'],
    rating: 8.8,
    year: 2019,
    status: 'Completed',
    totalSeasons: 3,
    country: 'Japan',
    director: ['Haruo Sotozaki'],
    cast: ['Natsuki Hanae', 'Akari Kitō', 'Hiro Shimono']
  },
  {
    title: 'Attack on Titan',
    description: 'Manusia melawan raksasa penyerang dinding dalam pertempuran epik untuk kelangsungan hidup.',
    posterUrl: 'https://via.placeholder.com/300x450?text=Attack+on+Titan',
    bannerUrl: 'https://via.placeholder.com/1280x720?text=Attack+on+Titan',
    genre: ['Action', 'Drama', 'Mystery'],
    rating: 8.7,
    year: 2013,
    status: 'Completed',
    totalSeasons: 4,
    country: 'Japan',
    director: ['Tetsuya Nakashima'],
    cast: ['Yuki Kaji', 'Yui Ishikawa', 'Marina Inoue']
  },
  {
    title: 'Death Note',
    description: 'Seorang siswa menemukan notebook ajaib yang dapat membunuh siapa saja. Dia memulai rencana untuk menjadi Tuhan dunia.',
    posterUrl: 'https://via.placeholder.com/300x450?text=Death+Note',
    bannerUrl: 'https://via.placeholder.com/1280x720?text=Death+Note',
    genre: ['Thriller', 'Mystery', 'Drama'],
    rating: 8.9,
    year: 2006,
    status: 'Completed',
    totalSeasons: 1,
    country: 'Japan',
    director: ['Tetsuro Araki'],
    cast: ['Mamoru Miyano', 'Noriko Hidaka', 'Shō Hayami']
  },
  {
    title: 'Naruto',
    description: 'Naruto adalah cerita tentang seorang ninja muda dengan mimpi menjadi Hokage dan melindungi desanya.',
    posterUrl: 'https://via.placeholder.com/300x450?text=Naruto',
    bannerUrl: 'https://via.placeholder.com/1280x720?text=Naruto',
    genre: ['Action', 'Adventure', 'Fantasy'],
    rating: 8.5,
    year: 2002,
    status: 'Completed',
    totalSeasons: 5,
    country: 'Japan',
    director: ['Hayato Date'],
    cast: ['Junichi Suwabe', 'Chie Nakamura', 'Shouya Isaka']
  },
  {
    title: 'One Piece',
    description: 'Luffy berlayar mencari harta karun Ultimate "One Piece" bersama awaknya untuk menjadi Raja Bajak Laut.',
    posterUrl: 'https://via.placeholder.com/300x450?text=One+Piece',
    bannerUrl: 'https://via.placeholder.com/1280x720?text=One+Piece',
    genre: ['Action', 'Adventure', 'Comedy'],
    rating: 8.6,
    year: 1999,
    status: 'Ongoing',
    totalSeasons: 20,
    country: 'Japan',
    director: ['Konosuke Uda'],
    cast: ['Mayumi Tanaka', 'Kazuya Nakai', 'Akemi Okamura']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dracinema', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Series.deleteMany({});
    await Episode.deleteMany({});
    await User.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@dracinema.com',
        password: 'admin123',
        isAdmin: true,
        isPremium: true
      },
      {
        username: 'user1',
        email: 'user1@dracinema.com',
        password: 'user1234',
        isPremium: true,
        premiumExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        username: 'user2',
        email: 'user2@dracinema.com',
        password: 'user2234'
      }
    ]);

    console.log('👥 Created sample users');

    // Create sample series and episodes
    for (const seriesData of seedData) {
      const series = await Series.create(seriesData);

      // Create episodes for each series
      for (let season = 1; season <= Math.min(2, seriesData.totalSeasons); season++) {
        for (let episode = 1; episode <= 12; episode++) {
          const episodeData = await Episode.create({
            series: series._id,
            title: `${seriesData.title} - Season ${season} Episode ${episode}`,
            description: `Episode ${episode} dari season ${season}`,
            season,
            episode,
            videoUrl: `https://example.com/videos/${series._id}/S${season}E${episode}.mp4`,
            duration: Math.floor(Math.random() * (45 - 20) + 20) * 60,
            releaseDate: new Date(2024, Math.random() * 12, Math.floor(Math.random() * 28) + 1),
            quality: ['720p', '1080p'][Math.floor(Math.random() * 2)],
            fileSize: Math.floor(Math.random() * 2000000000) + 500000000
          });

          series.episodes.push(episodeData._id);
        }
      }

      await series.save();
      console.log(`📺 Created series: ${series.title}`);
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
