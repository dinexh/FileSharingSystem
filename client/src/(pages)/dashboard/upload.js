import React from 'react';
import { FiUpload } from 'react-icons/fi';
import UploadArea from '../../components/Upload/UploadArea';

const UploadPage = () => {
    return (
        <div className="dashboard-content-area">
            <div className="dashboard-page-header">
                <div className="page-header-icon">
                    <FiUpload size={24} />
                </div>
                <h1 className="page-header-title">Upload Files</h1>
                <p className="page-header-description">
                    Upload and share files with others
                </p>
            </div>
            
            <UploadArea />
        </div>
    );
};

export default UploadPage; 