import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import defaultAvatar from '../../assets/default-avatar.svg';
import './Header.css';
import { FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Header = ({ userName, userProfileImage }) => {
    const { logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    const handleProfileClick = () => {
        setShowMenu(!showMenu);
    };

    const handleLogout = () => {
        logout();
    };

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

    return (
        <header className="dashboard-header">
            <div className="search-bar">
                <input type="text" placeholder="Search files..." />
            </div>
            <div className="user-profile-container">
                <div className="user-profile" onClick={handleProfileClick}>
                    <span className="user-name">{userName}</span>
                    <div className="profile-image-container">
                        <img 
                            src={getProfileImageUrl(userProfileImage)} 
                            alt="Profile" 
                            className="profile-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultAvatar;
                            }}
                        />
                    </div>
                    <FiChevronDown className="dropdown-icon" />
                </div>
                
                {showMenu && (
                    <div className="profile-dropdown">
                        <Link to="/dashboard/profile" className="dropdown-item">
                            <FiUser className="dropdown-icon" />
                            <span>Profile</span>
                        </Link>
                        <div className="dropdown-item" onClick={handleLogout}>
                            <FiLogOut className="dropdown-icon" />
                            <span>Logout</span>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header; 