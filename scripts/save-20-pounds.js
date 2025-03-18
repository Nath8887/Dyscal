const fs = require('fs');
const path = require('path');
const saveImage = require('./save-currency');

// Save the £20 note
(async () => {
  try {
    const imageBuffer = fs.readFileSync(path.join(__dirname, 'temp-20.png'));
    await saveImage('20.png', imageBuffer, 'note');
    console.log('£20 note saved successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
})(); 