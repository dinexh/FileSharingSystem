import React, { useState, useRef } from 'react';
import './ProfileForm.css';
import { FiCamera, FiMail, FiUser, FiLock } from 'react-icons/fi';
import defaultAvatar from '../../assets/default-avatar.svg';

const ProfileForm = ({ initialProfile, onSave, onSavePassword, loading, loadingPassword }) => {
    const [fullName, setFullName] = useState(initialProfile.fullName || '');
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initialProfile.profileImageUrl || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef();

    // Function to get server URL for profile images
    const getProfileImageUrl = (url) => {
        if (!url) return defaultAvatar;
        
        // If it's a full URL (http://) use it directly
        if (url.startsWith('http')) {
            return url;
        }
        
        // If it's an API path, use the backend URL
        if (url.startsWith('/api/')) {
            return `http://localhost:8080${url}`;
        }
        
        // Fallback to default avatar
        return defaultAvatar;
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        if (profileImage) {
            // If there's a new image, upload it first
            uploadProfileImage();
        } else {
            // Otherwise just save the name
            onSave({ 
                fullName, 
                profileImageUrl: previewUrl // Keep existing image URL if no new one
            });
        }
    };

    const uploadProfileImage = () => {
        setIsUploading(true);
        setUploadProgress(0);
        
        const formData = new FormData();
        formData.append('file', profileImage);
        
        // Create a simulated progress indicator
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);
        
        fetch('http://localhost:8080/api/users/profile/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Image upload failed');
            }
            return response.json();
        })
        .then(data => {
            // Complete the progress bar
            setUploadProgress(100);
            
            // Save the profile with the new image URL
            onSave({ 
                fullName, 
                profileImageUrl: data.profileImageUrl // Use the URL returned from the server
            });
        })
        .catch(err => {
            setError('Failed to upload profile image. Please try again.');
            console.error('Upload error:', err);
        })
        .finally(() => {
            clearInterval(progressInterval);
            setIsUploading(false);
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelectFile = () => {
        fileInputRef.current.click();
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setPasswordError('');
        if (!password || !confirmPassword) {
            setPasswordError('Please enter and confirm your new password.');
            return;
        }
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        onSavePassword({ password });
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-image-section">
                    <div className="profile-avatar">
                        {previewUrl ? (
                            <img 
                                src={getProfileImageUrl(previewUrl)} 
                                alt="Profile" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultAvatar;
                                }}
                            />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                <FiUser size={40} />
                            </div>
                        )}
                        <button 
                            type="button" 
                            className="avatar-upload-btn"
                            onClick={handleSelectFile}
                        >
                            <FiCamera size={18} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                    {isUploading && (
                        <div className="upload-progress-container">
                            <div className="upload-progress-bar">
                                <div 
                                    className="upload-progress-fill"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <div className="upload-progress-text">{uploadProgress}%</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    <div className="card-header">
                        <FiUser className="card-icon" />
                        <h3>Personal Information</h3>
                    </div>
                    
                    <form className="profile-form" onSubmit={handleProfileSubmit}>
                        <div className="form-group">
                            <label>
                                {/* <FiMail className="input-icon" /> */}
                                <span>Email</span>
                            </label>
                            <input
                                type="email"
                                value={initialProfile.email || ''}
                                readOnly
                                className="readonly-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                {/* <FiUser className="input-icon" /> */}
                                <span>Full Name</span>
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                required
                                placeholder="Your full name"
                            />
                        </div>
                        
                        {error && <div className="form-error">{error}</div>}
                        
                        <button 
                            type="submit" 
                            className="profile-save-btn" 
                            disabled={loading || isUploading}
                        >
                            {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>
                
                <div className="profile-card">
                    <div className="card-header">
                        <FiLock className="card-icon" />
                        <h3>Security</h3>
                    </div>
                    
                    <form className="profile-form" onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label>
                                {/* <FiLock className="input-icon" /> */}
                                <span>New Password</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                {/* <FiLock className="input-icon" /> */}
                                <span>Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>
                        
                        {passwordError && <div className="form-error">{passwordError}</div>}
                        
                        <button 
                            type="submit" 
                            className="profile-save-btn" 
                            disabled={loadingPassword || !password || !confirmPassword}
                        >
                            {loadingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm; 