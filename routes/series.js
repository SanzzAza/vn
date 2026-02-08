import express from 'express';
import Series from '../models/Series.js';
import Episode from '../models/Episode.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { validateSeries } from '../middleware/validation.js';

const router = express.Router();

// Get all series dengan pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const series = await Series.find()
      .populate('episodes', 'title season episode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Series.countDocuments();

    res.json({
      success: true,
      data: series,
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
      message: 'Error mengambil series',
      error: error.message
    });
  }
});

// Get trending series
router.get('/trending/all', async (req, res) => {
  try {
    const trending = await Series.find()
      .sort({ views: -1 })
      .limit(10)
      .populate('episodes', 'title season episode');

    res.json({
      success: true,
      data: trending
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil trending series',
      error: error.message
    });
  }
});

// Get series by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const series = await Series.find({ genre: req.params.genre })
      .skip(skip)
      .limit(limit)
      .populate('episodes', 'title season episode');

    const total = await Series.countDocuments({ genre: req.params.genre });

    res.json({
      success: true,
      data: series,
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
      message: 'Error mengambil series berdasarkan genre',
      error: error.message
    });
  }
});

// Get detail series
router.get('/:id', async (req, res) => {
  try {
    const series = await Series.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate({
      path: 'episodes',
      options: { sort: { season: 1, episode: 1 } }
    });

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: series
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil detail series',
      error: error.message
    });
  }
});

// Create series (Admin only)
router.post('/', authMiddleware, adminMiddleware, validateSeries, async (req, res) => {
  try {
    const { title, description, posterUrl, bannerUrl, genre, year, status, totalSeasons, country, director, cast } = req.body;

    const newSeries = new Series({
      title,
      description,
      posterUrl: posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster',
      bannerUrl: bannerUrl || 'https://via.placeholder.com/1280x720?text=No+Banner',
      genre,
      year,
      status,
      totalSeasons,
      country,
      director,
      cast
    });

    await newSeries.save();

    res.status(201).json({
      success: true,
      message: 'Series berhasil ditambahkan',
      data: newSeries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error membuat series',
      error: error.message
    });
  }
});

// Update series (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, posterUrl, bannerUrl, genre, year, status, totalSeasons, country, director, cast, rating } = req.body;

    const series = await Series.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        posterUrl,
        bannerUrl,
        genre,
        year,
        status,
        totalSeasons,
        country,
        director,
        cast,
        rating
      },
      { new: true, runValidators: true }
    );

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Series berhasil diperbarui',
      data: series
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error memperbarui series',
      error: error.message
    });
  }
});

// Delete series (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Delete all episodes first
    await Episode.deleteMany({ series: req.params.id });

    const series = await Series.findByIdAndDelete(req.params.id);

    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Series berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error menghapus series',
      error: error.message
    });
  }
});

export default router;
