import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
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
  episode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Episode',
    required: true
  },
  watchedAt: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    default: 0
  },
  currentTime: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Index untuk query cepat
historySchema.index({ user: 1, watchedAt: -1 });
historySchema.index({ user: 1, series: 1, episode: 1 }, { unique: true });

export default mongoose.model('History', historySchema);
