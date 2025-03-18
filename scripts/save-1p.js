const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Save the 1p coin in multiple sizes
const save1pCoin = async () => {
  const imagesDir = path.join(__dirname, '../public/images/currency');
  ensureDirectoryExists(imagesDir);

  // Define sizes for different devices
  const sizes = [
    { width: 100, suffix: '-sm' },    // Small devices
    { width: 150, suffix: '-md' },    // Medium devices
    { width: 200, suffix: '' }        // Large devices (original size)
  ];

  try {
    for (const size of sizes) {
      const svg = `
        <svg width="${size.width}" height="${size.width}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#E6A278"/>
              <stop offset="100%" style="stop-color:#B87333"/>
            </linearGradient>
            <filter id="coinEffect">
              <feGaussianBlur in="SourceAlpha" stdDeviation="${size.width * 0.01}" result="blur"/>
              <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75" specularExponent="20" lighting-color="#white" result="specOut">
                <fePointLight x="${size.width/2}" y="${size.width/2}" z="${size.width}"/>
              </feSpecularLighting>
              <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut2"/>
              <feComposite in="SourceGraphic" in2="specOut2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
            </filter>
          </defs>
          <circle 
            cx="${size.width/2}" 
            cy="${size.width/2}" 
            r="${size.width * 0.475}" 
            fill="url(#copperGradient)" 
            stroke="#8B4513" 
            stroke-width="${size.width * 0.01}" 
            filter="url(#coinEffect)"
          />
          <text 
            x="50%" 
            y="50%" 
            font-family="Arial" 
            font-size="${size.width * 0.2}" 
            fill="#4A2511" 
            text-anchor="middle" 
            dy=".3em"
          >
            1p
          </text>
        </svg>
      `;

      await sharp(Buffer.from(svg))
        .png()
        .toFile(path.join(imagesDir, `1p${size.suffix}.png`));

      // Create WebP version for modern browsers
      await sharp(Buffer.from(svg))
        .webp({ quality: 90 })
        .toFile(path.join(imagesDir, `1p${size.suffix}.webp`));
    }

    console.log('1p coin saved successfully in multiple sizes and formats!');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Run the script
save1pCoin(); 