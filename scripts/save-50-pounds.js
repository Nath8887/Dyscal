const fs = require('fs');
const path = require('path');
const saveImage = require('./save-currency');

// Save the £50 note
(async () => {
  try {
    const imageBuffer = fs.readFileSync(path.join(__dirname, 'temp-50.png'));
    await saveImage('50.png', imageBuffer, 'note');
    console.log('£50 note saved successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
})(); 