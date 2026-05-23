// Simple script to create placeholder PNG files
const fs = require('fs');
const path = require('path');

// Minimal valid PNG (1x1 pixel blue)
const createMinimalPNG = () => {
  // This is a base64 encoded 1x1 blue pixel PNG
  const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  return Buffer.from(base64, 'base64');
};

const assetsDir = path.join(__dirname, 'assets');

// Create assets directory if not exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create all required assets
const files = [
  'icon.png',
  'adaptive-icon.png',
  'splash.png',
  'favicon.png'
];

files.forEach(file => {
  const filePath = path.join(assetsDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, createMinimalPNG());
    console.log(`Created: ${file}`);
  }
});

console.log('All assets created!');