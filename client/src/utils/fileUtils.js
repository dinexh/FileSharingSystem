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
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
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
    // Create a temporary URL with the token
    const url = getFileUrl(file);
    
    // For security reasons, we can't directly include Authorization headers when opening a new tab
    // But we can use a workaround to create a temporary form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = '_blank';
    
    // Add token as a hidden field
    const tokenField = document.createElement('input');
    tokenField.type = 'hidden';
    tokenField.name = 'token';
    tokenField.value = localStorage.getItem('token') || '';
    form.appendChild(tokenField);
    
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
};

/**
 * Download a file
 * @param {Object} file - The file object
 */
export const downloadFile = (file) => {
    if (!file) return;
    
    const url = getFileUrl(file, true);
    const token = localStorage.getItem('token');
    
    // Use fetch with authorization header and then create a downloadable blob
    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.blob())
    .then(blob => {
        // Create an object URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', file.originalName || file.fileName || 'download');
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        }, 100);
    })
    .catch(error => console.error('Error downloading file:', error));
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