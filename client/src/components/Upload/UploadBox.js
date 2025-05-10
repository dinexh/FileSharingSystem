import React, { useRef, useState } from 'react';
import './UploadBox.css';

const UploadBox = () => {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleBoxClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="upload-box-wrapper">
            <div
                className="upload-box"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleBoxClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <div className="upload-box-content">
                    <p className="upload-title">Drag a file here</p>
                    <p className="upload-or">Or, if you prefer...</p>
                    <button
                        type="button"
                        className="upload-select-btn"
                        onClick={e => { e.stopPropagation(); handleBoxClick(); }}
                    >
                        Select a file from your computer
                    </button>
                    {file && (
                        <div className="upload-preview">
                            <div className="file-icon">📦</div>
                            <div className="file-name">{file.name}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadBox; 