/**
 * SEO Audit Engine for MegaTagsChecker
 * Provides comprehensive SEO scoring and recommendations
 */

/**
 * Main function to calculate comprehensive SEO score
 * @param {Object} metaTags - Meta tags data from content script
 * @returns {Object} Complete SEO audit with scores and recommendations
 */
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

/**
 * Score title tag based on SEO best practices
 * @param {string} title - Title tag content
 * @returns {Object} Score result with status and message
 */
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

/**
 * Score meta description based on SEO best practices
 * @param {string} description - Meta description content
 * @returns {Object} Score result with status and message
 */
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

/**
 * Score keywords meta tag
 * @param {string} keywords - Keywords meta tag content
 * @returns {Object} Score result with status and message
 */
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

/**
 * Score viewport meta tag
 * @param {string} viewport - Viewport meta tag content
 * @returns {Object} Score result with status and message
 */
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

/**
 * Score canonical URL tag
 * @param {string} canonical - Canonical URL
 * @returns {Object} Score result with status and message
 */
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

/**
 * Score Open Graph tags
 * @param {Object} advancedTags - Advanced meta tags object
 * @returns {Object} Score result with status and message
 */
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

/**
 * Score Twitter Card tags
 * @param {Object} advancedTags - Advanced meta tags object
 * @returns {Object} Score result with status and message
 */
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

/**
 * Score structured data
 * @param {Array} structuredData - Array of structured data schemas
 * @returns {Object} Score result with status and message
 */
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

/**
 * Score performance tags
 * @param {Object} advancedTags - Advanced meta tags object
 * @returns {Object} Score result with status and message
 */
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

/**
 * Generate actionable recommendations based on scores
 * @param {Object} scores - SEO scores object
 * @returns {Array} Array of recommendations sorted by priority
 */
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

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateSEOScore,
        scoreTitleTag,
        scoreDescriptionTag,
        scoreKeywordsTag,
        scoreViewportTag,
        scoreCanonicalTag,
        scoreOpenGraphTags,
        scoreTwitterCardTags,
        scoreStructuredData,
        scorePerformanceTags,
        generateRecommendations
    };
}