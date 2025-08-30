/**
 * Display Manager for MegaTagsChecker
 * Handles rendering and displaying meta tag data in the UI
 */

/**
 * Display meta tags in the default tags section
 * @param {Object} defaultTags - Default meta tags data
 * @param {Object} elements - DOM elements for display
 */
function displayDefaultTags(defaultTags, elements) {
    // Title
    displayMetaItem(
        elements.titleValue, 
        elements.titleCount, 
        defaultTags.title, 
        'title',
        { ideal: [50, 60], max: 70 }
    );

    // Description
    displayMetaItem(
        elements.descriptionValue, 
        elements.descriptionCount, 
        defaultTags.description, 
        'description',
        { ideal: [150, 160], max: 200 }
    );

    // Keywords
    displayKeywords(defaultTags.keywords, elements.keywordsValue, elements.keywordsCount);

    // Viewport
    displaySimpleMetaItem(elements.viewportValue, elements.viewportCount, defaultTags.viewport, 'viewport');

    // Robots
    displaySimpleMetaItem(elements.robotsValue, elements.robotsCount, defaultTags.robots, 'robots directive');

    // Author
    displaySimpleMetaItem(elements.authorValue, elements.authorCount, defaultTags.author, 'author');

    // Canonical URL
    displayUrlMetaItem(elements.canonicalValue, elements.canonicalCount, defaultTags.canonical, 'canonical URL');
}

/**
 * Display meta tags in the advanced tags section
 * @param {Object} advancedTags - Advanced meta tags data
 * @param {Object} advancedElements - DOM elements for advanced display
 */
function displayAdvancedTags(advancedTags, advancedElements) {
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

/**
 * Display a meta item with length validation and optimization hints
 * @param {HTMLElement} valueElement - Element to display the value
 * @param {HTMLElement} countElement - Element to display the count
 * @param {string} content - Meta tag content
 * @param {string} type - Type of meta tag
 * @param {Object} limits - Length limits for validation
 */
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

/**
 * Display a simple meta item with present/missing status
 * @param {HTMLElement} valueElement - Element to display the value
 * @param {HTMLElement} countElement - Element to display the status
 * @param {string} content - Meta tag content
 * @param {string} typeName - Name of the meta tag type
 */
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

/**
 * Display a URL meta item with clickable links
 * @param {HTMLElement} valueElement - Element to display the value
 * @param {HTMLElement} countElement - Element to display the status
 * @param {string} content - URL content
 * @param {string} typeName - Name of the meta tag type
 */
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

/**
 * Display an array of meta items (like DNS prefetch, preload, etc.)
 * @param {HTMLElement} valueElement - Element to display the values
 * @param {HTMLElement} countElement - Element to display the count
 * @param {Array} contentArray - Array of content items
 * @param {string} typeName - Name of the meta tag type
 */
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

/**
 * Display structured data with JSON preview
 * @param {HTMLElement} valueElement - Element to display the structured data
 * @param {HTMLElement} countElement - Element to display the count
 * @param {Array} structuredDataArray - Array of structured data schemas
 */
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

/**
 * Display keywords as styled tags
 * @param {string} keywords - Comma-separated keywords
 * @param {HTMLElement} keywordsValue - Element to display keywords
 * @param {HTMLElement} keywordsCount - Element to display count
 */
function displayKeywords(keywords, keywordsValue, keywordsCount) {
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
            displayNoKeywords(keywordsValue, keywordsCount);
        }
    } else {
        displayNoKeywords(keywordsValue, keywordsCount);
    }
}

/**
 * Display no keywords found state
 * @param {HTMLElement} keywordsValue - Element to display keywords
 * @param {HTMLElement} keywordsCount - Element to display count
 */
function displayNoKeywords(keywordsValue, keywordsCount) {
    keywordsValue.innerHTML = '<span class="placeholder">No keywords found</span>';
    keywordsValue.classList.remove('has-content');
    keywordsCount.textContent = '0 keywords';
    keywordsCount.className = 'meta-count';
}

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        displayDefaultTags,
        displayAdvancedTags,
        displayMetaItem,
        displaySimpleMetaItem,
        displayUrlMetaItem,
        displayArrayMetaItem,
        displayStructuredData,
        displayKeywords,
        displayNoKeywords
    };
}