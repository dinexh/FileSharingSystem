import React from 'react';
import UploadBox from '../../components/Upload/UploadBox';
import { FiUploadCloud } from 'react-icons/fi';

const UploadPage = () => {
    return (
        <div className="dashboard-content-area">
            <div className="dashboard-page-header">
                <div className="page-header-icon">
                    <FiUploadCloud size={24} />
                </div>
                <h1 className="page-header-title">Upload Files</h1>
                <p className="page-header-description">
                    Upload and share files with others
                </p>
            </div>
            <UploadBox />
        </div>
    );
};

export default UploadPage; 