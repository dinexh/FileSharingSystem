import React, { useState, useRef } from 'react';
import './ProfileForm.css';

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
        <div className="profile-form-sidebyside">
            <div className="profile-card">
                <h3 className="profile-section-title">Profile Info</h3>
                <form className="profile-form" onSubmit={handleProfileSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={initialProfile.email || ''}
                            readOnly
                            className="readonly-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Profile Image</label>
                        <div className="profile-image-upload">
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <button 
                                type="button" 
                                className="profile-image-select-btn"
                                onClick={handleSelectFile}
                                disabled={isUploading}
                            >
                                {isUploading ? 'Uploading...' : 'Choose Image'}
                            </button>
                            {profileImage && (
                                <span className="selected-file-name">{profileImage.name}</span>
                            )}
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
                    {error && <div className="form-error">{error}</div>}
                    <button 
                        type="submit" 
                        className="profile-save-btn" 
                        disabled={loading || isUploading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
            <div className="profile-card">
                <h3 className="profile-section-title">Change Password</h3>
                <form className="profile-form" onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                    {passwordError && <div className="form-error">{passwordError}</div>}
                    <button type="submit" className="profile-save-btn" disabled={loadingPassword || !password || !confirmPassword}>
                        {loadingPassword ? 'Saving...' : 'Save Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm; 