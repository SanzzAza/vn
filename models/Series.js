import mongoose from 'mongoose';

const seriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  posterUrl: {
    type: String,
    required: true,
    default: 'https://via.placeholder.com/300x450?text=No+Poster'
  },
  bannerUrl: {
    type: String,
    default: 'https://via.placeholder.com/1280x720?text=No+Banner'
  },
  genre: [{
    type: String,
    enum: ['Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Fantasy', 'Adventure', 'Mystery']
  }],
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Upcoming'],
    default: 'Ongoing'
  },
  totalSeasons: {
    type: Number,
    default: 1
  },
  country: {
    type: String,
    default: 'Indonesia'
  },
  director: [{
    type: String
  }],
  cast: [{
    type: String
  }],
  episodes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Episode'
  }],
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index untuk search
seriesSchema.index({ title: 'text', description: 'text', genre: 'text' });

export default mongoose.model('Series', seriesSchema);
