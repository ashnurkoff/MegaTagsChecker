# Meta Tags Checker - Chrome Extension

A simple and beautiful Chrome extension that detects and displays meta tags (title, description, keywords) for any web page.

## Features

- ✅ **Title Tag Detection** - Shows page title with character count and optimization hints
- 📝 **Meta Description** - Displays meta description with length validation  
- 🏷️ **Keywords Analysis** - Shows meta keywords as styled tags
- 🎨 **Beautiful UI** - Modern, gradient-based interface with smooth animations
- 📱 **Responsive Design** - Clean layout that works perfectly in the extension popup
- 🔄 **Real-time Updates** - Refresh button to re-analyze the current page
- ⚡ **Fast Performance** - Lightweight and optimized for speed

## Installation

### Method 1: Developer Mode (Recommended for now)

1. Download or clone this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" button
5. Select the folder containing the extension files
6. The extension will appear in your Chrome toolbar

### Method 2: Chrome Web Store
*Follow the publishing guide below to submit this extension to the Chrome Web Store.*

## Usage

1. **Navigate to any website** you want to analyze
2. **Click the extension icon** in your Chrome toolbar
3. **View the meta tags** displayed in the beautiful popup:
   - **Title**: Shows the page title with character count and optimization status
   - **Description**: Displays meta description with length recommendations
   - **Keywords**: Shows keywords as individual tags (if present)
4. **Use the refresh button** to re-analyze the page after any changes

## Meta Tag Optimization Guidelines

The extension provides visual feedback for SEO optimization:

### Title Tags
- 🟢 **Ideal**: 50-60 characters
- 🟡 **Warning**: 61-70 characters  
- 🔴 **Too Long**: 70+ characters

### Meta Descriptions
- 🟢 **Ideal**: 150-160 characters
- 🟡 **Warning**: 161-200 characters
- 🔴 **Too Long**: 200+ characters

### Keywords
- Shows the number of keywords found
- Displays each keyword as a styled tag for easy reading

## Technical Details

### Files Structure
```
MetaTagsChecker/
├── manifest.json       # Extension configuration
├── popup.html         # Main popup interface
├── popup.css          # Styling and animations
├── popup.js           # Popup logic and UI interactions
├── content.js         # Page content analysis script
├── icons/             # Extension icons
│   ├── icon.png       # SVG icon source
│   └── README.txt     # Icon instructions
└── README.md          # This file
```

### Permissions
- `activeTab`: Allows the extension to read meta tags from the currently active tab
- No sensitive permissions required!

### Browser Compatibility
- Chrome (Manifest V3)
- Other Chromium-based browsers (Edge, Brave, etc.)

## Development

### Making Changes
1. Edit the source files as needed
2. Go to `chrome://extensions/`
3. Click the refresh icon for this extension
4. Test your changes

### Key Components
- **Content Script** (`content.js`): Extracts meta tags from the webpage
- **Popup Script** (`popup.js`): Handles UI interactions and data display
- **Styles** (`popup.css`): Modern gradient-based design with animations

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please create an issue in the project repository.

---

**Enjoy analyzing meta tags with style! 🚀**