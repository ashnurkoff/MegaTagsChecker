document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = document.getElementById('loading');
    const contentElement = document.getElementById('content');
    const errorElement = document.getElementById('error');
    const refreshBtn = document.getElementById('refresh-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');

    // Store the current meta tags data for export
    let currentMetaData = null;

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
    
    // Initially disable export buttons
    exportCsvBtn.disabled = true;
    exportPdfBtn.disabled = true;

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

    // Export button event listeners
    exportCsvBtn.addEventListener('click', function() {
        if (currentMetaData) {
            exportToCSV(currentMetaData);
        }
    });

    exportPdfBtn.addEventListener('click', function() {
        if (currentMetaData) {
            // Show loading state
            exportPdfBtn.disabled = true;
            exportPdfBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Generating...
            `;
            
            exportToPDF(currentMetaData);
            
            // Reset button after delay
            setTimeout(() => {
                exportPdfBtn.disabled = false;
                exportPdfBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Export PDF
                `;
            }, 3000);
        }
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
        // Store meta data for export
        currentMetaData = metaTags;
        
        // Calculate SEO audit score
        currentMetaData.seoAudit = calculateSEOScore(metaTags);
        
        // Enable export buttons
        exportCsvBtn.disabled = false;
        exportPdfBtn.disabled = false;
        
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

    // SEO Audit Scoring Functions
    function calculateSEOScore(metaTags) {
        const audit = {
            scores: {},
            overallScore: 0,
            recommendations: [],
            timestamp: new Date().toISOString(),
            url: metaTags.url || 'Unknown URL'
        };

        // Title tag scoring
        audit.scores.title = scoreTitleTag(metaTags.defaultTags.title);
        
        // Description tag scoring
        audit.scores.description = scoreDescriptionTag(metaTags.defaultTags.description);
        
        // Keywords scoring
        audit.scores.keywords = scoreKeywordsTag(metaTags.defaultTags.keywords);
        
        // Essential meta tags scoring
        audit.scores.viewport = scoreViewportTag(metaTags.defaultTags.viewport);
        audit.scores.canonical = scoreCanonicalTag(metaTags.defaultTags.canonical);
        
        // Open Graph scoring
        audit.scores.openGraph = scoreOpenGraphTags(metaTags.advancedTags);
        
        // Twitter Cards scoring
        audit.scores.twitterCards = scoreTwitterCardTags(metaTags.advancedTags);
        
        // Structured Data scoring
        audit.scores.structuredData = scoreStructuredData(metaTags.advancedTags.structuredData);
        
        // Performance tags scoring
        audit.scores.performance = scorePerformanceTags(metaTags.advancedTags);

        // Calculate overall score (weighted average)
        const weights = {
            title: 0.25,
            description: 0.25,
            keywords: 0.05,
            viewport: 0.10,
            canonical: 0.10,
            openGraph: 0.10,
            twitterCards: 0.05,
            structuredData: 0.05,
            performance: 0.05
        };

        audit.overallScore = Object.keys(weights).reduce((total, key) => {
            return total + (audit.scores[key].score * weights[key]);
        }, 0);

        // Generate recommendations
        audit.recommendations = generateRecommendations(audit.scores);

        return audit;
    }

    function scoreTitleTag(title) {
        const result = { score: 0, status: 'fail', message: '', length: 0 };
        
        if (!title || !title.trim()) {
            result.message = 'Title tag is missing';
            return result;
        }
        
        result.length = title.trim().length;
        
        if (result.length < 30) {
            result.score = 50;
            result.status = 'warning';
            result.message = 'Title is too short (recommended: 50-60 characters)';
        } else if (result.length >= 50 && result.length <= 60) {
            result.score = 100;
            result.status = 'pass';
            result.message = 'Title length is optimal';
        } else if (result.length <= 70) {
            result.score = 80;
            result.status = 'warning';
            result.message = 'Title is acceptable but could be shorter';
        } else {
            result.score = 30;
            result.status = 'fail';
            result.message = 'Title is too long (will be truncated in search results)';
        }
        
        return result;
    }

    function scoreDescriptionTag(description) {
        const result = { score: 0, status: 'fail', message: '', length: 0 };
        
        if (!description || !description.trim()) {
            result.message = 'Meta description is missing';
            return result;
        }
        
        result.length = description.trim().length;
        
        if (result.length < 120) {
            result.score = 60;
            result.status = 'warning';
            result.message = 'Description is too short (recommended: 150-160 characters)';
        } else if (result.length >= 150 && result.length <= 160) {
            result.score = 100;
            result.status = 'pass';
            result.message = 'Description length is optimal';
        } else if (result.length <= 200) {
            result.score = 75;
            result.status = 'warning';
            result.message = 'Description is acceptable but could be optimized';
        } else {
            result.score = 40;
            result.status = 'fail';
            result.message = 'Description is too long (will be truncated)';
        }
        
        return result;
    }

    function scoreKeywordsTag(keywords) {
        const result = { score: 0, status: 'pass', message: '', count: 0 };
        
        if (!keywords || !keywords.trim()) {
            result.score = 100; // Keywords meta tag is not essential for modern SEO
            result.message = 'Keywords meta tag not present (not required for modern SEO)';
            return result;
        }
        
        const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
        result.count = keywordArray.length;
        
        if (result.count <= 10) {
            result.score = 100;
            result.message = 'Keywords count is reasonable';
        } else {
            result.score = 70;
            result.status = 'warning';
            result.message = 'Too many keywords (keyword stuffing risk)';
        }
        
        return result;
    }

    function scoreViewportTag(viewport) {
        const result = { score: 0, status: 'fail', message: '' };
        
        if (!viewport || !viewport.trim()) {
            result.message = 'Viewport meta tag is missing (required for mobile optimization)';
            return result;
        }
        
        if (viewport.includes('width=device-width')) {
            result.score = 100;
            result.status = 'pass';
            result.message = 'Viewport is properly configured for mobile';
        } else {
            result.score = 50;
            result.status = 'warning';
            result.message = 'Viewport configuration could be improved';
        }
        
        return result;
    }

    function scoreCanonicalTag(canonical) {
        const result = { score: 0, status: 'warning', message: '' };
        
        if (!canonical || !canonical.trim()) {
            result.score = 70; // Not always required, but recommended
            result.message = 'Canonical URL not specified (recommended for duplicate content prevention)';
            return result;
        }
        
        try {
            new URL(canonical);
            result.score = 100;
            result.status = 'pass';
            result.message = 'Canonical URL is properly set';
        } catch {
            result.score = 30;
            result.status = 'fail';
            result.message = 'Canonical URL format is invalid';
        }
        
        return result;
    }

    function scoreOpenGraphTags(advancedTags) {
        const result = { score: 0, status: 'fail', message: '', details: {} };
        let foundTags = 0;
        const requiredTags = ['ogTitle', 'ogDescription', 'ogImage', 'ogUrl'];
        
        requiredTags.forEach(tag => {
            if (advancedTags[tag] && advancedTags[tag].trim()) {
                foundTags++;
                result.details[tag] = 'present';
            } else {
                result.details[tag] = 'missing';
            }
        });
        
        result.score = (foundTags / requiredTags.length) * 100;
        
        if (result.score === 100) {
            result.status = 'pass';
            result.message = 'All essential Open Graph tags are present';
        } else if (result.score >= 50) {
            result.status = 'warning';
            result.message = `${foundTags}/${requiredTags.length} Open Graph tags present`;
        } else {
            result.message = 'Most Open Graph tags are missing (poor social media sharing)';
        }
        
        return result;
    }

    function scoreTwitterCardTags(advancedTags) {
        const result = { score: 0, status: 'warning', message: '' };
        
        if (!advancedTags.twitterCard || !advancedTags.twitterCard.trim()) {
            result.score = 70; // Not critical, but recommended
            result.message = 'Twitter Card tags not configured';
            return result;
        }
        
        let score = 60; // Base score for having twitter:card
        
        if (advancedTags.twitterTitle && advancedTags.twitterTitle.trim()) score += 15;
        if (advancedTags.twitterDescription && advancedTags.twitterDescription.trim()) score += 15;
        if (advancedTags.twitterImage && advancedTags.twitterImage.trim()) score += 10;
        
        result.score = score;
        result.status = score >= 90 ? 'pass' : 'warning';
        result.message = score >= 90 ? 'Twitter Cards are well configured' : 'Twitter Cards could be improved';
        
        return result;
    }

    function scoreStructuredData(structuredData) {
        const result = { score: 0, status: 'warning', message: '' };
        
        if (!structuredData || structuredData.length === 0) {
            result.score = 70; // Not always required, but beneficial
            result.message = 'No structured data found (recommended for rich snippets)';
            return result;
        }
        
        result.score = Math.min(100, 80 + (structuredData.length * 5));
        result.status = 'pass';
        result.message = `${structuredData.length} structured data schema(s) found`;
        
        return result;
    }

    function scorePerformanceTags(advancedTags) {
        const result = { score: 70, status: 'warning', message: '', details: {} };
        
        const performanceTags = ['dnsPrefetch', 'preconnect', 'preload'];
        let foundTags = 0;
        
        performanceTags.forEach(tag => {
            if (advancedTags[tag] && advancedTags[tag].length > 0) {
                foundTags++;
                result.details[tag] = advancedTags[tag].length;
            }
        });
        
        if (foundTags === 0) {
            result.message = 'No performance optimization tags found';
        } else {
            result.score = 70 + (foundTags * 10);
            result.status = 'pass';
            result.message = `${foundTags} performance optimization tag type(s) found`;
        }
        
        return result;
    }

    function generateRecommendations(scores) {
        const recommendations = [];
        
        Object.keys(scores).forEach(category => {
            const score = scores[category];
            if (score.status === 'fail' || score.status === 'warning') {
                recommendations.push({
                    category: category,
                    priority: score.status === 'fail' ? 'high' : 'medium',
                    message: score.message,
                    score: score.score
                });
            }
        });
        
        // Sort by priority and score
        return recommendations.sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (b.priority === 'high' && a.priority !== 'high') return 1;
            return a.score - b.score;
        });
    }

    // Export Functions
    function exportToCSV(metaData) {
        const csvData = [];
        const timestamp = new Date().toLocaleString();
        
        // Header
        csvData.push(['MegaTagsChecker SEO Report']);
        csvData.push(['Generated:', timestamp]);
        csvData.push(['URL:', metaData.url || 'Unknown']);
        csvData.push(['Overall SEO Score:', `${Math.round(metaData.seoAudit.overallScore)}%`]);
        csvData.push(['']); // Empty row
        
        // Default Tags Section
        csvData.push(['DEFAULT META TAGS']);
        csvData.push(['Tag Type', 'Content', 'Length/Status', 'SEO Score', 'Recommendation']);
        
        const defaultTags = metaData.defaultTags;
        const audit = metaData.seoAudit.scores;
        
        csvData.push([
            'Title',
            defaultTags.title || 'Not found',
            defaultTags.title ? `${defaultTags.title.length} characters` : 'Missing',
            `${audit.title.score}%`,
            audit.title.message
        ]);
        
        csvData.push([
            'Description',
            defaultTags.description || 'Not found',
            defaultTags.description ? `${defaultTags.description.length} characters` : 'Missing',
            `${audit.description.score}%`,
            audit.description.message
        ]);
        
        csvData.push([
            'Keywords',
            defaultTags.keywords || 'Not found',
            defaultTags.keywords ? `${defaultTags.keywords.split(',').length} keywords` : 'Missing',
            `${audit.keywords.score}%`,
            audit.keywords.message
        ]);
        
        csvData.push([
            'Viewport',
            defaultTags.viewport || 'Not found',
            defaultTags.viewport ? 'Present' : 'Missing',
            `${audit.viewport.score}%`,
            audit.viewport.message
        ]);
        
        csvData.push([
            'Canonical URL',
            defaultTags.canonical || 'Not found',
            defaultTags.canonical ? 'Present' : 'Missing',
            `${audit.canonical.score}%`,
            audit.canonical.message
        ]);
        
        csvData.push([
            'Robots',
            defaultTags.robots || 'Not found',
            defaultTags.robots ? 'Present' : 'Missing',
            'N/A',
            'Robots directive found'
        ]);
        
        csvData.push([
            'Author',
            defaultTags.author || 'Not found',
            defaultTags.author ? 'Present' : 'Missing',
            'N/A',
            'Author meta tag found'
        ]);
        
        csvData.push(['']); // Empty row
        
        // Advanced Tags Section
        csvData.push(['ADVANCED META TAGS']);
        csvData.push(['Category', 'Tag', 'Content', 'Status']);
        
        const advancedTags = metaData.advancedTags;
        
        // Open Graph
        csvData.push(['Open Graph', 'og:title', advancedTags.ogTitle || 'Not found', advancedTags.ogTitle ? 'Present' : 'Missing']);
        csvData.push(['Open Graph', 'og:description', advancedTags.ogDescription || 'Not found', advancedTags.ogDescription ? 'Present' : 'Missing']);
        csvData.push(['Open Graph', 'og:image', advancedTags.ogImage || 'Not found', advancedTags.ogImage ? 'Present' : 'Missing']);
        csvData.push(['Open Graph', 'og:url', advancedTags.ogUrl || 'Not found', advancedTags.ogUrl ? 'Present' : 'Missing']);
        csvData.push(['Open Graph', 'og:type', advancedTags.ogType || 'Not found', advancedTags.ogType ? 'Present' : 'Missing']);
        csvData.push(['Open Graph', 'og:site_name', advancedTags.ogSiteName || 'Not found', advancedTags.ogSiteName ? 'Present' : 'Missing']);
        
        // Twitter Cards
        csvData.push(['Twitter Cards', 'twitter:card', advancedTags.twitterCard || 'Not found', advancedTags.twitterCard ? 'Present' : 'Missing']);
        csvData.push(['Twitter Cards', 'twitter:title', advancedTags.twitterTitle || 'Not found', advancedTags.twitterTitle ? 'Present' : 'Missing']);
        csvData.push(['Twitter Cards', 'twitter:description', advancedTags.twitterDescription || 'Not found', advancedTags.twitterDescription ? 'Present' : 'Missing']);
        csvData.push(['Twitter Cards', 'twitter:image', advancedTags.twitterImage || 'Not found', advancedTags.twitterImage ? 'Present' : 'Missing']);
        csvData.push(['Twitter Cards', 'twitter:site', advancedTags.twitterSite || 'Not found', advancedTags.twitterSite ? 'Present' : 'Missing']);
        
        // Additional SEO
        csvData.push(['Additional SEO', 'Language', advancedTags.language || 'Not found', advancedTags.language ? 'Present' : 'Missing']);
        csvData.push(['Additional SEO', 'Publisher', advancedTags.publisher || 'Not found', advancedTags.publisher ? 'Present' : 'Missing']);
        csvData.push(['Additional SEO', 'Generator', advancedTags.generator || 'Not found', advancedTags.generator ? 'Present' : 'Missing']);
        
        // Icons & Manifest
        csvData.push(['Icons & Manifest', 'Favicon', advancedTags.favicon || 'Not found', advancedTags.favicon ? 'Present' : 'Missing']);
        csvData.push(['Icons & Manifest', 'Apple Touch Icon', advancedTags.appleTouchIcon || 'Not found', advancedTags.appleTouchIcon ? 'Present' : 'Missing']);
        csvData.push(['Icons & Manifest', 'Web Manifest', advancedTags.manifest || 'Not found', advancedTags.manifest ? 'Present' : 'Missing']);
        
        // Performance
        csvData.push(['Performance', 'DNS Prefetch', advancedTags.dnsPrefetch ? advancedTags.dnsPrefetch.join('; ') : 'Not found', advancedTags.dnsPrefetch && advancedTags.dnsPrefetch.length > 0 ? `${advancedTags.dnsPrefetch.length} entries` : 'Missing']);
        csvData.push(['Performance', 'Preconnect', advancedTags.preconnect ? advancedTags.preconnect.join('; ') : 'Not found', advancedTags.preconnect && advancedTags.preconnect.length > 0 ? `${advancedTags.preconnect.length} entries` : 'Missing']);
        csvData.push(['Performance', 'Preload', advancedTags.preload ? advancedTags.preload.join('; ') : 'Not found', advancedTags.preload && advancedTags.preload.length > 0 ? `${advancedTags.preload.length} entries` : 'Missing']);
        
        // Structured Data
        csvData.push(['Structured Data', 'JSON-LD Schema', advancedTags.structuredData && advancedTags.structuredData.length > 0 ? `${advancedTags.structuredData.length} schema(s) found` : 'Not found', advancedTags.structuredData && advancedTags.structuredData.length > 0 ? `${advancedTags.structuredData.length} schemas` : 'Missing']);
        
        csvData.push(['']); // Empty row
        
        // SEO Recommendations
        csvData.push(['SEO RECOMMENDATIONS']);
        csvData.push(['Priority', 'Category', 'Recommendation', 'Score']);
        
        metaData.seoAudit.recommendations.forEach(rec => {
            csvData.push([
                rec.priority.toUpperCase(),
                rec.category,
                rec.message,
                `${rec.score}%`
            ]);
        });
        
        // Convert to CSV string
        const csvContent = csvData.map(row => 
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        
        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `seo-audit-${getFilenameSafeUrl(metaData.url)}-${getTimestamp()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function exportToPDF(metaData) {
        // Create a better PDF generation approach
        const reportContent = generatePDFContent(metaData);
        
        // Create a blob with the HTML content
        const htmlBlob = new Blob([reportContent], { type: 'text/html' });
        const htmlUrl = URL.createObjectURL(htmlBlob);
        
        // Open in a new window optimized for PDF generation
        const pdfWindow = window.open(htmlUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        
        // Wait for content to load
        setTimeout(() => {
            if (pdfWindow) {
                // Add print-specific styling and trigger print
                pdfWindow.addEventListener('load', () => {
                    // Add a print button and instructions
                    const printInstructions = pdfWindow.document.createElement('div');
                    printInstructions.style.cssText = `
                        position: fixed;
                        top: 10px;
                        right: 10px;
                        background: #667eea;
                        color: white;
                        padding: 15px;
                        border-radius: 8px;
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                        z-index: 9999;
                        cursor: pointer;
                        user-select: none;
                    `;
                    const filename = `seo-audit-${getFilenameSafeUrl(metaData.url)}-${getTimestamp()}.pdf`;
                    printInstructions.innerHTML = `
                        <div style="margin-bottom: 10px;"><strong>📄 Ready to Save as PDF</strong></div>
                        <div style="font-size: 11px; margin-bottom: 8px; opacity: 0.9;">Suggested filename:</div>
                        <div style="font-size: 10px; font-family: monospace; background: rgba(255,255,255,0.3); padding: 4px 6px; border-radius: 3px; margin-bottom: 10px; word-break: break-all;">${filename}</div>
                        <div style="font-size: 12px; margin-bottom: 10px;">Press Ctrl+P (Cmd+P on Mac)<br>Select "Save as PDF" as destination</div>
                        <div style="text-align: center; padding: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; cursor: pointer;" onclick="window.print()">🖨️ Save as PDF</div>
                        <div style="text-align: center; padding: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; cursor: pointer; margin-top: 8px; font-size: 12px;" onclick="window.close()">✖️ Close Window</div>
                    `;
                    
                    // Insert at the beginning of body
                    pdfWindow.document.body.insertBefore(printInstructions, pdfWindow.document.body.firstChild);
                    
                    // Set the document title for better PDF naming
                    pdfWindow.document.title = filename;
                    
                    // Auto-trigger print dialog after a short delay
                    setTimeout(() => {
                        pdfWindow.print();
                    }, 1000);
                });
                
                // If the window is already loaded
                if (pdfWindow.document.readyState === 'complete') {
                    pdfWindow.dispatchEvent(new Event('load'));
                }
            }
        }, 500);
        
        // Clean up the blob URL after some time
        setTimeout(() => {
            URL.revokeObjectURL(htmlUrl);
        }, 30000); // 30 seconds
    }

    function generatePDFContent(metaData) {
        const timestamp = new Date().toLocaleString();
        const audit = metaData.seoAudit;
        const filename = `seo-audit-${getFilenameSafeUrl(metaData.url)}-${getTimestamp()}`;
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${filename}</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #667eea;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #667eea;
                    margin: 0;
                    font-size: 28px;
                }
                .header p {
                    margin: 5px 0;
                    color: #666;
                }
                .score-summary {
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 30px;
                    text-align: center;
                }
                .overall-score {
                    font-size: 48px;
                    font-weight: bold;
                    color: ${audit.overallScore >= 80 ? '#059669' : audit.overallScore >= 60 ? '#d97706' : '#dc2626'};
                    margin: 0;
                }
                .score-label {
                    font-size: 18px;
                    color: #666;
                    margin-top: 5px;
                }
                .section {
                    margin-bottom: 30px;
                }
                .section h2 {
                    color: #374151;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }
                .meta-item {
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    padding: 15px;
                    margin-bottom: 10px;
                }
                .meta-label {
                    font-weight: bold;
                    color: #374151;
                    margin-bottom: 5px;
                }
                .meta-content {
                    color: #6b7280;
                    word-break: break-word;
                }
                .score-badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: bold;
                    margin-left: 10px;
                }
                .score-pass { background: #d1fae5; color: #065f46; }
                .score-warning { background: #fef3c7; color: #92400e; }
                .score-fail { background: #fee2e2; color: #991b1b; }
                .recommendations {
                    background: #fefce8;
                    border: 1px solid #fbbf24;
                    border-radius: 8px;
                    padding: 20px;
                }
                .recommendation {
                    margin-bottom: 10px;
                    padding: 10px;
                    background: white;
                    border-radius: 4px;
                }
                .priority-high { border-left: 4px solid #dc2626; }
                .priority-medium { border-left: 4px solid #d97706; }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    color: #6b7280;
                    font-size: 12px;
                }
                @media print {
                    body { 
                        margin: 0; 
                        padding: 15px; 
                        font-size: 12px;
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }
                    .header { 
                        page-break-inside: avoid;
                        margin-bottom: 20px;
                    }
                    .section { 
                        page-break-inside: avoid;
                        margin-bottom: 15px;
                    }
                    .score-summary {
                        page-break-inside: avoid;
                        margin-bottom: 20px;
                    }
                    .meta-item {
                        page-break-inside: avoid;
                        margin-bottom: 8px;
                        padding: 10px;
                    }
                    .recommendations {
                        page-break-inside: avoid;
                    }
                    /* Hide the print instructions when printing */
                    div[style*="position: fixed"] {
                        display: none !important;
                    }
                    /* Ensure colors are preserved */
                    .overall-score,
                    .score-badge,
                    .header h1 {
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>SEO Audit Report</h1>
                <p>Generated by MegaTagsChecker</p>
                <p><strong>URL:</strong> ${metaData.url || 'Unknown'}</p>
                <p><strong>Date:</strong> ${timestamp}</p>
            </div>
            
            <div class="score-summary">
                <div class="overall-score">${Math.round(audit.overallScore)}%</div>
                <div class="score-label">Overall SEO Score</div>
            </div>
            
            <div class="section">
                <h2>Default Meta Tags Analysis</h2>
                
                <div class="meta-item">
                    <div class="meta-label">Title Tag <span class="score-badge score-${audit.scores.title.status}">${audit.scores.title.score}%</span></div>
                    <div class="meta-content">
                        <strong>Content:</strong> ${metaData.defaultTags.title || 'Not found'}<br>
                        <strong>Length:</strong> ${metaData.defaultTags.title ? metaData.defaultTags.title.length : 0} characters<br>
                        <strong>Analysis:</strong> ${audit.scores.title.message}
                    </div>
                </div>
                
                <div class="meta-item">
                    <div class="meta-label">Meta Description <span class="score-badge score-${audit.scores.description.status}">${audit.scores.description.score}%</span></div>
                    <div class="meta-content">
                        <strong>Content:</strong> ${metaData.defaultTags.description || 'Not found'}<br>
                        <strong>Length:</strong> ${metaData.defaultTags.description ? metaData.defaultTags.description.length : 0} characters<br>
                        <strong>Analysis:</strong> ${audit.scores.description.message}
                    </div>
                </div>
                
                <div class="meta-item">
                    <div class="meta-label">Keywords <span class="score-badge score-${audit.scores.keywords.status}">${audit.scores.keywords.score}%</span></div>
                    <div class="meta-content">
                        <strong>Content:</strong> ${metaData.defaultTags.keywords || 'Not found'}<br>
                        <strong>Count:</strong> ${metaData.defaultTags.keywords ? metaData.defaultTags.keywords.split(',').length : 0} keywords<br>
                        <strong>Analysis:</strong> ${audit.scores.keywords.message}
                    </div>
                </div>
                
                <div class="meta-item">
                    <div class="meta-label">Viewport <span class="score-badge score-${audit.scores.viewport.status}">${audit.scores.viewport.score}%</span></div>
                    <div class="meta-content">
                        <strong>Content:</strong> ${metaData.defaultTags.viewport || 'Not found'}<br>
                        <strong>Analysis:</strong> ${audit.scores.viewport.message}
                    </div>
                </div>
                
                <div class="meta-item">
                    <div class="meta-label">Canonical URL <span class="score-badge score-${audit.scores.canonical.status}">${audit.scores.canonical.score}%</span></div>
                    <div class="meta-content">
                        <strong>Content:</strong> ${metaData.defaultTags.canonical || 'Not found'}<br>
                        <strong>Analysis:</strong> ${audit.scores.canonical.message}
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Social Media & Advanced Tags</h2>
                
                <div class="meta-item">
                    <div class="meta-label">Open Graph Tags <span class="score-badge score-${audit.scores.openGraph.status}">${audit.scores.openGraph.score}%</span></div>
                    <div class="meta-content">
                        <strong>og:title:</strong> ${metaData.advancedTags.ogTitle || 'Not found'}<br>
                        <strong>og:description:</strong> ${metaData.advancedTags.ogDescription || 'Not found'}<br>
                        <strong>og:image:</strong> ${metaData.advancedTags.ogImage || 'Not found'}<br>
                        <strong>og:url:</strong> ${metaData.advancedTags.ogUrl || 'Not found'}<br>
                        <strong>Analysis:</strong> ${audit.scores.openGraph.message}
                    </div>
                </div>
                
                <div class="meta-item">
                    <div class="meta-label">Twitter Cards <span class="score-badge score-${audit.scores.twitterCards.status}">${audit.scores.twitterCards.score}%</span></div>
                    <div class="meta-content">
                        <strong>twitter:card:</strong> ${metaData.advancedTags.twitterCard || 'Not found'}<br>
                        <strong>twitter:title:</strong> ${metaData.advancedTags.twitterTitle || 'Not found'}<br>
                        <strong>twitter:description:</strong> ${metaData.advancedTags.twitterDescription || 'Not found'}<br>
                        <strong>twitter:image:</strong> ${metaData.advancedTags.twitterImage || 'Not found'}<br>
                        <strong>Analysis:</strong> ${audit.scores.twitterCards.message}
                    </div>
                </div>
                
                <div class="meta-item">
                    <div class="meta-label">Structured Data <span class="score-badge score-${audit.scores.structuredData.status}">${audit.scores.structuredData.score}%</span></div>
                    <div class="meta-content">
                        <strong>Schemas Found:</strong> ${metaData.advancedTags.structuredData ? metaData.advancedTags.structuredData.length : 0}<br>
                        <strong>Analysis:</strong> ${audit.scores.structuredData.message}
                    </div>
                </div>
            </div>
            
            ${audit.recommendations.length > 0 ? `
            <div class="section">
                <h2>SEO Recommendations</h2>
                <div class="recommendations">
                    ${audit.recommendations.map(rec => `
                        <div class="recommendation priority-${rec.priority}">
                            <strong>${rec.priority.toUpperCase()} PRIORITY:</strong> ${rec.message} (Score: ${rec.score}%)
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="footer">
                <p>Report generated by MegaTagsChecker Chrome Extension</p>
                <p>For more SEO analysis and optimization, visit your website regularly</p>
            </div>
        </body>
        </html>
        `;
    }

    // Utility functions
    function getFilenameSafeUrl(url) {
        if (!url) return 'unknown-site';
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace(/[^a-zA-Z0-9]/g, '-');
        } catch {
            return url.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50);
        }
    }

    function getTimestamp() {
        const now = new Date();
        return now.getFullYear() + 
               String(now.getMonth() + 1).padStart(2, '0') + 
               String(now.getDate()).padStart(2, '0') + '-' +
               String(now.getHours()).padStart(2, '0') + 
               String(now.getMinutes()).padStart(2, '0');
    }
});