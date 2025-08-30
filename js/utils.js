/**
 * Utility functions for MegaTagsChecker
 */

/**
 * Escapes HTML characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML string
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Creates a filename-safe version of a URL
 * @param {string} url - URL to convert
 * @returns {string} Filename-safe string
 */
function getFilenameSafeUrl(url) {
    if (!url) return 'unknown-site';
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace(/[^a-zA-Z0-9]/g, '-');
    } catch {
        return url.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50);
    }
}

/**
 * Generates a timestamp string for filenames
 * @returns {string} Timestamp in YYYYMMDD-HHMM format
 */
function getTimestamp() {
    const now = new Date();
    return now.getFullYear() + 
           String(now.getMonth() + 1).padStart(2, '0') + 
           String(now.getDate()).padStart(2, '0') + '-' +
           String(now.getHours()).padStart(2, '0') + 
           String(now.getMinutes()).padStart(2, '0');
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        escapeHtml,
        getFilenameSafeUrl,
        getTimestamp,
        debounce
    };
}