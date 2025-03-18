const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure the directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Function to save £20 note
async function save20PoundNote() {
  const outputDir = path.join(__dirname, '../public/images/currency');
  ensureDirectoryExists(outputDir);

  // Create a temporary SVG for the £20 note
  const svg = `
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="200" fill="#E9D8FD"/>
      <text x="200" y="100" font-family="Arial" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">£20</text>
    </svg>
  `;

  try {
    // Save the SVG as PNG
    await sharp(Buffer.from(svg))
      .toFile(path.join(outputDir, '20.png'));

    // Create smaller versions
    await sharp(Buffer.from(svg))
      .resize(300, 150)
      .toFile(path.join(outputDir, '20-md.png'));

    await sharp(Buffer.from(svg))
      .resize(200, 100)
      .toFile(path.join(outputDir, '20-sm.png'));

    // Create WebP versions
    await sharp(Buffer.from(svg))
      .toFormat('webp')
      .toFile(path.join(outputDir, '20.webp'));

    await sharp(Buffer.from(svg))
      .resize(300, 150)
      .toFormat('webp')
      .toFile(path.join(outputDir, '20-md.webp'));

    await sharp(Buffer.from(svg))
      .resize(200, 100)
      .toFormat('webp')
      .toFile(path.join(outputDir, '20-sm.webp'));

    console.log('£20 note saved successfully!');
  } catch (error) {
    console.error('Error saving £20 note:', error);
  }
}

save20PoundNote(); 