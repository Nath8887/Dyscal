const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Save a single image
const saveImage = async (name, imageBuffer, type) => {
  const imagesDir = path.join(__dirname, '../public/images/currency');
  ensureDirectoryExists(imagesDir);

  const width = type === 'note' ? 400 : 200;
  const targetPath = path.join(imagesDir, name);

  try {
    await sharp(imageBuffer)
      .resize(width, null, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(targetPath);

    console.log(`Saved ${name}`);
  } catch (error) {
    console.error(`Error saving ${name}:`, error.message);
  }
};

// Export the save function
module.exports = saveImage; 