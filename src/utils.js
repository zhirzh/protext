import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function cleanDestination(destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdir(destination);
  }

  const protextDirpath = path.resolve(destination, 'protext');
  if (!fs.existsSync(protextDirpath)) {
    fs.mkdirSync(protextDirpath);
  }

  fs
    .readdirSync(protextDirpath)
    .forEach(filename => fs.unlinkSync(path.resolve(protextDirpath, filename)));
}

function getDefaultCharsets() {
  const numbers = '1234567890';
  const alphabetsLowercase = 'abcdefghijklmnopqrstuvwxyz';
  const alphabetsUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const charset = [...numbers, ...alphabetsLowercase, ...alphabetsUppercase];

  return {
    source: charset.slice(),
    target: charset.slice(),
  };
}

function randomString() {
  return crypto.randomBytes(16).toString('hex');
}

export default {
  cleanDestination,
  getDefaultCharsets,
  randomString,
};
