const https = require('https');
const fs = require('fs');
const path = require('path');

const CURRENCY_IMAGES = {
  // Using publicly available images from reliable sources
  '50-pound-note.png': 'https://i.imgur.com/YqhWHYL.jpg', // Alan Turing £50
  '20-pound-note.png': 'https://i.imgur.com/QWVXkb5.jpg', // Turner £20
  '10-pound-note.png': 'https://i.imgur.com/8JHxcqL.jpg', // Jane Austen £10
  '5-pound-note.png': 'https://i.imgur.com/2DTWxkN.jpg',  // Churchill £5
  
  // Coins
  '2-pound-coin.png': 'https://i.imgur.com/L5Wpxk7.png',
  '1-pound-coin.png': 'https://i.imgur.com/Y5Kxrj3.png',
  '50-pence-coin.png': 'https://i.imgur.com/JnVc6CQ.png',
  '20-pence-coin.png': 'https://i.imgur.com/xK7Ql2P.png',
  '10-pence-coin.png': 'https://i.imgur.com/2X7MYf9.png',
  '5-pence-coin.png': 'https://i.imgur.com/QWqQWZ3.png',
  '2-pence-coin.png': 'https://i.imgur.com/8YfXLRL.png',
  '1-pence-coin.png': 'https://i.imgur.com/ZZkYxkE.png'
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const targetPath = path.join(__dirname, '..', 'public', 'images', 'currency', filename);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(targetPath);

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        downloadImage(response.headers.location, filename)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(targetPath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
};

const downloadAllImages = async () => {
  console.log('Starting download of currency images...');
  
  for (const [filename, url] of Object.entries(CURRENCY_IMAGES)) {
    try {
      await downloadImage(url, filename);
    } catch (error) {
      console.error(`❌ Error downloading ${filename}:`, error.message);
    }
  }
  
  console.log('Download process completed!');
};

downloadAllImages(); 