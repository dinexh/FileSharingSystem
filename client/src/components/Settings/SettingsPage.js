import React, { useState, useEffect } from 'react';
import { 
    FiMoon, 
    FiSun, 
    FiGlobe, 
    FiBell, 
    FiTrash2, 
    FiUser, 
    FiEye
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './SettingsPage.css';

const SettingsPage = () => {
    const { theme, toggleTheme } = useTheme();
    const [language, setLanguage] = useState('english');
    const [notifications, setNotifications] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'english';
        setLanguage(savedLanguage);
        
        const notifSetting = localStorage.getItem('notifications');
        setNotifications(notifSetting === null ? true : notifSetting === 'true');
    }, []);

    const handleThemeChange = (newTheme) => {
        toggleTheme(newTheme);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        localStorage.setItem('language', e.target.value);
    };

    const handleNotificationToggle = () => {
        setNotifications(!notifications);
        localStorage.setItem('notifications', !notifications);
    };

    const handleDeleteAccountClick = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setConfirmText('');
    };

    const confirmDeleteAccount = () => {
        if (confirmText !== 'DELETE') {
            return;
        }
        
        setIsLoading(true);
        
        // API call would go here
        setTimeout(() => {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
            // Redirect to login
            // window.location.href = '/auth';
        }, 1500);
    };

    return (
        <div className="settings-container">
            {/* Theme Settings */}
            <div className="settings-section">
                <h2><FiEye /> Appearance</h2>
                <div className="settings-content">
                    <div className="theme-selector">
                        <button 
                            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('light')}
                        >
                            <FiSun />
                            <span>Light Mode</span>
                        </button>
                        <button 
                            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('dark')}
                        >
                            <FiMoon />
                            <span>Dark Mode</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Language and Notification Settings Grid */}
            <div className="settings-grid">
                {/* Notification Settings */}
                <div className="settings-section">
                    <h2><FiBell /> Notifications</h2>
                    <div className="settings-content">
                        <div className="notification-setting">
                            <div className="notification-details">
                                <div className="notification-icon">
                                    <FiBell />
                                </div>
                                <div>
                                    <h3>Email Notifications</h3>
                                    <p>Receive emails for file shares, comments, and system updates</p>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input 
                                    type="checkbox" 
                                    checked={notifications} 
                                    onChange={handleNotificationToggle}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="settings-section">
                <h2><FiUser /> Account</h2>
                <div className="settings-content">
                    <div className="danger-zone">
                        <h3>Danger Zone</h3>
                        <button 
                            className="delete-account-btn" 
                            onClick={handleDeleteAccountClick}
                        >
                            <FiTrash2 />
                            <span>Delete Account</span>
                        </button>
                        <p className="warning-text">
                            This action cannot be undone. All your files and data will be permanently deleted.
                        </p>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>Delete Account</h2>
                        </div>
                        <div className="modal-content">
                            <div className="warning-icon">
                                <FiTrash2 />
                            </div>
                            <p className="modal-text">
                                Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your files and data.
                            </p>
                            <div className="confirmation-input">
                                <label>Type "DELETE" to confirm:</label>
                                <input 
                                    type="text" 
                                    placeholder="DELETE" 
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={closeDeleteModal}>
                                Cancel
                            </button>
                            <button 
                                className={`confirm-delete-btn ${isLoading ? 'loading' : ''}`} 
                                onClick={confirmDeleteAccount}
                                disabled={isLoading || confirmText !== 'DELETE'}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loader"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Account"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage; 