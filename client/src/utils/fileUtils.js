/**
 * Utility functions for handling files in the application
 */

/**
 * Get the direct URL for a file
 * @param {Object} file - The file object
 * @param {boolean} forDownload - Whether the URL is for downloading or viewing
 * @returns {string} The URL for the file
 */
export const getFileUrl = (file, forDownload = false) => {
    if (!file || !file.id) return '';
    
    const baseUrl = 'http://localhost:8080/api/files';
    const endpoint = 'download'; // Using download for all cases as it's most reliable
    
    return `${baseUrl}/${endpoint}/${file.id}`;
};

/**
 * Get file as blob - useful for PDF.js and other viewers
 * @param {Object} file - The file object
 * @returns {Promise<Blob>} A promise that resolves to the file blob
 */
export const getFileBlob = async (file) => {
    try {
        const url = getFileUrl(file);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error fetching file: ${response.statusText}`);
        return await response.blob();
    } catch (error) {
        console.error('Error getting file blob:', error);
        throw error;
    }
};

/**
 * Open a file in a new tab
 * @param {Object} file - The file object
 */
export const viewFileInNewTab = (file) => {
    if (!file) return;
    const url = getFileUrl(file);
    window.open(url, '_blank');
};

/**
 * Download a file
 * @param {Object} file - The file object
 */
export const downloadFile = (file) => {
    if (!file) return;
    
    const url = getFileUrl(file, true);
    
    // For modern browsers
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.originalName || 'download');
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
};

/**
 * Check if a file can be previewed in the browser
 * @param {Object} file - The file object
 * @returns {boolean} Whether the file can be previewed
 */
export const canPreviewFile = (file) => {
    if (!file || !file.fileType) return false;
    
    const previewableTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'image/webp',
        'text/plain',
        'text/html',
        'text/csv'
    ];
    
    return previewableTypes.includes(file.fileType);
}; 