import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  series: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series',
    required: true
  },
  bookmarkedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure unique bookmark per user-series combination
bookmarkSchema.index({ user: 1, series: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);
