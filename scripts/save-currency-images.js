const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Function to save an image
const saveImage = async (name, inputBuffer, type) => {
  const imagesDir = path.join(__dirname, '../public/images/currency');
  ensureDirectoryExists(imagesDir);

  const width = type === 'note' ? 400 : 200;
  const targetPath = path.join(imagesDir, name);

  try {
    await sharp(inputBuffer)
      .resize(width, null, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(targetPath);

    console.log(`Saved ${name}`);
    return true;
  } catch (error) {
    console.error(`Error saving ${name}:`, error.message);
    return false;
  }
};

// Function to create a placeholder image
const createPlaceholder = async (name, type) => {
  const width = type === 'note' ? 400 : 200;
  const height = type === 'note' ? width * 0.5 : width;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666" text-anchor="middle" dy=".3em">
        ${name.replace('.png', '')}
      </text>
    </svg>
  `;

  return Buffer.from(svg);
};

// Process all currency images
const processCurrencyImages = async () => {
  const images = [
    { name: '50.png', type: 'note' },
    { name: '20.png', type: 'note' },
    { name: '10.png', type: 'note' },
    { name: '5.png', type: 'note' },
    { name: '2.png', type: 'coin' },
    { name: '1.png', type: 'coin' },
    { name: '50p.png', type: 'coin' },
    { name: '20p.png', type: 'coin' },
    { name: '10p.png', type: 'coin' },
    { name: '5p.png', type: 'coin' },
    { name: '2p.png', type: 'coin' },
    { name: '1p.png', type: 'coin' }
  ];

  for (const { name, type } of images) {
    const placeholderBuffer = await createPlaceholder(name, type);
    await saveImage(name, placeholderBuffer, type);
  }

  console.log('All currency images processed!');
};

// Run the script
processCurrencyImages().catch(console.error); 