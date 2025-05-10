import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FiHome, 
    FiFile, 
    FiUpload, 
    FiSettings, 
    FiUser, 
    FiLogOut,
    FiCloud
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { icon: <FiHome />, label: 'Home', path: '/dashboard' },
        { icon: <FiFile />, label: 'Files', path: '/dashboard/files' },
        { icon: <FiUpload />, label: 'Upload', path: '/dashboard/upload' },
        { icon: <FiSettings />, label: 'Settings', path: '/dashboard/settings' },
        { icon: <FiUser />, label: 'Profile', path: '/dashboard/profile' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/auth';
    };

    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
                <FiCloud className="logo-icon" />
                <h1 className="logo-text">FileShare</h1>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-button">
                    <FiLogOut />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar; 