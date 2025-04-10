import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const floorPlans: Record<string, string> = {
  'default': 'https://i.imgur.com/JGfIGjH.jpg',
  '1bedroom': 'https://i.imgur.com/8XKFjGz.jpg',
  '2bedroom': 'https://i.imgur.com/JGfIGjH.jpg',
  '3bedroom': 'https://i.imgur.com/vHk2Z5j.jpg',
  '4bedroom': 'https://i.imgur.com/8XKFjGz.jpg',
  'studio': 'https://i.imgur.com/vHk2Z5j.jpg',
};

const outputDir = path.join(__dirname, '../public/images/floor-plans');

// Create the directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Download each floor plan
Object.entries(floorPlans).forEach(([name, url]) => {
  const outputPath = path.join(outputDir, `${name}.jpg`);
  
  console.log(`Downloading ${name} floor plan from ${url}...`);
  
  const file = fs.createWriteStream(outputPath);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${name} floor plan to ${outputPath}`);
    });
  }).on('error', (err) => {
    fs.unlink(outputPath, () => {}); // Delete the file if there's an error
    console.error(`Error downloading ${name} floor plan:`, err.message);
  });
});
