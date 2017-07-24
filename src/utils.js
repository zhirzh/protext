// @flow

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import type { Charset } from './types';

/**
 * Empty `destination` directory
 */
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

/**
 * Return default charactersets
 */
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

/**
 * Generate [`font-face`](https://developer.mozilla.org/docs/Web/CSS/@font-face) CSS rules.
 */
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

/**
 * Generate [`font-family`](https://developer.mozilla.org/docs/Web/CSS/font-family) names of split fontsheets.
 */
function generateFontfamilies(names: Array<string>): string {
  const fontfamilies = names.map(name => `"protext_${name}"`);

  return fontfamilies.join(', ');
}

/**
 * Generate [`<style />`](https://developer.mozilla.org/docs/Web/HTML/Element/style) using split fontsheets.
 */
function generateStyleTag(
  relativePath: string,
  targetFontFilenames: Array<string>,
  fontFamily: string,
): string {
  return `
    <style>
      ${generateFontfaces(relativePath, targetFontFilenames)}

      .protext {
        font-family: ${generateFontfamilies(targetFontFilenames)}, "${fontFamily}";
      }
    </style>
  `;
}

/**
 * Generate a random string of length 32
 */
function randomString(): string {
  return crypto.randomBytes(16).toString('hex');
}

export default {
  cleanDestination,
  getDefaultCharsets,
  generateStyleTag,
  randomString,
};
