import React, { useState } from 'react';
import ProfileForm from '../../components/Profile/ProfileForm';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // This will be replaced with a real API call
    const handleSave = async (profileData) => {
        setLoading(true);
        try {
            // TODO: Call backend API to update profile
            // await api.updateProfile(profileData);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Edit Profile</h2>
            <ProfileForm initialProfile={user || {}} onSave={handleSave} loading={loading} />
        </div>
    );
};

export default ProfilePage; 