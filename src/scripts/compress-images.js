import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');
const files = ['tarih.jpg', 'turkce.jpg', 'edebiyat.jpg', 'geometri.jpg', 'biyoloji.jpg', 'fizik.jpg', 'kimya.jpg'];

async function compressImages() {
  console.log("Starting image compression...");
  
  for (const file of files) {
    const filePath = path.join(publicDir, file);
    if (fs.existsSync(filePath)) {
      const tempPath = path.join(publicDir, `temp_${file}`);
      const originalSize = fs.statSync(filePath).size;
      
      try {
        // Görselleri yeniden boyutlandırıp (maksimum 800px genişlik)
        // kalitesini 80'e çekerek sıkıştırıyoruz
        await sharp(filePath)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80, progressive: true })
          .toFile(tempPath);
          
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        
        const newSize = fs.statSync(filePath).size;
        console.log(`✓ ${file}: ${(originalSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB`);
      } catch (err) {
        console.error(`Error compressing ${file}:`, err);
      }
    }
  }
  console.log("Image compression process completed.");
}

compressImages();
