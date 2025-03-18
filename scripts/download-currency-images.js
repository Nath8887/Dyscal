const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  {
    url: 'https://raw.githubusercontent.com/nathanhiams/currency-images/main/gbp/notes/50-pounds.jpg',
    filename: '50-pounds.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/nathanhiams/currency-images/main/gbp/notes/20-pounds.jpg',
    filename: '20-pounds.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/nathanhiams/currency-images/main/gbp/notes/10-pounds.jpg',
    filename: '10-pounds.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/nathanhiams/currency-images/main/gbp/notes/5-pounds.jpg',
    filename: '5-pounds.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/nathanhiams/currency-images/main/gbp/coins/2-pounds.png',
    filename: '2-pounds.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/nathanhiams/currency-images/main/gbp/coins/1-pound.png',
    filename: '1-pound.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/nathanhiams/currency-images/main/gbp/coins/50-pence.png',
    filename: '50-pence.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/nathanhiams/currency-images/main/gbp/coins/20-pence.png',
    filename: '20-pence.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/nathanhiams/currency-images/main/gbp/coins/10-pence.png',
    filename: '10-pence.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/nathanhiams/currency-images/main/gbp/coins/5-pence.png',
    filename: '5-pence.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/nathanhiams/currency-images/main/gbp/coins/2-pence.png',
    filename: '2-pence.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/nathanhiams/currency-images/main/gbp/coins/1-pence.png',
    filename: '1-penny.jpg'
  }
];

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../public/images/currency', filename);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

async function downloadAll() {
  try {
    // Create directory if it doesn't exist
    const dir = path.join(__dirname, '../public/images/currency');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    for (const image of images) {
      try {
        await downloadImage(image.url, image.filename);
      } catch (error) {
        console.error(`Error downloading ${image.filename}:`, error.message);
      }
    }
    console.log('All images processed!');
  } catch (error) {
    console.error('Error in download process:', error);
  }
}

downloadAll(); 