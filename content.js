// Content script to extract meta tags from the current page
function extractMetaTags() {
    const result = {
        // Default tags
        title: '',
        description: '',
        keywords: '',
        url: window.location.href,
        
        // Advanced tags
        defaultTags: {},
        advancedTags: {}
    };

    // Extract basic meta tags for backward compatibility
    const titleElement = document.querySelector('title');
    if (titleElement) {
        result.title = titleElement.textContent.trim();
    }

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
        result.description = descriptionMeta.getAttribute('content') || '';
    }

    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta) {
        result.keywords = keywordsMeta.getAttribute('content') || '';
    }

    // Extract all Default Tags
    result.defaultTags = {
        title: result.title,
        description: result.description,
        keywords: result.keywords,
        viewport: getMetaContent('name', 'viewport'),
        robots: getMetaContent('name', 'robots'),
        author: getMetaContent('name', 'author'),
        canonical: getLinkHref('rel', 'canonical')
    };

    // Extract all Advanced Tags
    result.advancedTags = {
        // Open Graph Tags
        ogTitle: getMetaContent('property', 'og:title'),
        ogDescription: getMetaContent('property', 'og:description'),
        ogImage: getMetaContent('property', 'og:image'),
        ogUrl: getMetaContent('property', 'og:url'),
        ogType: getMetaContent('property', 'og:type'),
        ogSiteName: getMetaContent('property', 'og:site_name'),
        
        // Twitter Cards
        twitterCard: getMetaContent('name', 'twitter:card'),
        twitterTitle: getMetaContent('name', 'twitter:title'),
        twitterDescription: getMetaContent('name', 'twitter:description'),
        twitterImage: getMetaContent('name', 'twitter:image'),
        twitterSite: getMetaContent('name', 'twitter:site'),
        
        // Additional SEO Tags
        language: getMetaContent('http-equiv', 'content-language') || getMetaContent('name', 'language'),
        publisher: getMetaContent('name', 'publisher'),
        copyright: getMetaContent('name', 'copyright'),
        generator: getMetaContent('name', 'generator'),
        
        // Favicon and Icons
        favicon: getLinkHref('rel', 'icon') || getLinkHref('rel', 'shortcut icon'),
        appleTouchIcon: getLinkHref('rel', 'apple-touch-icon'),
        manifest: getLinkHref('rel', 'manifest'),
        
        // Performance Tags
        dnsPrefetch: getAllLinkHrefs('rel', 'dns-prefetch'),
        preconnect: getAllLinkHrefs('rel', 'preconnect'),
        preload: getAllLinkHrefs('rel', 'preload'),
        
        // International SEO
        hreflang: getAllHreflangTags(),
        
        // Security
        csp: getMetaContent('http-equiv', 'Content-Security-Policy'),
        referrer: getMetaContent('name', 'referrer'),
        
        // Article Tags (for news/blog sites)
        articleAuthor: getMetaContent('property', 'article:author'),
        articlePublishedTime: getMetaContent('property', 'article:published_time'),
        articleSection: getMetaContent('property', 'article:section'),
        
        // Schema.org structured data
        structuredData: getStructuredData()
    };

    return result;
}

// Helper functions to extract meta content
function getMetaContent(attribute, value) {
    const meta = document.querySelector(`meta[${attribute}="${value}"]`);
    return meta ? (meta.getAttribute('content') || '').trim() : '';
}

function getLinkHref(attribute, value) {
    const link = document.querySelector(`link[${attribute}="${value}"]`);
    return link ? (link.getAttribute('href') || '').trim() : '';
}

function getAllLinkHrefs(attribute, value) {
    const links = document.querySelectorAll(`link[${attribute}="${value}"]`);
    return Array.from(links).map(link => link.getAttribute('href')).filter(href => href);
}

function getAllHreflangTags() {
    const hreflangLinks = document.querySelectorAll('link[rel="alternate"][hreflang]');
    return Array.from(hreflangLinks).map(link => ({
        hreflang: link.getAttribute('hreflang'),
        href: link.getAttribute('href')
    }));
}

function getStructuredData() {
    const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
    const structuredData = [];
    
    structuredDataScripts.forEach(script => {
        try {
            const data = JSON.parse(script.textContent);
            structuredData.push(data);
        } catch (e) {
            // Invalid JSON, skip
        }
    });
    
    return structuredData;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getMetaTags') {
        const metaTags = extractMetaTags();
        sendResponse(metaTags);
    }
    return true; // Indicates we will send a response asynchronously
});