/**
 * MegaTagsChecker Popup Script
 * 
 * NOTICE: This file has been refactored into modular components.
 * The functionality is now split across multiple modules in the /js directory:
 * 
 * - js/ui-controller.js    - Main UI controller and event handling
 * - js/seo-audit.js        - SEO scoring and analysis engine
 * - js/export-manager.js   - CSV and PDF export functionality 
 * - js/display-manager.js  - Meta tag display and rendering
 * - js/utils.js            - Utility functions and helpers
 * 
 * This modular approach improves:
 * - Code maintainability and readability
 * - Separation of concerns
 * - Easier testing and debugging
 * - Better performance through selective loading
 * 
 * The original monolithic popup.js has been preserved as popup-legacy.js
 * for reference and rollback purposes.
 * 
 * All modules are loaded via popup.html script tags in the correct order.
 */

// This file intentionally left minimal - all functionality moved to modules
console.log('MegaTagsChecker: Modular architecture loaded');