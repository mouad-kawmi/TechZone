const path = require('path');
const fs   = require('fs');
const archiver = require('archiver');

const DIST   = path.resolve(__dirname, '..', 'TechZone-Electro-Store-main', 'dist');
const HTACC  = path.resolve(__dirname, '..', 'TechZone-Electro-Store-main', 'public', '.htaccess');
const DEPLOY = path.resolve(__dirname, 'infinityfree');
const ZIPOUT = path.join(DEPLOY, 'techzone-frontend-optimized-safe.zip');
const SKIP   = ['.br', '.gz'];

if (!fs.existsSync(DIST)) { console.error('❌ dist/ introuvable. Lance npm run build.'); process.exit(1); }
fs.mkdirSync(DEPLOY, { recursive: true });
if (fs.existsSync(ZIPOUT)) fs.unlinkSync(ZIPOUT);

const output  = fs.createWriteStream(ZIPOUT);
const archive = archiver.create('zip', { zlib: { level: 6 } });

output.on('close', () => {
  const mb = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`\n✅ ZIP créé avec succès !`);
  console.log(`📦 Taille : ${mb} MB`);
  console.log(`📁 Fichier : ${ZIPOUT}`);
  console.log(`\n👉 Upload ce fichier dans htdocs sur InfinityFree, puis extrait-le.`);
});
archive.on('warning', w => console.warn('⚠️', w.message));
archive.on('error',   e => { console.error('❌', e); process.exit(1); });
archive.pipe(output);

// Walk dist, skip .br and .gz
(function walk(dir, base) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const arc  = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) { walk(full, arc); }
    else if (!SKIP.includes(path.extname(entry.name))) {
      archive.file(full, { name: arc });
    }
  }
})(DIST, '');

// Add .htaccess from public/ if not already in dist
if (!fs.existsSync(path.join(DIST, '.htaccess')) && fs.existsSync(HTACC)) {
  archive.file(HTACC, { name: '.htaccess' });
  console.log('✅ .htaccess ajouté depuis public/');
} else {
  console.log('✅ .htaccess inclus depuis dist/');
}

archive.finalize();
