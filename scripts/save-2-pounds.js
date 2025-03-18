const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Save the £2 coin
const save2PoundCoin = async () => {
  const imagesDir = path.join(__dirname, '../public/images/currency');
  ensureDirectoryExists(imagesDir);

  try {
    // Create a temporary SVG placeholder for the coin
    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#D4AF37"/>
            <stop offset="100%" style="stop-color:#C5A028"/>
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="98" fill="url(#coinGradient)" stroke="#B8860B" stroke-width="2"/>
        <circle cx="100" cy="100" r="85" fill="#C0C0C0" stroke="#A8A8A8" stroke-width="1"/>
        <text x="50%" y="50%" font-family="Arial" font-size="48" fill="#333" text-anchor="middle" dy=".3em">
          £2
        </text>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .resize(200, 200, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(imagesDir, '2.png'));

    console.log('£2 coin saved successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Run the script
save2PoundCoin(); 