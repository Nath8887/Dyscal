const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Save the 5p coin
const save5pCoin = async () => {
  const imagesDir = path.join(__dirname, '../public/images/currency');
  ensureDirectoryExists(imagesDir);

  try {
    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#E8E8E8"/>
            <stop offset="100%" style="stop-color:#C0C0C0"/>
          </linearGradient>
          <filter id="coinEffect">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75" specularExponent="20" lighting-color="#white" result="specOut">
              <fePointLight x="100" y="100" z="200"/>
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut2"/>
            <feComposite in="SourceGraphic" in2="specOut2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
          </filter>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#coinGradient)" stroke="#A0A0A0" stroke-width="2" filter="url(#coinEffect)"/>
        <text x="50%" y="50%" font-family="Arial" font-size="40" fill="#333" text-anchor="middle" dy=".3em">
          5p
        </text>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .resize(200, 200, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(imagesDir, '5p.png'));

    console.log('5p coin saved successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Run the script
save5pCoin(); 