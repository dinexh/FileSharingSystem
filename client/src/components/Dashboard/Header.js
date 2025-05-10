import React from 'react';
import { useAuth } from '../../context/AuthContext';
import defaultAvatar from '../../assets/default-avatar.svg';
import './Header.css';

const Header = ({ userName, userProfileImage }) => {
    const { logout } = useAuth();

    return (
        <header className="dashboard-header">
            <div className="search-bar">
                <input type="text" placeholder="Search files..." />
            </div>
            <div className="user-profile" onClick={logout}>
                <span className="user-name">{userName}</span>
                <img 
                    src={userProfileImage || defaultAvatar} 
                    alt="Profile" 
                    className="profile-image"
                />
            </div>
        </header>
    );
};

export default Header; 