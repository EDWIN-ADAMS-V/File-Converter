const libre = require('libreoffice-convert');
const path = require('path');
const fs = require('fs');

function convertFile(inputPath, format) {
  return new Promise((resolve, reject) => {
    const ext = '.' + format;
    const outputPath = path.join(__dirname, 'converted', path.basename(inputPath) + ext);
    const file = fs.readFileSync(inputPath);

    libre.convert(file, ext, undefined, (err, done) => {
      if (err) return reject('Conversion error: ' + err);
      fs.writeFileSync(outputPath, done);
      resolve(outputPath);
    });
  });
}

module.exports = { convertFile };
