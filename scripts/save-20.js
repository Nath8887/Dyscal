const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Save the £20 note
const save20PoundNote = async () => {
  const imagesDir = path.join(__dirname, '../public/images/currency');
  ensureDirectoryExists(imagesDir);

  try {
    // Create a temporary SVG placeholder
    const svg = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#9B4F96"/>
        <text x="50%" y="50%" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dy=".3em">
          £20
        </text>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .resize(400, null, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(imagesDir, '20.png'));

    console.log('£20 note saved successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Run the script
save20PoundNote(); 