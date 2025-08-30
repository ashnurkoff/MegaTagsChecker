// Content script to extract meta tags from the current page
function extractMetaTags() {
    const result = {
        title: '',
        description: '',
        keywords: '',
        url: window.location.href
    };

    // Extract title
    const titleElement = document.querySelector('title');
    if (titleElement) {
        result.title = titleElement.textContent.trim();
    }

    // Extract description
    const descriptionMeta = document.querySelector('meta[name="description"]') || 
                           document.querySelector('meta[property="og:description"]');
    if (descriptionMeta) {
        result.description = descriptionMeta.getAttribute('content') || '';
    }

    // Extract keywords
    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta) {
        result.keywords = keywordsMeta.getAttribute('content') || '';
    }

    return result;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getMetaTags') {
        const metaTags = extractMetaTags();
        sendResponse(metaTags);
    }
    return true; // Indicates we will send a response asynchronously
});