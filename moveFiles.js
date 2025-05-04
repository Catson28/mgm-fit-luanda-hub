const fs = require('fs');
const path = require('path');

const sourceBase = 'C:/Catson/Projectos/Framework/Next_2025/copias/tudo';
const destBase = 'C:/Catson/Projectos/Framework/Next_2025/copias/auth-with-jwt-test-2025';

const files = [
  'src/services/types/index.ts',
];

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Mover arquivos (substitui se existir)
files.forEach(relativePath => {
  const sourcePath = path.join(sourceBase, relativePath);
  const destPath = path.join(destBase, relativePath);

  try {
    if (fs.existsSync(sourcePath)) {
      ensureDirectoryExistence(destPath);
      // Remove o arquivo de destino se existir
      if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
      }
      fs.renameSync(sourcePath, destPath);
      console.log(`Movido: ${sourcePath} -> ${destPath}`);
    } else {
      console.log(`Arquivo de origem não encontrado: ${sourcePath}`);
    }
  } catch (err) {
    console.error(`Erro ao mover ${sourcePath}:`, err.message);
  }
});

console.log('Movimento de arquivos concluído.');