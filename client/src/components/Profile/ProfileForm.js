import React, { useState } from 'react';
import './ProfileForm.css';

const ProfileForm = ({ initialProfile, onSave, onSavePassword, loading, loadingPassword }) => {
    const [fullName, setFullName] = useState(initialProfile.fullName || '');
    const [profileImageUrl, setProfileImageUrl] = useState(initialProfile.profileImageUrl || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setError('');
        onSave({ fullName, profileImageUrl });
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
                        <label>Profile Image URL</label>
                        <input
                            type="text"
                            value={profileImageUrl}
                            onChange={e => setProfileImageUrl(e.target.value)}
                        />
                        {profileImageUrl && (
                            <img src={profileImageUrl} alt="Profile Preview" className="profile-preview" />
                        )}
                    </div>
                    {error && <div className="form-error">{error}</div>}
                    <button type="submit" className="profile-save-btn" disabled={loading}>
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