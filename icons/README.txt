ICON CREATION INSTRUCTIONS
==========================

To complete the Chrome extension setup, you'll need to create PNG icon files from the provided SVG.

Required sizes:
- icon16.png (16x16px)
- icon32.png (32x32px) 
- icon48.png (48x48px)
- icon128.png (128x128px)

You can:
1. Use online converters (like convertio.co or cloudconvert.com)
2. Use design tools (Figma, Sketch, Photoshop)
3. Use command line tools like ImageMagick

Once you have the PNG files, update manifest.json to include:

"action": {
  "default_popup": "popup.html",
  "default_title": "Meta Tags Checker",
  "default_icon": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
},
"icons": {
  "16": "icons/icon16.png",
  "32": "icons/icon32.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}

The extension will work without icons, but they improve the user experience.
