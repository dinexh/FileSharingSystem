import React, { useState, useEffect } from 'react';
import './FilesList.css';
import { FiDownload, FiTrash2, FiEye, FiLock, FiUnlock, FiFilter, FiX, FiStar, FiShare2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PDFViewer from './PDFViewer';
import { downloadFile, viewFileInNewTab } from '../../utils/fileUtils';

const FilesList = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortField, setSortField] = useState('uploadDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [fileTypeFilter, setFileTypeFilter] = useState('all');
    const [viewingFile, setViewingFile] = useState(null);
    const [starredFiles, setStarredFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
        // Load starred files from localStorage
        const savedStarredFiles = localStorage.getItem('starredFiles');
        if (savedStarredFiles) {
            setStarredFiles(JSON.parse(savedStarredFiles));
        }
    }, []);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/files/with-details');
            
            if (!response.ok) {
                throw new Error(`Error fetching files: ${response.status}`);
            }
            
            const data = await response.json();
            setFiles(data);
            setError('');
        } catch (err) {
            console.error('Error fetching files:', err);
            setError('Failed to load files. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this file?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/files/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete: ${response.status}`);
            }

            // Update UI after successful delete
            setFiles(files.filter(file => file.id !== id));
            toast.success('File deleted successfully');
        } catch (err) {
            console.error('Error deleting file:', err);
            toast.error('Failed to delete file. Please try again.');
        }
    };

    const handleDownload = (file) => {
        downloadFile(file);
    };

    const handleViewFile = (file) => {
        console.log("Viewing file:", file.originalName, "Type:", file.fileType);
        setViewingFile(file);
    };

    const handleCloseViewer = () => {
        setViewingFile(null);
    };

    const getViewerContent = (file) => {
        const fileDownloadUrl = `http://localhost:8080/api/files/download/${file.id}`;
        
        // Handle PDFs with our dedicated PDFViewer component
        if (file.fileType === 'application/pdf') {
            return <PDFViewer file={file} />;
        }
        
        // Handle images directly
        if (file.fileType.startsWith('image/')) {
            return (
                <div className="image-viewer-container">
                    <img 
                        src={fileDownloadUrl} 
                        alt={file.originalName}
                        style={{ maxWidth: '100%', maxHeight: '100%', margin: 'auto', display: 'block' }}
                    />
                </div>
            );
        }
        
        // For other file types, show a direct download link instead of trying to embed
        return (
            <div className="file-viewer-download-container">
                <div className="file-icon-large">{getFileIcon(file.fileType)}</div>
                <p>This file type cannot be previewed directly.</p>
                <a 
                    href={fileDownloadUrl} 
                    download={file.originalName}
                    className="file-download-button"
                >
                    <FiDownload /> Download File
                </a>
            </div>
        );
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFileIcon = (fileType) => {
        const iconMap = {
            'application/pdf': '📄',
            'application/msword': '📝',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
            'application/vnd.ms-excel': '📊',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
            'application/vnd.ms-powerpoint': '📑',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📑',
            'text/plain': '📃',
            'text/csv': '📉',
            'image/jpeg': '🖼️',
            'image/png': '🖼️',
            'image/gif': '🖼️',
            'image/svg+xml': '🖼️',
            'audio/mpeg': '🎵',
            'video/mp4': '🎬',
            'application/zip': '🗜️',
            'application/x-rar-compressed': '🗜️',
            'application/x-msdownload': '⚙️',
            'application/json': '📋',
            'text/html': '🌐',
            'text/css': '🎨',
            'application/javascript': '📜'
        };
        
        return iconMap[fileType] || '📦';
    };

    const sortedFiles = [...files].sort((a, b) => {
        if (sortField === 'uploadDate') {
            const dateA = new Date(a.uploadDate);
            const dateB = new Date(b.uploadDate);
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortField === 'fileSize') {
            return sortDirection === 'asc' ? a.fileSize - b.fileSize : b.fileSize - a.fileSize;
        } else {
            const valueA = a[sortField]?.toString().toLowerCase() || '';
            const valueB = b[sortField]?.toString().toLowerCase() || '';
            return sortDirection === 'asc' 
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }
    });

    const filteredFiles = fileTypeFilter === 'all' 
        ? sortedFiles 
        : sortedFiles.filter(file => {
            if (fileTypeFilter === 'document') {
                return file.fileType?.includes('pdf') || 
                       file.fileType?.includes('word') || 
                       file.fileType?.includes('text') ||
                       file.fileType?.includes('doc');
            }
            if (fileTypeFilter === 'image') {
                return file.fileType?.includes('image');
            }
            if (fileTypeFilter === 'video') {
                return file.fileType?.includes('video');
            }
            if (fileTypeFilter === 'audio') {
                return file.fileType?.includes('audio');
            }
            if (fileTypeFilter === 'other') {
                return !file.fileType?.includes('pdf') && 
                       !file.fileType?.includes('word') && 
                       !file.fileType?.includes('text') &&
                       !file.fileType?.includes('doc') &&
                       !file.fileType?.includes('image') &&
                       !file.fileType?.includes('video') &&
                       !file.fileType?.includes('audio');
            }
            return true;
        });

    const handleToggleStar = (fileId) => {
        const newStarredFiles = starredFiles.includes(fileId)
            ? starredFiles.filter(id => id !== fileId)
            : [...starredFiles, fileId];
        
        setStarredFiles(newStarredFiles);
        localStorage.setItem('starredFiles', JSON.stringify(newStarredFiles));
        
        toast.success(
            starredFiles.includes(fileId) 
                ? 'File removed from starred' 
                : 'File added to starred'
        );
    };

    const handleShare = (file) => {
        // For now, just show a toast - full share functionality will be implemented later
        toast.info('Share functionality coming soon!');
    };

    if (loading) {
        return (
            <div className="files-loading">
                <div className="files-loader"></div>
                <p>Loading files...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="files-error">
                <p>{error}</p>
                <button onClick={fetchFiles} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <div className="no-files">
                <div className="no-files-icon">📂</div>
                <h2>No files found</h2>
                <p>Upload some files to see them here</p>
            </div>
        );
    }

    return (
        <>
            {viewingFile && (
                <div className="file-viewer-overlay">
                    <div className="file-viewer-container">
                        <div className="file-viewer-header">
                            <div className="file-viewer-title">
                                <span className="file-icon">{getFileIcon(viewingFile.fileType)}</span>
                                <h3>{viewingFile.originalName}</h3>
                            </div>
                            <button className="close-viewer-btn" onClick={handleCloseViewer}>
                                <FiX />
                            </button>
                        </div>
                        <div className="file-viewer-content">
                            {getViewerContent(viewingFile)}
                        </div>
                    </div>
                </div>
            )}

            <div className="files-list-container">
                <div className="files-toolbar">
                    <div className="files-filter">
                        <FiFilter className="filter-icon" />
                        <label>Filter by type:</label>
                        <select 
                            value={fileTypeFilter} 
                            onChange={(e) => setFileTypeFilter(e.target.value)}
                        >
                            <option value="all">All Files</option>
                            <option value="document">Documents</option>
                            <option value="image">Images</option>
                            <option value="video">Videos</option>
                            <option value="audio">Audio</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <button onClick={fetchFiles} className="refresh-button">
                        Refresh
                    </button>
                </div>

                <div className="files-table-container">
                    <table className="files-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th onClick={() => handleSort('originalName')} className={sortField === 'originalName' ? `sorted ${sortDirection}` : ''}>
                                    File Name
                                    {sortField === 'originalName' && <span className="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                                </th>
                                <th onClick={() => handleSort('fileSize')} className={sortField === 'fileSize' ? `sorted ${sortDirection}` : ''}>
                                    Size
                                    {sortField === 'fileSize' && <span className="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                                </th>
                                <th onClick={() => handleSort('uploadDate')} className={sortField === 'uploadDate' ? `sorted ${sortDirection}` : ''}>
                                    Upload Date
                                    {sortField === 'uploadDate' && <span className="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                                </th>
                                <th onClick={() => handleSort('ownerName')} className={sortField === 'ownerName' ? `sorted ${sortDirection}` : ''}>
                                    Owner
                                    {sortField === 'ownerName' && <span className="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                                </th>
                                <th>Access</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFiles.map((file) => (
                                <tr key={file.id}>
                                    <td className="file-type-cell">
                                        <span className="file-icon">{getFileIcon(file.fileType)}</span>
                                    </td>
                                    <td className="file-name-cell">
                                        <span className="file-name">{file.originalName}</span>
                                    </td>
                                    <td>{formatFileSize(file.fileSize)}</td>
                                    <td>{formatDate(file.uploadDate)}</td>
                                    <td className="owner-cell">
                                        <div className="owner-info">
                                            <span>{file.ownerName}</span>
                                        </div>
                                    </td>
                                    <td className="access-cell">
                                        {file.isPublic ? (
                                            <span className="access-public">
                                                <FiUnlock /> Public
                                            </span>
                                        ) : (
                                            <span className="access-private">
                                                <FiLock /> Private
                                            </span>
                                        )}
                                    </td>
                                    <td className="actions-cell">
                                        <button 
                                            className={`file-action-btn star ${starredFiles.includes(file.id) ? 'starred' : ''}`}
                                            title={starredFiles.includes(file.id) ? "Remove from starred" : "Add to starred"}
                                            onClick={() => handleToggleStar(file.id)}
                                        >
                                            <FiStar />
                                        </button>
                                        <button 
                                            className="file-action-btn view" 
                                            title="View file"
                                            onClick={() => handleViewFile(file)}
                                        >
                                            <FiEye />
                                        </button>
                                        <button 
                                            className="file-action-btn download" 
                                            title="Download"
                                            onClick={() => handleDownload(file)}
                                        >
                                            <FiDownload />
                                        </button>
                                        <button 
                                            className="file-action-btn share" 
                                            title="Share"
                                            onClick={() => handleShare(file)}
                                        >
                                            <FiShare2 />
                                        </button>
                                        <button 
                                            className="file-action-btn delete" 
                                            title="Delete"
                                            onClick={() => handleDelete(file.id)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default FilesList; 