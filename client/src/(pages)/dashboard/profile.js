import React, { useState } from 'react';
import ProfileForm from '../../components/Profile/ProfileForm';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    // Update profile info (name, image)
    const handleSave = async (profileData) => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    fullName: profileData.fullName,
                    profileImageUrl: profileData.profileImageUrl
                })
            });
            if (res.ok) {
                const updatedUser = await res.json();
                // Update user context (keep token)
                login(updatedUser, localStorage.getItem('token'));
                toast.success('Profile updated successfully!');
            } else {
                toast.error('Failed to update profile.');
            }
        } catch (err) {
            toast.error('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    // Update password
    const handleSavePassword = async ({ password }) => {
        setLoadingPassword(true);
        try {
            const res = await fetch('http://localhost:8080/api/users/profile/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ password })
            });
            if (res.ok) {
                toast.success('Password updated successfully!');
            } else {
                toast.error('Failed to update password.');
            }
        } catch (err) {
            toast.error('Failed to update password.');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Edit Profile</h2>
            <ProfileForm
                initialProfile={user || {}}
                onSave={handleSave}
                onSavePassword={handleSavePassword}
                loading={loading}
                loadingPassword={loadingPassword}
            />
        </div>
    );
};

export default ProfilePage; 