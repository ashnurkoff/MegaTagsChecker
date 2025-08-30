document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = document.getElementById('loading');
    const contentElement = document.getElementById('content');
    const errorElement = document.getElementById('error');
    const refreshBtn = document.getElementById('refresh-btn');

    // Elements for displaying meta tag data
    const titleValue = document.getElementById('title-value');
    const titleCount = document.getElementById('title-count');
    const descriptionValue = document.getElementById('description-value');
    const descriptionCount = document.getElementById('description-count');
    const keywordsValue = document.getElementById('keywords-value');
    const keywordsCount = document.getElementById('keywords-count');
    const currentUrl = document.getElementById('current-url');

    // Initialize the extension
    init();

    // Refresh button event listener
    refreshBtn.addEventListener('click', function() {
        showLoading();
        setTimeout(init, 300); // Small delay for better UX
    });

    function init() {
        showLoading();
        getMetaTagsFromCurrentTab();
    }

    function showLoading() {
        loadingElement.style.display = 'flex';
        contentElement.style.display = 'none';
        errorElement.style.display = 'none';
    }

    function showContent() {
        loadingElement.style.display = 'none';
        contentElement.style.display = 'block';
        errorElement.style.display = 'none';
    }

    function showError() {
        loadingElement.style.display = 'none';
        contentElement.style.display = 'none';
        errorElement.style.display = 'flex';
    }

    function getMetaTagsFromCurrentTab() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0]) {
                // Check if we can access the tab
                if (tabs[0].url.startsWith('chrome://') || 
                    tabs[0].url.startsWith('chrome-extension://') ||
                    tabs[0].url.startsWith('edge://') ||
                    tabs[0].url.startsWith('about:')) {
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

    function displayMetaTags(metaTags) {
        // Display URL
        currentUrl.textContent = metaTags.url || 'Unknown URL';

        // Display Title
        displayMetaItem(
            titleValue, 
            titleCount, 
            metaTags.title, 
            'title',
            { ideal: [50, 60], max: 70 }
        );

        // Display Description
        displayMetaItem(
            descriptionValue, 
            descriptionCount, 
            metaTags.description, 
            'description',
            { ideal: [150, 160], max: 200 }
        );

        // Display Keywords
        displayKeywords(metaTags.keywords);
    }

    function displayMetaItem(valueElement, countElement, content, type, limits) {
        if (content && content.trim()) {
            valueElement.innerHTML = escapeHtml(content.trim());
            valueElement.classList.add('has-content');
            
            const length = content.trim().length;
            countElement.textContent = `${length} characters`;
            
            // Apply styling based on length
            countElement.className = 'meta-count';
            if (type === 'title' || type === 'description') {
                if (length >= limits.ideal[0] && length <= limits.ideal[1]) {
                    countElement.classList.add('good');
                } else if (length <= limits.max) {
                    countElement.classList.add('warning');
                } else {
                    countElement.classList.add('error');
                }
            }
        } else {
            valueElement.innerHTML = `<span class="placeholder">No ${type} found</span>`;
            valueElement.classList.remove('has-content');
            countElement.textContent = '0 characters';
            countElement.className = 'meta-count';
        }
    }

    function displayKeywords(keywords) {
        if (keywords && keywords.trim()) {
            const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
            
            if (keywordArray.length > 0) {
                const keywordsHtml = keywordArray.map(keyword => 
                    `<span class="keyword-tag">${escapeHtml(keyword)}</span>`
                ).join('');
                
                keywordsValue.innerHTML = `<div class="keywords-container">${keywordsHtml}</div>`;
                keywordsValue.classList.add('has-content');
                keywordsCount.textContent = `${keywordArray.length} keywords`;
                keywordsCount.className = 'meta-count good';
            } else {
                displayNoKeywords();
            }
        } else {
            displayNoKeywords();
        }
    }

    function displayNoKeywords() {
        keywordsValue.innerHTML = '<span class="placeholder">No keywords found</span>';
        keywordsValue.classList.remove('has-content');
        keywordsCount.textContent = '0 keywords';
        keywordsCount.className = 'meta-count';
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});