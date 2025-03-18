const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Shared configuration
const sizes = [
  { width: 100, suffix: '-sm' },    // Small devices
  { width: 150, suffix: '-md' },    // Medium devices
  { width: 200, suffix: '' }        // Large devices (original size)
];

// Function to save images in multiple sizes and formats
const saveImage = async (svg, filename, imagesDir) => {
  for (const size of sizes) {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(imagesDir, `${filename}${size.suffix}.png`));

    await sharp(Buffer.from(svg))
      .webp({ quality: 90 })
      .toFile(path.join(imagesDir, `${filename}${size.suffix}.webp`));
  }
};

// Generate SVG for coins
const generateCoinSVG = (size, { denomination, color, isHeptagonal = false }) => {
  const shape = isHeptagonal ? generateHeptagonPoints(size.width) : null;
  
  return `
    <svg width="${size.width}" height="${size.width}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color.light}"/>
          <stop offset="100%" style="stop-color:${color.dark}"/>
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
      ${isHeptagonal 
        ? `<polygon points="${shape}" fill="url(#coinGradient)" stroke="${color.stroke}" stroke-width="${size.width * 0.01}" filter="url(#coinEffect)"/>`
        : `<circle cx="${size.width/2}" cy="${size.width/2}" r="${size.width * 0.475}" fill="url(#coinGradient)" stroke="${color.stroke}" stroke-width="${size.width * 0.01}" filter="url(#coinEffect)"/>`
      }
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial" 
        font-size="${size.width * 0.2}" 
        fill="${color.text}" 
        text-anchor="middle" 
        dy=".3em"
      >
        ${denomination}
      </text>
    </svg>
  `;
};

// Generate SVG for notes
const generateNoteSVG = (size, { denomination, color }) => {
  const width = size.width;
  const height = width * 0.5; // Notes are rectangular, 2:1 ratio
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="noteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color.light}"/>
          <stop offset="100%" style="stop-color:${color.dark}"/>
        </linearGradient>
      </defs>
      <rect 
        x="${width * 0.05}" 
        y="${height * 0.1}" 
        width="${width * 0.9}" 
        height="${height * 0.8}" 
        rx="${height * 0.1}"
        fill="url(#noteGradient)"
        stroke="${color.stroke}"
        stroke-width="${width * 0.01}"
      />
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial" 
        font-size="${width * 0.15}" 
        fill="${color.text}" 
        text-anchor="middle" 
        dy=".3em"
      >
        £${denomination}
      </text>
    </svg>
  `;
};

// Generate heptagon points
const generateHeptagonPoints = (size) => {
  const points = [];
  const sides = 7;
  const radius = size * 0.475;
  const centerX = size / 2;
  const centerY = size / 2;
  
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI / sides) - (Math.PI / 2);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  
  return points.join(' ');
};

module.exports = {
  ensureDirectoryExists,
  sizes,
  saveImage,
  generateCoinSVG,
  generateNoteSVG
}; 