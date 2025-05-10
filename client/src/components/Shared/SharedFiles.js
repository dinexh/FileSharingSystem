import React, { useState } from 'react';
import { FiFileText, FiUsers, FiUserCheck } from 'react-icons/fi';
import './SharedFiles.css';

const SharedFiles = () => {
    const [activeTab, setActiveTab] = useState('with-me');

    // This is just a placeholder component since the actual functionality
    // will be implemented later as mentioned in the requirements
    return (
        <div className="shared-files-container">
            <div className="shared-tabs">
                <button 
                    className={`shared-tab ${activeTab === 'with-me' ? 'active' : ''}`}
                    onClick={() => setActiveTab('with-me')}
                >
                    <FiUsers className="tab-icon" />
                    <span>Shared with me</span>
                </button>
                <button 
                    className={`shared-tab ${activeTab === 'by-me' ? 'active' : ''}`}
                    onClick={() => setActiveTab('by-me')}
                >
                    <FiUserCheck className="tab-icon" />
                    <span>Shared by me</span>
                </button>
            </div>

            <div className="shared-content">
                <div className="empty-state">
                    <FiFileText className="empty-icon" size={48} />
                    <h3>No shared files yet</h3>
                    <p>
                        {activeTab === 'with-me' 
                            ? 'Files shared with you will appear here' 
                            : 'Files you share with others will appear here'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SharedFiles; 