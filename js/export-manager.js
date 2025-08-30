/**
 * Export Manager for MegaTagsChecker
 * Handles CSV and PDF export functionality
 */

/**
 * Export meta tags data to CSV format
 * @param {Object} metaData - Complete meta data with SEO audit
 */
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
        row.map(cell => `"${String(cell).replace(/"/g, '""')}`).join(',')
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

/**
 * Export meta tags data to PDF format
 * @param {Object} metaData - Complete meta data with SEO audit
 */
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

/**
 * Generate HTML content for PDF report
 * @param {Object} metaData - Complete meta data with SEO audit
 * @returns {string} HTML content for PDF
 */
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

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exportToCSV,
        exportToPDF,
        generatePDFContent
    };
}