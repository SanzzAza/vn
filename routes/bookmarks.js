import express from 'express';
import Bookmark from '../models/Bookmark.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user bookmarks
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const bookmarks = await Bookmark.find({ user: req.user.id })
      .populate('series')
      .sort({ bookmarkedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Bookmark.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: bookmarks,
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
      message: 'Error mengambil bookmarks',
      error: error.message
    });
  }
});

// Add bookmark
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { seriesId } = req.body;

    if (!seriesId) {
      return res.status(400).json({
        success: false,
        message: 'Series ID diperlukan'
      });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      user: req.user.id,
      series: seriesId
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: 'Series sudah dibookmark'
      });
    }

    const bookmark = new Bookmark({
      user: req.user.id,
      series: seriesId
    });

    await bookmark.save();
    await bookmark.populate('series');

    res.status(201).json({
      success: true,
      message: 'Series berhasil ditambahkan ke bookmark',
      data: bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error menambahkan bookmark',
      error: error.message
    });
  }
});

// Remove bookmark
router.delete('/:seriesId', authMiddleware, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user.id,
      series: req.params.seriesId
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Bookmark berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error menghapus bookmark',
      error: error.message
    });
  }
});

// Check if series is bookmarked
router.get('/check/:seriesId', authMiddleware, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      user: req.user.id,
      series: req.params.seriesId
    });

    res.json({
      success: true,
      isBookmarked: !!bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking bookmark',
      error: error.message
    });
  }
});

export default router;
