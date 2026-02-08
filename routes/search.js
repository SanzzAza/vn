import express from 'express';
import Series from '../models/Series.js';

const router = express.Router();

// Search series
router.get('/', async (req, res) => {
  try {
    const { q, genre, year, status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    let filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } },
        { cast: { $regex: q, $options: 'i' } }
      ];
    }

    if (genre) {
      filter.genre = genre;
    }

    if (year) {
      filter.year = parseInt(year);
    }

    if (status) {
      filter.status = status;
    }

    const results = await Series.find(filter)
      .populate('episodes', 'title season episode')
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1, views: -1 });

    const total = await Series.countDocuments(filter);

    res.json({
      success: true,
      data: results,
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
      message: 'Error searching',
      error: error.message
    });
  }
});

// Get search suggestions
router.get('/suggestions/query', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const suggestions = await Series.find({
      title: { $regex: q, $options: 'i' }
    })
      .select('title posterUrl')
      .limit(5);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting suggestions',
      error: error.message
    });
  }
});

export default router;
