const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Process and save images
const processImages = async () => {
  const notesDir = path.join(__dirname, '../public/images/currency/notes');
  const coinsDir = path.join(__dirname, '../public/images/currency/coins');
  
  // Create directories
  ensureDirectoryExists(notesDir);
  ensureDirectoryExists(coinsDir);

  // Define the images to process
  const images = [
    { type: 'notes', name: '50.png', width: 400 },
    { type: 'notes', name: '20.png', width: 400 },
    { type: 'notes', name: '10.png', width: 400 },
    { type: 'notes', name: '5.png', width: 400 },
    { type: 'coins', name: '2.png', width: 200 },
    { type: 'coins', name: '1.png', width: 200 },
    { type: 'coins', name: '50p.png', width: 200 },
    { type: 'coins', name: '20p.png', width: 200 },
    { type: 'coins', name: '10p.png', width: 200 },
    { type: 'coins', name: '5p.png', width: 200 },
    { type: 'coins', name: '2p.png', width: 200 },
    { type: 'coins', name: '1p.png', width: 200 }
  ];

  // Process each image
  for (const { type, name, width } of images) {
    const targetDir = type === 'notes' ? notesDir : coinsDir;
    const targetPath = path.join(targetDir, name);

    try {
      // Create a placeholder for now - we'll replace this with actual image processing
      const placeholderSvg = `
        <svg width="${width}" height="${width * (type === 'notes' ? 0.5 : 1)}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f0f0f0"/>
          <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666" text-anchor="middle" dy=".3em">
            ${name.replace('.png', '')}
          </text>
        </svg>
      `;

      await sharp(Buffer.from(placeholderSvg))
        .png()
        .toFile(targetPath);

      console.log(`Processed ${name}`);
    } catch (error) {
      console.error(`Error processing ${name}:`, error.message);
    }
  }

  console.log('All images processed!');
};

// Install sharp if not already installed
const installDependencies = () => {
  const { execSync } = require('child_process');
  try {
    require('sharp');
    console.log('sharp is already installed');
  } catch (error) {
    console.log('Installing sharp...');
    execSync('npm install sharp', { stdio: 'inherit' });
  }
};

// Run the script
(async () => {
  try {
    installDependencies();
    await processImages();
  } catch (error) {
    console.error('Error:', error);
  }
})(); 