const fs = require('fs');
const path = require('path');

// Copy _redirects file from public to build folder
const source = path.join(__dirname, 'public', '_redirects');
const destination = path.join(__dirname, 'build', '_redirects');

try {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, destination);
    console.log('✅ _redirects file copied to build folder');
  } else {
    console.log('⚠️ _redirects file not found in public folder');
  }
} catch (error) {
  console.error('❌ Error copying _redirects file:', error.message);
}