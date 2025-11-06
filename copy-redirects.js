const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'public', '_redirects');
const dest = path.join(__dirname, 'build', '_redirects');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('Copied _redirects to build folder.');
} else {
  console.warn('_redirects file not found in public folder.');
}
