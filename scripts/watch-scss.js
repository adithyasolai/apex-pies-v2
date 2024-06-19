const fs = require('fs');
const path = require('path');  // Required for path manipulation

const watchedDir = 'src/scss/'; // Replace with your directory path
const scriptToRun = './render-scss'; // Replace with your script path
const renderCSS = require(scriptToRun); // import scss --> css render script

// Recursive function to check for changes in the directory and subdirectories
function watchDir(dir) {
  fs.readdirSync(dir).forEach((item) => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      watchDir(fullPath); // Recursively watch subdirectories
    } else {
      fs.watch(fullPath, (eventType, filename) => {
        if (eventType === 'change') {
          console.log(`File changed: ${filename}`);

          console.log("running render-scss script from watch-scss script...")
          renderCSS()
        }
      });
    }
  });
}

watchDir(watchedDir);
console.log(`Watching directory: ${watchedDir}`);