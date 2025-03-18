const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Save the images to the public directory
const saveImages = async () => {
  const imagesDir = path.join(__dirname, '../public/images/currency');
  ensureDirectoryExists(imagesDir);

  // Clean up any existing files
  if (fs.existsSync(imagesDir)) {
    fs.readdirSync(imagesDir).forEach(file => {
      fs.unlinkSync(path.join(imagesDir, file));
    });
  }

  // Create placeholder images
  const images = [
    { name: '50.png', type: 'note', width: 400 },
    { name: '20.png', type: 'note', width: 400 },
    { name: '10.png', type: 'note', width: 400 },
    { name: '5.png', type: 'note', width: 400 },
    { name: '2.png', type: 'coin', width: 200 },
    { name: '1.png', type: 'coin', width: 200 },
    { name: '50p.png', type: 'coin', width: 200 },
    { name: '20p.png', type: 'coin', width: 200 },
    { name: '10p.png', type: 'coin', width: 200 },
    { name: '5p.png', type: 'coin', width: 200 },
    { name: '2p.png', type: 'coin', width: 200 },
    { name: '1p.png', type: 'coin', width: 200 }
  ];

  // Create each placeholder image
  for (const { name, type, width } of images) {
    const targetPath = path.join(imagesDir, name);
    const height = type === 'note' ? width * 0.5 : width;

    try {
      const placeholderSvg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f0f0f0"/>
          <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666" text-anchor="middle" dy=".3em">
            ${name.replace('.png', '')}
          </text>
        </svg>
      `;

      await sharp(Buffer.from(placeholderSvg))
        .png()
        .toFile(targetPath);

      console.log(`Created placeholder for ${name}`);
    } catch (error) {
      console.error(`Error creating ${name}:`, error.message);
    }
  }

  console.log('All placeholders created!');
};

// Run the script
saveImages().catch(console.error); 