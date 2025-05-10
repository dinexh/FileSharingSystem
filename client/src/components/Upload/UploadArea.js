import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import './UploadArea.css';

const UploadArea = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files) => {
        // For simplicity, just handle the first file
        setSelectedFile({
            file: files[0],
            name: files[0].name,
            size: files[0].size,
            type: files[0].type,
            progress: 0,
            status: 'pending'
        });
        
        // Simulate upload progress
        simulateUpload();
    };

    const simulateUpload = () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress <= 100) {
                setSelectedFile(prev => ({
                    ...prev,
                    progress,
                    status: progress === 100 ? 'completed' : 'uploading'
                }));
            } else {
                clearInterval(interval);
            }
        }, 500);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const cancelUpload = () => {
        setSelectedFile(null);
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="upload-container">
            <div 
                className={`upload-area ${isDragging ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
            >
                <FiUploadCloud className="upload-icon" />
                <h2 className="upload-text">Drag a file here</h2>
                <p className="upload-subtext">Or, if you prefer...</p>
                <button className="upload-button">Select a file from your computer</button>
                <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </div>

            {selectedFile && (
                <div className="upload-progress-container">
                    <div className="upload-progress-item">
                        <div className="upload-progress-info">
                            <div className="upload-progress-filename">{selectedFile.name}</div>
                            <div className="upload-progress-bar-container">
                                <div 
                                    className="upload-progress-bar" 
                                    style={{ width: `${selectedFile.progress}%` }}
                                ></div>
                            </div>
                            <div className="upload-progress-status">
                                <span className="upload-progress-percentage">{selectedFile.progress}%</span>
                                <span className="upload-progress-filesize">{formatBytes(selectedFile.size)}</span>
                            </div>
                        </div>
                        <div className="upload-progress-actions">
                            <button 
                                className="upload-cancel-btn"
                                onClick={cancelUpload}
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadArea; 