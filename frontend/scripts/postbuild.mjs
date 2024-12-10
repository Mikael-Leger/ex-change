import fs from 'fs-extra';
import path from 'path';

// Définir les chemins des dossiers
const distPath = path.join(process.cwd(), 'dist');
const templatesPath = path.resolve(process.cwd(), '..', 'backend', 'templates'); // Revenir d'un niveau avec '..'
const staticPath = path.resolve(process.cwd(), '..', 'backend', 'static'); // Revenir d'un niveau avec '..'

// Déplacer index.html vers templates
const indexPath = path.join(distPath, 'index.html');
console.log(indexPath); // Affiche le chemin d'index.html
const targetIndexPath = path.join(templatesPath, 'index.html');
console.log(targetIndexPath); // Affiche le chemin cible de index.html
fs.moveSync(indexPath, targetIndexPath, { overwrite: true });

// Déplacer le reste des fichiers vers static
const files = fs.readdirSync(distPath);
files.forEach(file => {
  const src = path.join(distPath, file);
  const dest = path.join(staticPath, file);
  fs.moveSync(src, dest, { overwrite: true });
});

// Supprimer le dossier dist après le déplacement
fs.removeSync(distPath);
