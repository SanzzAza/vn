import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/api';
import './Profile.css';

function Profile() {
  const { userId } = useParams();
  const { user, updateProfile } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    profilePicture: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/users/profile/${userId}`);
      setProfile(response.data.data);
      setFormData({
        username: response.data.data.username,
        bio: response.data.data.bio,
        profilePicture: response.data.data.profilePicture
      });
    } catch (error) {
      toast.error('Error loading profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(userId, formData);
      setProfile(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
      toast.success('Profile berhasil diperbarui');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="container mt-8">
          <p className="error-message">Profile tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === userId;

  return (
    <div className="profile-page">
      <div className="container mt-8 mb-8">
        <div className="profile-header">
          <div className="profile-picture">
            <img src={profile.profilePicture} alt={profile.username} />
          </div>
          <div className="profile-basic">
            <h1>{profile.username}</h1>
            {profile.isPremium && (
              <span className="premium-badge">⭐ Premium Member</span>
            )}
            {profile.isAdmin && (
              <span className="admin-badge">👑 Admin</span>
            )}
            {isOwnProfile && (
              <button
                className="edit-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <FiX /> Batal
                  </>
                ) : (
                  <>
                    <FiEdit2 /> Edit Profile
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Profile Picture URL</label>
              <input
                type="url"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleSaveProfile}
            >
              <FiSave /> Simpan Perubahan
            </button>
          </div>
        ) : (
          <div className="profile-info">
            <div className="info-section">
              <h2>Bio</h2>
              <p>{profile.bio || 'Belum ada bio'}</p>
            </div>

            <div className="info-section">
              <h2>Informasi Akun</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{profile.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Status Member:</span>
                  <span className="value">
                    {profile.isPremium ? 'Premium' : 'Regular'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Bergabung:</span>
                  <span className="value">
                    {new Date(profile.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Last Login:</span>
                  <span className="value">
                    {profile.lastLogin
                      ? new Date(profile.lastLogin).toLocaleDateString('id-ID')
                      : 'Belum login'}
                  </span>
                </div>
              </div>
            </div>

            {isOwnProfile && (
              <div className="info-section">
                <h2>Pengaturan Keamanan</h2>
                <button className="btn btn-secondary">
                  Ubah Password
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
