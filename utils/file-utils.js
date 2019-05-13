export function download(decryptedFile, filename) {
  const FileSaver = require('file-saver');
  const file = new File([decryptedFile], filename);
  FileSaver.saveAs(file);
}