import express from 'express';
import User from '../models/User.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil profile',
      error: error.message
    });
  }
});

// Get current user (from token)
router.get('/me/current', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengambil data user',
      error: error.message
    });
  }
});

// Update user profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Tidak ada izin untuk mengubah profile ini'
      });
    }

    const { username, bio, profilePicture } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, bio, profilePicture },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Profile berhasil diperbarui',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error memperbarui profile',
      error: error.message
    });
  }
});

// Change password
router.put('/:id/change-password', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Tidak ada izin untuk mengubah password ini'
      });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password baru tidak cocok'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password saat ini salah'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password berhasil diubah'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error mengubah password',
      error: error.message
    });
  }
});

// Get all users (Admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
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
      message: 'Error mengambil users',
      error: error.message
    });
  }
});

// Grant premium (Admin only)
router.put('/:id/premium', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { days } = req.body;

    if (!days || days < 1) {
      return res.status(400).json({
        success: false,
        message: 'Jumlah hari harus minimal 1'
      });
    }

    const premiumExpiry = new Date();
    premiumExpiry.setDate(premiumExpiry.getDate() + days);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isPremium: true,
        premiumExpiry
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: `Premium status diberikan selama ${days} hari`,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error memberikan premium',
      error: error.message
    });
  }
});

export default router;
