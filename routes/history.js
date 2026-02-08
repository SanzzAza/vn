import express from 'express';
import History from '../models/History.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get watch history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const history = await History.find({ user: req.user.id })
      .populate('series', 'title posterUrl')
      .populate('episode', 'title season episode')
      .sort({ watchedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await History.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: history,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil history',
      error: error.message
    });
  }
});

// Get continue watching (latest 5 series)
router.get('/continue/watching', authMiddleware, async (req, res) => {
  try {
    // Get latest watched series
    const history = await History.find({ user: req.user.id })
      .populate({
        path: 'series',
        select: 'title posterUrl'
      })
      .populate({
        path: 'episode',
        select: 'title season episode duration'
      })
      .sort({ watchedAt: -1 })
      .limit(20);

    // Group by series and get latest episode
    const continueWatching = [];
    const seriesIds = new Set();

    for (const item of history) {
      if (!seriesIds.has(item.series._id.toString())) {
        continueWatching.push(item);
        seriesIds.add(item.series._id.toString());
        if (continueWatching.length >= 5) break;
      }
    }

    res.json({
      success: true,
      data: continueWatching
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil continue watching',
      error: error.message
    });
  }
});

// Add/Update watch history
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { seriesId, episodeId, currentTime, duration, completed } = req.body;

    if (!seriesId || !episodeId) {
      return res.status(400).json({
        success: false,
        message: 'Series ID dan Episode ID diperlukan'
      });
    }

    let historyRecord = await History.findOne({
      user: req.user.id,
      series: seriesId,
      episode: episodeId
    });

    if (historyRecord) {
      historyRecord.currentTime = currentTime || historyRecord.currentTime;
      historyRecord.duration = duration || historyRecord.duration;
      historyRecord.completed = completed || historyRecord.completed;
      historyRecord.watchedAt = new Date();
    } else {
      historyRecord = new History({
        user: req.user.id,
        series: seriesId,
        episode: episodeId,
        currentTime,
        duration,
        completed: completed || false,
        watchedAt: new Date()
      });
    }

    await historyRecord.save();
    await historyRecord.populate([
      { path: 'series', select: 'title' },
      { path: 'episode', select: 'title season episode' }
    ]);

    res.json({
      success: true,
      message: 'History berhasil disimpan',
      data: historyRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error menyimpan history',
      error: error.message
    });
  }
});

// Get history by series
router.get('/series/:seriesId', authMiddleware, async (req, res) => {
  try {
    const history = await History.find({
      user: req.user.id,
      series: req.params.seriesId
    })
      .populate('episode', 'title season episode duration currentTime')
      .sort({ watchedAt: -1 });

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil history series',
      error: error.message
    });
  }
});

// Delete history
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const history = await History.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: 'History tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'History berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error menghapus history',
      error: error.message
    });
  }
});

// Clear all history
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await History.deleteMany({ user: req.user.id });

    res.json({
      success: true,
      message: 'Semua history berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error menghapus history',
      error: error.message
    });
  }
});

export default router;
