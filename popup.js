document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = document.getElementById('loading');
    const contentElement = document.getElementById('content');
    const errorElement = document.getElementById('error');
    const refreshBtn = document.getElementById('refresh-btn');

    // Tab elements
    const defaultTab = document.getElementById('default-tab');
    const advancedTab = document.getElementById('advanced-tab');
    const defaultContent = document.getElementById('default-content');
    const advancedContent = document.getElementById('advanced-content');

    // Elements for displaying meta tag data - Default Tags
    const titleValue = document.getElementById('title-value');
    const titleCount = document.getElementById('title-count');
    const descriptionValue = document.getElementById('description-value');
    const descriptionCount = document.getElementById('description-count');
    const keywordsValue = document.getElementById('keywords-value');
    const keywordsCount = document.getElementById('keywords-count');
    const viewportValue = document.getElementById('viewport-value');
    const viewportCount = document.getElementById('viewport-count');
    const robotsValue = document.getElementById('robots-value');
    const robotsCount = document.getElementById('robots-count');
    const authorValue = document.getElementById('author-value');
    const authorCount = document.getElementById('author-count');
    const canonicalValue = document.getElementById('canonical-value');
    const canonicalCount = document.getElementById('canonical-count');
    const currentUrl = document.getElementById('current-url');

    // Elements for Advanced Tags
    const advancedElements = {
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
    };

    // Initialize the extension
    init();

    // Tab switching
    defaultTab.addEventListener('click', function() {
        switchTab('default');
    });

    advancedTab.addEventListener('click', function() {
        switchTab('advanced');
    });

    // Refresh button event listener
    refreshBtn.addEventListener('click', function() {
        showLoading();
        setTimeout(init, 300); // Small delay for better UX
    });

    function switchTab(tabName) {
        if (tabName === 'default') {
            defaultTab.classList.add('active');
            advancedTab.classList.remove('active');
            defaultContent.classList.add('active');
            advancedContent.classList.remove('active');
        } else {
            advancedTab.classList.add('active');
            defaultTab.classList.remove('active');
            advancedContent.classList.add('active');
            defaultContent.classList.remove('active');
        }
    }

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

        // Display Default Tags
        displayDefaultTags(metaTags.defaultTags);
        
        // Display Advanced Tags
        displayAdvancedTags(metaTags.advancedTags);
    }

    function displayDefaultTags(defaultTags) {
        // Title
        displayMetaItem(
            titleValue, 
            titleCount, 
            defaultTags.title, 
            'title',
            { ideal: [50, 60], max: 70 }
        );

        // Description
        displayMetaItem(
            descriptionValue, 
            descriptionCount, 
            defaultTags.description, 
            'description',
            { ideal: [150, 160], max: 200 }
        );

        // Keywords
        displayKeywords(defaultTags.keywords);

        // Viewport
        displaySimpleMetaItem(viewportValue, viewportCount, defaultTags.viewport, 'viewport');

        // Robots
        displaySimpleMetaItem(robotsValue, robotsCount, defaultTags.robots, 'robots directive');

        // Author
        displaySimpleMetaItem(authorValue, authorCount, defaultTags.author, 'author');

        // Canonical URL
        displayUrlMetaItem(canonicalValue, canonicalCount, defaultTags.canonical, 'canonical URL');
    }

    function displayAdvancedTags(advancedTags) {
        // Open Graph Tags
        displayMetaItem(advancedElements.ogTitle, advancedElements.ogTitleCount, advancedTags.ogTitle, 'og-title', { ideal: [50, 60], max: 70 });
        displayMetaItem(advancedElements.ogDescription, advancedElements.ogDescriptionCount, advancedTags.ogDescription, 'og-description', { ideal: [150, 155], max: 200 });
        displayUrlMetaItem(advancedElements.ogImage, advancedElements.ogImageCount, advancedTags.ogImage, 'OG image');
        displayUrlMetaItem(advancedElements.ogUrl, null, advancedTags.ogUrl, 'OG URL');
        displaySimpleMetaItem(advancedElements.ogType, null, advancedTags.ogType, 'OG type');
        displaySimpleMetaItem(advancedElements.ogSiteName, null, advancedTags.ogSiteName, 'OG site name');

        // Twitter Cards
        displaySimpleMetaItem(advancedElements.twitterCard, null, advancedTags.twitterCard, 'Twitter card');
        displaySimpleMetaItem(advancedElements.twitterTitle, null, advancedTags.twitterTitle, 'Twitter title');
        displayMetaItem(advancedElements.twitterDescription, null, advancedTags.twitterDescription, 'twitter-description', { ideal: [150, 200], max: 250 });
        displayUrlMetaItem(advancedElements.twitterImage, null, advancedTags.twitterImage, 'Twitter image');
        displaySimpleMetaItem(advancedElements.twitterSite, null, advancedTags.twitterSite, 'Twitter site');

        // Additional SEO
        displaySimpleMetaItem(advancedElements.language, null, advancedTags.language, 'language');
        displaySimpleMetaItem(advancedElements.publisher, null, advancedTags.publisher, 'publisher');
        displaySimpleMetaItem(advancedElements.generator, null, advancedTags.generator, 'generator');

        // Icons & Manifest
        displayUrlMetaItem(advancedElements.favicon, null, advancedTags.favicon, 'favicon');
        displayUrlMetaItem(advancedElements.appleTouchIcon, null, advancedTags.appleTouchIcon, 'Apple touch icon');
        displayUrlMetaItem(advancedElements.manifest, null, advancedTags.manifest, 'web manifest');

        // Performance
        displayArrayMetaItem(advancedElements.dnsPrefetch, null, advancedTags.dnsPrefetch, 'DNS prefetch');
        displayArrayMetaItem(advancedElements.preconnect, null, advancedTags.preconnect, 'preconnect');
        displayArrayMetaItem(advancedElements.preload, null, advancedTags.preload, 'preload');

        // Structured Data
        displayStructuredData(advancedElements.structuredData, advancedElements.structuredDataCount, advancedTags.structuredData);
    }

    function displayMetaItem(valueElement, countElement, content, type, limits) {
        if (content && content.trim()) {
            valueElement.innerHTML = escapeHtml(content.trim());
            valueElement.classList.add('has-content');
            
            if (countElement) {
                const length = content.trim().length;
                countElement.textContent = `${length} characters`;
                
                // Apply styling based on length
                countElement.className = 'meta-count';
                if (limits && (type === 'title' || type === 'description' || type === 'og-title' || type === 'og-description' || type === 'twitter-description')) {
                    if (length >= limits.ideal[0] && length <= limits.ideal[1]) {
                        countElement.classList.add('good');
                    } else if (length <= limits.max) {
                        countElement.classList.add('warning');
                    } else {
                        countElement.classList.add('error');
                    }
                }
            }
        } else {
            const typeName = type.replace('-', ' ');
            valueElement.innerHTML = `<span class="placeholder">No ${typeName} found</span>`;
            valueElement.classList.remove('has-content');
            if (countElement) {
                countElement.textContent = '0 characters';
                countElement.className = 'meta-count';
            }
        }
    }

    function displaySimpleMetaItem(valueElement, countElement, content, typeName) {
        if (content && content.trim()) {
            valueElement.innerHTML = escapeHtml(content.trim());
            valueElement.classList.add('has-content');
            if (countElement) {
                countElement.textContent = 'Present';
                countElement.className = 'meta-count good';
            }
        } else {
            valueElement.innerHTML = `<span class="placeholder">No ${typeName} found</span>`;
            valueElement.classList.remove('has-content');
            if (countElement) {
                countElement.textContent = 'Missing';
                countElement.className = 'meta-count';
            }
        }
    }

    function displayUrlMetaItem(valueElement, countElement, content, typeName) {
        if (content && content.trim()) {
            // Create a clickable link if it's a valid URL
            const isValidUrl = content.startsWith('http://') || content.startsWith('https://') || content.startsWith('//');
            if (isValidUrl) {
                valueElement.innerHTML = `<a href="${escapeHtml(content)}" target="_blank" style="color: #667eea; text-decoration: underline;">${escapeHtml(content)}</a>`;
            } else {
                valueElement.innerHTML = escapeHtml(content);
            }
            valueElement.classList.add('has-content');
            if (countElement) {
                countElement.textContent = 'Present';
                countElement.className = 'meta-count good';
            }
        } else {
            valueElement.innerHTML = `<span class="placeholder">No ${typeName} found</span>`;
            valueElement.classList.remove('has-content');
            if (countElement) {
                countElement.textContent = 'Missing';
                countElement.className = 'meta-count';
            }
        }
    }

    function displayArrayMetaItem(valueElement, countElement, contentArray, typeName) {
        if (contentArray && contentArray.length > 0) {
            const listHtml = contentArray.map(item => 
                `<div class="meta-list-item">${escapeHtml(item)}</div>`
            ).join('');
            valueElement.innerHTML = `<div class="meta-list">${listHtml}</div>`;
            valueElement.classList.add('has-content');
            if (countElement) {
                countElement.textContent = `${contentArray.length} items`;
                countElement.className = 'meta-count good';
            }
        } else {
            valueElement.innerHTML = `<span class="placeholder">No ${typeName} found</span>`;
            valueElement.classList.remove('has-content');
            if (countElement) {
                countElement.textContent = 'Missing';
                countElement.className = 'meta-count';
            }
        }
    }

    function displayStructuredData(valueElement, countElement, structuredDataArray) {
        if (structuredDataArray && structuredDataArray.length > 0) {
            const previewText = JSON.stringify(structuredDataArray, null, 2);
            valueElement.innerHTML = `<div class="json-preview">${escapeHtml(previewText.substring(0, 500))}${previewText.length > 500 ? '...' : ''}</div>`;
            valueElement.classList.add('has-content');
            if (countElement) {
                countElement.textContent = `${structuredDataArray.length} schema(s)`;
                countElement.className = 'meta-count good';
            }
        } else {
            valueElement.innerHTML = '<span class="placeholder">No structured data found</span>';
            valueElement.classList.remove('has-content');
            if (countElement) {
                countElement.textContent = 'Missing';
                countElement.className = 'meta-count';
            }
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