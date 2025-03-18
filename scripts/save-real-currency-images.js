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

  // Define the images to process with their source data
  const images = [
    // Notes
    { 
      type: 'notes',
      name: '50.png',
      source: 'YOUR_BASE64_DATA_HERE',
      width: 400
    },
    { 
      type: 'notes',
      name: '20.png',
      source: 'YOUR_BASE64_DATA_HERE',
      width: 400
    },
    { 
      type: 'notes',
      name: '10.png',
      source: 'YOUR_BASE64_DATA_HERE',
      width: 400
    },
    { 
      type: 'notes',
      name: '5.png',
      source: 'YOUR_BASE64_DATA_HERE',
      width: 400
    },
    // Coins
    { 
      type: 'coins',
      name: '2.png',
      source: 'YOUR_BASE64_DATA_HERE',
      width: 200
    },
    { 
      type: 'coins',
      name: '1.png',
      source: 'YOUR_BASE64_DATA_HERE',
      width: 200
    },
    { 
      type: 'coins',
      name: '50p.png',
      source: 'YOUR_BASE64_DATA_HERE',
      width: 200
    },
    { 
      type: 'coins',
      name: '20p.png',
      source: 'YOUR_BASE64_DATA_HERE',
      width: 200
    },
    { 
      type: 'coins',
      name: '10p.png',
      source: 'YOUR_BASE64_DATA_HERE',
      width: 200
    },
    { 
      type: 'coins',
      name: '5p.png',
      source: 'YOUR_BASE64_DATA_HERE',
      width: 200
    },
    { 
      type: 'coins',
      name: '2p.png',
      source: 'YOUR_BASE64_DATA_HERE',
      width: 200
    },
    { 
      type: 'coins',
      name: '1p.png',
      source: 'YOUR_BASE64_DATA_HERE',
      width: 200
    }
  ];

  // Process each image
  for (const { type, name, source, width } of images) {
    const targetDir = type === 'notes' ? notesDir : coinsDir;
    const targetPath = path.join(targetDir, name);

    try {
      // Convert base64 to buffer
      const imageBuffer = Buffer.from(source, 'base64');

      // Process with sharp
      await sharp(imageBuffer)
        .resize(width, null, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(targetPath);

      console.log(`Processed ${name}`);
    } catch (error) {
      console.error(`Error processing ${name}:`, error.message);
    }
  }

  console.log('All images processed!');
};

// Run the script
(async () => {
  try {
    await processImages();
  } catch (error) {
    console.error('Error:', error);
  }
})(); 