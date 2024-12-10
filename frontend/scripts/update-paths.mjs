import fs from 'fs';
import path from 'path';

const buildPath = path.join(process.cwd(), 'dist');
const indexPath = path.join(buildPath, 'index.html');

fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  let updatedData = data
    .replace(/\/static\/eg-icon.png/g, "{{ url_for('static', filename='eg-icon.png') }}")
    .replace(/\/static\/assets\/([a-zA-Z0-9\-]+)\.js/g, "{{ url_for('static', filename='assets/$1.js') }}")
    .replace(/\/static\/assets\/([a-zA-Z0-9\-]+)\.css/g, "{{ url_for('static', filename='assets/$1.css') }}");

  fs.writeFile(indexPath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing modified index.html:', err);
    } else {
      console.log('index.html updated successfully');
    }
  });
});
