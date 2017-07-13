// @flow

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import type { Charset } from './types';

function cleanDestination(destination: string) {
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

function generateFontfaces(name: string, count: number): string {
  const fontfaces = [];

  for (let i = 0; i < count; i += 1) {
    fontfaces.push(`
      @font-face {
        src: url("protext/${name}_${i}.ttf");
        font-family: "protext_${i}";
      }
    `);
  }

  return fontfaces.join('');
}

function generateFontfamilies(count: number): string {
  const fontfamilies = [];

  for (let i = 0; i < count; i += 1) {
    fontfamilies.push(`"protext_${i}"`);
  }

  return fontfamilies.join(', ');
}

function getStyleTag(targetFontFilename: string, fontFamily: string, targetFontFileCount: number): string {
  return (`
    <style>
      ${generateFontfaces(targetFontFilename, targetFontFileCount)}

      .protext {
        font-family: ${generateFontfamilies(targetFontFileCount)}, "${fontFamily}";
      }
    </style>
  `);
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
