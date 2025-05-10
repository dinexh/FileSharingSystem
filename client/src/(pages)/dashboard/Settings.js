import React from 'react';
import SettingsForm from '../../components/Settings/SettingsForm';
import { FiSettings } from 'react-icons/fi';

const SettingsPage = () => {
    return (
        <div className="dashboard-content-area">
            <div className="dashboard-page-header">
                <div className="page-header-icon">
                    <FiSettings size={24} />
                </div>
                <h1 className="page-header-title">Settings</h1>
                <p className="page-header-description">
                    Customize your application preferences and appearance
                </p>
            </div>
            <SettingsForm />
        </div>
    );
};

export default SettingsPage;