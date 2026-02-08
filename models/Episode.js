import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
  series: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  season: {
    type: Number,
    required: true,
    min: 1
  },
  episode: {
    type: Number,
    required: true,
    min: 1
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: 'https://via.placeholder.com/320x180?text=No+Thumbnail'
  },
  duration: {
    type: Number,
    default: 0
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  quality: {
    type: String,
    enum: ['360p', '480p', '720p', '1080p', '4K'],
    default: '720p'
  },
  fileSize: {
    type: Number,
    default: 0
  },
  subtitles: [{
    language: String,
    url: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index untuk query
episodeSchema.index({ series: 1, season: 1, episode: 1 });

export default mongoose.model('Episode', episodeSchema);
