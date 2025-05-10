import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './SettingsForm.css';

const SettingsForm = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
    const [storageUsed, setStorageUsed] = useState(0);
    const [loading, setLoading] = useState(false);
    const maxStorage = 1024; // 1GB in MB

    useEffect(() => {
        // Apply saved theme on component mount
        document.documentElement.setAttribute('data-theme', theme);
        calculateStorageUsed();
    }, []);

    const calculateStorageUsed = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/files/storage', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setStorageUsed(data.usedStorage);
            }
        } catch (error) {
            console.error('Failed to fetch storage usage:', error);
        }
    };

    const handleThemeChange = async (newTheme) => {
        setLoading(true);
        try {
            // Save theme preference
            localStorage.setItem('theme', newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
            setTheme(newTheme);
            toast.success('Theme updated successfully');
        } catch (error) {
            toast.error('Failed to update theme');
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = async (event) => {
        const newLanguage = event.target.value;
        setLoading(true);
        try {
            // Save language preference
            localStorage.setItem('language', newLanguage);
            setLanguage(newLanguage);
            toast.success('Language updated successfully');
        } catch (error) {
            toast.error('Failed to update language');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-container">
            <h2>Settings</h2>
            
            <section className="settings-section">
                <h3>Appearance</h3>
                <div className="theme-options">
                    <button 
                        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('light')}
                        disabled={loading}
                    >
                        Light Mode
                    </button>
                    <button 
                        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('dark')}
                        disabled={loading}
                    >
                        Dark Mode
                    </button>
                </div>
            </section>

            <section className="settings-section">
                <h3>Language</h3>
                <select 
                    value={language} 
                    onChange={handleLanguageChange}
                    className="language-select"
                    disabled={loading}
                >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                </select>
            </section>

            <section className="settings-section">
                <h3>Storage</h3>
                <div className="storage-meter">
                    <div 
                        className="storage-bar"
                        style={{ width: `${(storageUsed / maxStorage) * 100}%` }}
                    ></div>
                </div>
                <p className="storage-info">
                    {storageUsed}MB used of {maxStorage}MB
                    ({((storageUsed / maxStorage) * 100).toFixed(1)}%)
                </p>
            </section>
        </div>
    );
};

export default SettingsForm;
