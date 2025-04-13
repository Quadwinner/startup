import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'https://images.unsplash.com/photo-1542751371-adc38448a05e';
const imagePath = path.join(__dirname, 'public', 'images', 'tournaments-bg.jpg');

console.log('Downloading tournament background image...');

const file = fs.createWriteStream(imagePath);
https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log(`Image downloaded successfully to ${imagePath}`);
  });
}).on('error', (err) => {
  fs.unlink(imagePath, () => {});
  console.error('Error downloading image:', err.message);
}); 