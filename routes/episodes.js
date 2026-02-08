import express from 'express';
import Episode from '../models/Episode.js';
import Series from '../models/Series.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { validateEpisode } from '../middleware/validation.js';

const router = express.Router();

// Get episodes by series
router.get('/series/:seriesId', async (req, res) => {
  try {
    const episodes = await Episode.find({ series: req.params.seriesId })
      .sort({ season: 1, episode: 1 })
      .populate('series', 'title');

    res.json({
      success: true,
      data: episodes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil episodes',
      error: error.message
    });
  }
});

// Get episode detail
router.get('/:id', async (req, res) => {
  try {
    const episode = await Episode.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('series', 'title genre year');

    if (!episode) {
      return res.status(404).json({
        success: false,
        message: 'Episode tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: episode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil episode',
      error: error.message
    });
  }
});

// Create episode (Admin only)
router.post('/', authMiddleware, adminMiddleware, validateEpisode, async (req, res) => {
  try {
    const { seriesId, title, description, season, episode, videoUrl, thumbnailUrl, duration, releaseDate, quality, fileSize, subtitles } = req.body;

    // Check if series exists
    const series = await Series.findById(seriesId);
    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series tidak ditemukan'
      });
    }

    // Check if episode already exists
    const existingEpisode = await Episode.findOne({
      series: seriesId,
      season,
      episode
    });

    if (existingEpisode) {
      return res.status(400).json({
        success: false,
        message: `Episode S${season}E${episode} sudah ada`
      });
    }

    const newEpisode = new Episode({
      series: seriesId,
      title,
      description,
      season,
      episode,
      videoUrl,
      thumbnailUrl: thumbnailUrl || 'https://via.placeholder.com/320x180?text=No+Thumbnail',
      duration,
      releaseDate,
      quality,
      fileSize,
      subtitles
    });

    await newEpisode.save();

    // Add episode to series
    series.episodes.push(newEpisode._id);
    await series.save();

    res.status(201).json({
      success: true,
      message: 'Episode berhasil ditambahkan',
      data: newEpisode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error membuat episode',
      error: error.message
    });
  }
});

// Update episode (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, season, episode, videoUrl, thumbnailUrl, duration, quality, fileSize, subtitles } = req.body;

    const updatedEpisode = await Episode.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        season,
        episode,
        videoUrl,
        thumbnailUrl,
        duration,
        quality,
        fileSize,
        subtitles
      },
      { new: true, runValidators: true }
    );

    if (!updatedEpisode) {
      return res.status(404).json({
        success: false,
        message: 'Episode tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Episode berhasil diperbarui',
      data: updatedEpisode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error memperbarui episode',
      error: error.message
    });
  }
});

// Delete episode (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const episode = await Episode.findByIdAndDelete(req.params.id);

    if (!episode) {
      return res.status(404).json({
        success: false,
        message: 'Episode tidak ditemukan'
      });
    }

    // Remove episode from series
    await Series.findByIdAndUpdate(
      episode.series,
      { $pull: { episodes: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Episode berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error menghapus episode',
      error: error.message
    });
  }
});

export default router;
