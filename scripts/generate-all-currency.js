const path = require('path');
const {
  ensureDirectoryExists,
  sizes,
  saveImage,
  generateCoinSVG,
  generateNoteSVG
} = require('./currency-utils');

// Currency configurations
const notes = [
  { denomination: '50', color: { light: '#FF9999', dark: '#CC0000', stroke: '#990000', text: '#FFFFFF' } },
  { denomination: '20', color: { light: '#E6B3FF', dark: '#660099', stroke: '#4D0073', text: '#FFFFFF' } },
  { denomination: '10', color: { light: '#E6A278', dark: '#B15D28', stroke: '#8B4513', text: '#FFFFFF' } },
  { denomination: '5', color: { light: '#99E6CC', dark: '#4C9B8F', stroke: '#2D5C54', text: '#FFFFFF' } }
];

const coins = [
  { denomination: '2', color: { light: '#E8E8E8', dark: '#B8B8B8', stroke: '#A0A0A0', text: '#333333' }, isHeptagonal: false },
  { denomination: '1', color: { light: '#E8E8E8', dark: '#B8B8B8', stroke: '#A0A0A0', text: '#333333' }, isHeptagonal: false },
  { denomination: '50p', color: { light: '#E8E8E8', dark: '#B8B8B8', stroke: '#A0A0A0', text: '#333333' }, isHeptagonal: true },
  { denomination: '20p', color: { light: '#E8E8E8', dark: '#B8B8B8', stroke: '#A0A0A0', text: '#333333' }, isHeptagonal: true },
  { denomination: '10p', color: { light: '#E8E8E8', dark: '#B8B8B8', stroke: '#A0A0A0', text: '#333333' }, isHeptagonal: false },
  { denomination: '5p', color: { light: '#E8E8E8', dark: '#B8B8B8', stroke: '#A0A0A0', text: '#333333' }, isHeptagonal: false },
  { denomination: '2p', color: { light: '#E6A278', dark: '#B87333', stroke: '#8B4513', text: '#4A2511' }, isHeptagonal: false },
  { denomination: '1p', color: { light: '#E6A278', dark: '#B87333', stroke: '#8B4513', text: '#4A2511' }, isHeptagonal: false }
];

const generateAllCurrency = async () => {
  const imagesDir = path.join(__dirname, '../public/images/currency');
  ensureDirectoryExists(imagesDir);

  try {
    // Generate notes
    for (const note of notes) {
      console.log(`Generating £${note.denomination} note...`);
      for (const size of sizes) {
        const svg = generateNoteSVG(size, note);
        await saveImage(svg, note.denomination, imagesDir);
      }
    }

    // Generate coins
    for (const coin of coins) {
      console.log(`Generating ${coin.denomination} coin...`);
      for (const size of sizes) {
        const svg = generateCoinSVG(size, coin);
        await saveImage(svg, coin.denomination, imagesDir);
      }
    }

    console.log('All currency images generated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Run the script
generateAllCurrency(); 