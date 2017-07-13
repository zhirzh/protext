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

function getStyleTag(targetFontFilename: string, fontFamily: string): string {
  return (`
    <style>
      @font-face {
        font-family: "protext";
        src: url("protext/${targetFontFilename}");
      }

      .protext {
        font-family: "protext", "${fontFamily}";
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
