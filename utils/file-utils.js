/**
 * Saves the decrypted file to user's disk
 * @param {ArrayBuffer} decryptedFile The decrypted file as buffer
 * @param {String} filename The file name
 */
export function download(decryptedFile, filename) {
  const FileSaver = require('file-saver');
  const file = new File([decryptedFile], filename);
  FileSaver.saveAs(file);
}