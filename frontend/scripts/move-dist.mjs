import fs from 'fs-extra';
import path from 'path';

const distPath = path.join(process.cwd(), 'dist');
const templatesPath = path.resolve(process.cwd(), '..', 'public');
const staticPath = path.resolve(process.cwd(), '..', 'backend', 'static');

const indexPath = path.join(distPath, 'index.html');
const targetIndexPath = path.join(templatesPath, 'index.html');
fs.moveSync(indexPath, targetIndexPath, { overwrite: true });

if (!fs.existsSync(staticPath)) {
  fs.mkdirSync(staticPath, { recursive: true });
}

const files = fs.readdirSync(distPath);
console.log('Files in dist:', files);

files.forEach(file => {
  const src = path.join(distPath, file);
  const dest = path.join(staticPath, file);

  console.log(`Moving file from ${src} to ${dest}`);
  fs.moveSync(src, dest, { overwrite: true });
});

fs.removeSync(distPath);
