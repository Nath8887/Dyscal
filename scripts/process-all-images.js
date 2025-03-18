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
const saveImage = async (name, imageBuffer, type) => {
  const imagesDir = path.join(__dirname, '../public/images/currency');
  ensureDirectoryExists(imagesDir);

  const width = type === 'note' ? 400 : 200;
  const targetPath = path.join(imagesDir, name);

  try {
    await sharp(imageBuffer)
      .resize(width, null, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(targetPath);

    console.log(`Saved ${name}`);
  } catch (error) {
    console.error(`Error saving ${name}:`, error.message);
  }
};

// Function to process an image from the clipboard
const processImageFromClipboard = async (name, type) => {
  try {
    // Create a temporary file path
    const tempPath = path.join(__dirname, `temp-${name}`);
    
    // Save the clipboard image to the temp file
    // You'll need to paste the image into this file
    
    // Read and process the image
    if (fs.existsSync(tempPath)) {
      const imageBuffer = fs.readFileSync(tempPath);
      await saveImage(name, imageBuffer, type);
      
      // Clean up temp file
      fs.unlinkSync(tempPath);
      console.log(`Processed ${name} successfully!`);
    } else {
      console.error(`Temp file for ${name} not found. Please paste the image first.`);
    }
  } catch (error) {
    console.error(`Error processing ${name}:`, error.message);
  }
};

// Process all images
const processAllImages = async () => {
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
    await processImageFromClipboard(name, type);
  }
};

// Run the script
processAllImages().catch(console.error); 