// @flow

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import type { Charset } from './types';

function cleanDestination(destination: string) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  const protextDirpath = path.resolve(destination, 'protext');
  if (!fs.existsSync(protextDirpath)) {
    fs.mkdirSync(protextDirpath);
  }

  fs
    .readdirSync(protextDirpath)
    .forEach(filename => fs.unlinkSync(path.resolve(protextDirpath, filename)));
}

function getDefaultCharsets(): { source: Charset, target: Charset } {
  const numbers = '1234567890';
  const alphabetsLowercase = 'abcdefghijklmnopqrstuvwxyz';
  const alphabetsUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const charset = [...numbers, ...alphabetsLowercase, ...alphabetsUppercase];

  return {
    source: charset.slice(),
    target: charset.slice(),
  };
}

function generateFontfaces(relativePath: string, names: Array<string>): string {
  const fontfaces = names.map(
    name => `
      @font-face {
      src: url("${relativePath}/protext/${name}.ttf");
      font-family: "protext_${name}";
    }
  `,
  );

  return fontfaces.join('');
}

function generateFontfamilies(names: Array<string>): string {
  const fontfamilies = names.map(name => `"protext_${name}"`);

  return fontfamilies.join(', ');
}

function getStyleTag(
  relativePath: string,
  targetFontFilenames: Array<string>,
  fontFamily: string,
): string {
  console.log(relativePath);

  return `
    <style>
      ${generateFontfaces(relativePath, targetFontFilenames)}

      .protext {
        font-family: ${generateFontfamilies(
          targetFontFilenames,
        )}, "${fontFamily}";
      }
    </style>
  `;
}

function randomString(): string {
  return crypto.randomBytes(16).toString('hex');
}

export default {
  cleanDestination,
  getDefaultCharsets,
  getStyleTag,
  randomString,
};
