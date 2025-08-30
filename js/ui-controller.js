/**
 * UI Controller for MegaTagsChecker Popup
 * Main controller that orchestrates all UI interactions and module communications
 */

document.addEventListener('DOMContentLoaded', function() {
    // Store the current meta tags data for export
    let currentMetaData = null;

    // UI State Management
    const UI = {
        // Core elements
        loading: document.getElementById('loading'),
        content: document.getElementById('content'),
        error: document.getElementById('error'),
        currentUrl: document.getElementById('current-url'),
        
        // Controls
        refreshBtn: document.getElementById('refresh-btn'),
        exportCsvBtn: document.getElementById('export-csv-btn'),
        exportPdfBtn: document.getElementById('export-pdf-btn'),
        
        // Tab elements
        defaultTab: document.getElementById('default-tab'),
        advancedTab: document.getElementById('advanced-tab'),
        defaultContent: document.getElementById('default-content'),
        advancedContent: document.getElementById('advanced-content'),

        // Default tags elements
        elements: {
            titleValue: document.getElementById('title-value'),
            titleCount: document.getElementById('title-count'),
            descriptionValue: document.getElementById('description-value'),
            descriptionCount: document.getElementById('description-count'),
            keywordsValue: document.getElementById('keywords-value'),
            keywordsCount: document.getElementById('keywords-count'),
            viewportValue: document.getElementById('viewport-value'),
            viewportCount: document.getElementById('viewport-count'),
            robotsValue: document.getElementById('robots-value'),
            robotsCount: document.getElementById('robots-count'),
            authorValue: document.getElementById('author-value'),
            authorCount: document.getElementById('author-count'),
            canonicalValue: document.getElementById('canonical-value'),
            canonicalCount: document.getElementById('canonical-count')
        },

        // Advanced tags elements
        advancedElements: {
            ogTitle: document.getElementById('og-title-value'),
            ogTitleCount: document.getElementById('og-title-count'),
            ogDescription: document.getElementById('og-description-value'),
            ogDescriptionCount: document.getElementById('og-description-count'),
            ogImage: document.getElementById('og-image-value'),
            ogImageCount: document.getElementById('og-image-count'),
            ogUrl: document.getElementById('og-url-value'),
            ogType: document.getElementById('og-type-value'),
            ogSiteName: document.getElementById('og-site-name-value'),
            twitterCard: document.getElementById('twitter-card-value'),
            twitterTitle: document.getElementById('twitter-title-value'),
            twitterDescription: document.getElementById('twitter-description-value'),
            twitterImage: document.getElementById('twitter-image-value'),
            twitterSite: document.getElementById('twitter-site-value'),
            language: document.getElementById('language-value'),
            publisher: document.getElementById('publisher-value'),
            generator: document.getElementById('generator-value'),
            favicon: document.getElementById('favicon-value'),
            appleTouchIcon: document.getElementById('apple-touch-icon-value'),
            manifest: document.getElementById('manifest-value'),
            dnsPrefetch: document.getElementById('dns-prefetch-value'),
            preconnect: document.getElementById('preconnect-value'),
            preload: document.getElementById('preload-value'),
            structuredData: document.getElementById('structured-data-value'),
            structuredDataCount: document.getElementById('structured-data-count')
        }
    };

    // Initialize the extension
    init();
    
    // Initially disable export buttons
    UI.exportCsvBtn.disabled = true;
    UI.exportPdfBtn.disabled = true;

    // Event Listeners
    setupEventListeners();

    /**
     * Set up all event listeners for UI interactions
     */
    function setupEventListeners() {
        // Tab switching
        UI.defaultTab.addEventListener('click', () => switchTab('default'));
        UI.advancedTab.addEventListener('click', () => switchTab('advanced'));

        // Refresh functionality with debouncing
        const debouncedRefresh = debounce(() => {
            showLoading();
            setTimeout(init, 300); // Small delay for better UX
        }, 500);
        
        UI.refreshBtn.addEventListener('click', debouncedRefresh);

        // Export functionality
        UI.exportCsvBtn.addEventListener('click', handleCSVExport);
        UI.exportPdfBtn.addEventListener('click', handlePDFExport);
    }

    /**
     * Handle CSV export with error handling
     */
    function handleCSVExport() {
        if (currentMetaData) {
            try {
                exportToCSV(currentMetaData);
            } catch (error) {
                console.error('CSV Export Error:', error);
                showTemporaryMessage('Export failed. Please try again.');
            }
        }
    }

    /**
     * Handle PDF export with loading state and error handling
     */
    function handlePDFExport() {
        if (currentMetaData) {
            try {
                // Show loading state
                setExportButtonLoading(true);
                exportToPDF(currentMetaData);
                
                // Reset button after delay
                setTimeout(() => setExportButtonLoading(false), 3000);
            } catch (error) {
                console.error('PDF Export Error:', error);
                setExportButtonLoading(false);
                showTemporaryMessage('PDF export failed. Please try again.');
            }
        }
    }

    /**
     * Set PDF export button loading state
     * @param {boolean} isLoading - Whether button should show loading state
     */
    function setExportButtonLoading(isLoading) {
        if (isLoading) {
            UI.exportPdfBtn.disabled = true;
            UI.exportPdfBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Generating...
            `;
        } else {
            UI.exportPdfBtn.disabled = false;
            UI.exportPdfBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Export PDF
            `;
        }
    }

    /**
     * Switch between default and advanced tabs
     * @param {string} tabName - Name of the tab to switch to
     */
    function switchTab(tabName) {
        if (tabName === 'default') {
            UI.defaultTab.classList.add('active');
            UI.advancedTab.classList.remove('active');
            UI.defaultContent.classList.add('active');
            UI.advancedContent.classList.remove('active');
        } else {
            UI.advancedTab.classList.add('active');
            UI.defaultTab.classList.remove('active');
            UI.advancedContent.classList.add('active');
            UI.defaultContent.classList.remove('active');
        }
    }

    /**
     * Initialize the extension
     */
    function init() {
        showLoading();
        getMetaTagsFromCurrentTab();
    }

    /**
     * Show loading state
     */
    function showLoading() {
        UI.loading.style.display = 'flex';
        UI.content.style.display = 'none';
        UI.error.style.display = 'none';
    }

    /**
     * Show content state
     */
    function showContent() {
        UI.loading.style.display = 'none';
        UI.content.style.display = 'block';
        UI.error.style.display = 'none';
    }

    /**
     * Show error state
     */
    function showError() {
        UI.loading.style.display = 'none';
        UI.content.style.display = 'none';
        UI.error.style.display = 'flex';
    }

    /**
     * Get meta tags from the current active tab
     */
    function getMetaTagsFromCurrentTab() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0]) {
                // Check if we can access the tab
                if (isRestrictedTab(tabs[0].url)) {
                    showError();
                    return;
                }

                chrome.tabs.sendMessage(tabs[0].id, { action: 'getMetaTags' }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.error('Error:', chrome.runtime.lastError);
                        showError();
                        return;
                    }

                    if (response) {
                        displayMetaTags(response);
                        showContent();
                    } else {
                        showError();
                    }
                });
            } else {
                showError();
            }
        });
    }

    /**
     * Check if the tab URL is restricted
     * @param {string} url - Tab URL to check
     * @returns {boolean} True if restricted
     */
    function isRestrictedTab(url) {
        return url.startsWith('chrome://') || 
               url.startsWith('chrome-extension://') ||
               url.startsWith('edge://') ||
               url.startsWith('about:');
    }

    /**
     * Display meta tags data using the display manager
     * @param {Object} metaTags - Meta tags data from content script
     */
    function displayMetaTags(metaTags) {
        try {
            // Store meta data for export
            currentMetaData = metaTags;
            
            // Calculate SEO audit score
            currentMetaData.seoAudit = calculateSEOScore(metaTags);
            
            // Enable export buttons
            UI.exportCsvBtn.disabled = false;
            UI.exportPdfBtn.disabled = false;
            
            // Display URL
            UI.currentUrl.textContent = metaTags.url || 'Unknown URL';

            // Display tags using the display manager
            displayDefaultTags(metaTags.defaultTags, UI.elements);
            displayAdvancedTags(metaTags.advancedTags, UI.advancedElements);
            
        } catch (error) {
            console.error('Error displaying meta tags:', error);
            showError();
        }
    }

    /**
     * Show a temporary message to the user
     * @param {string} message - Message to display
     */
    function showTemporaryMessage(message) {
        // Create a temporary message element
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc2626;
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(messageEl);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }
});