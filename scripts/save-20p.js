const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Save the 20p coin
const save20pCoin = async () => {
  const imagesDir = path.join(__dirname, '../public/images/currency');
  ensureDirectoryExists(imagesDir);

  try {
    // Create heptagon points for the 20p shape
    const points = [];
    const sides = 7;
    const radius = 95;
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI / sides) - (Math.PI / 2); // Start from top
      const x = 100 + radius * Math.cos(angle);
      const y = 100 + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }

    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#E0E0E0"/>
            <stop offset="100%" style="stop-color:#B8B8B8"/>
          </linearGradient>
        </defs>
        <polygon points="${points.join(' ')}" fill="url(#coinGradient)" stroke="#A0A0A0" stroke-width="2"/>
        <text x="50%" y="50%" font-family="Arial" font-size="40" fill="#333" text-anchor="middle" dy=".3em">
          20p
        </text>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .resize(200, 200, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(imagesDir, '20p.png'));

    console.log('20p coin saved successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Run the script
save20pCoin(); 