import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// import opentype from 'opentype.js';
const opentype = require('opentype.js');

import errors from './errors';

function getDefaultCharsets() {
  const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(
    '',
  );

  return {
    source: charset.slice(),
    target: charset.slice(),
  };
}

function randomString() {
  return crypto.randomBytes(16).toString('hex');
}

function validateOptions(options) {
  switch (true) {
    // options
    case options.constructor !== Object:
      return errors['options-not-object'];

    // options.font
    case options.font === undefined:
    case options.font === null:
      return errors['font-not-defined'];

    case options.font.constructor !== String:
      return errors['font-not-string'];

    // options.charsets
    case 'charsets' in options:
      switch (true) {
        case options.charsets === undefined:
        case options.charsets === null:
          return errors['charsets-not-defined'];

        case options.charsets.constructor !== Object:
          return errors['charsets-not-object'];

        // options.charsets.source
        case options.charsets.source === undefined:
        case options.charsets.source === null:
          return errors['source-not-defined'];

        case options.charsets.source.constructor !== Array:
          return errors['source-not-array'];

        // options.charsets.target
        case options.charsets.target === undefined:
        case options.charsets.target === null:
          return errors['target-not-defined'];

        case options.charsets.target.constructor !== Array:
          return errors['target-not-array'];

        // options.charsets.{source,target}
        case options.charsets.target.length < options.charsets.source.length:
          return errors['target-smaller-than-source'];

        default:
          return null;
      }

    // options.destination
    case options.destination === undefined:
    case options.destination === null:
      return errors['destination-not-defined'];

    case options.destination.constructor !== String:
      return errors['destination-not-string'];

    default:
      return null;
  }
}

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

function populateMapper(
  mapper,
  { charsets } = { charsets: getDefaultCharsets() },
) {
  const { source: sourceCharset, target: targetCharset } = charsets;

  sourceCharset.forEach(sourceChar => {
    const randomIdx = Math.floor(targetCharset.length * Math.random());
    const targetChar = targetCharset.splice(randomIdx, 1)[0];

    mapper.set(sourceChar, targetChar);
  });
}

function generateTargetFont(mapper, { font: sourceFontPath }) {
  const sourceFont = opentype.loadSync(sourceFontPath);

  const glyphs = [sourceFont.glyphs.get(0)];

  Array.from(mapper.entries()).forEach(([sourceChar, targetChar]) => {
    const sourceGlyph = sourceFont.charToGlyph(sourceChar);
    const targetGlyph = new opentype.Glyph(sourceFont.charToGlyph(targetChar));

    targetGlyph.path = sourceGlyph.path;
    glyphs.push(targetGlyph);
  });

  const targetFont = new opentype.Font({
    familyName: randomString(),
    styleName: randomString(),
    unitsPerEm: sourceFont.unitsPerEm,
    ascender: sourceFont.ascender,
    descender: sourceFont.descender,

    glyphs,
  });

  return targetFont;
}

function writeTargetFont(targetFont, { destination }) {
  const targetFontFilename = `${randomString()}.ttf`;
  const protextDirpath = path.resolve(destination, 'protext');
  targetFont.download(path.resolve(protextDirpath, targetFontFilename));

  return targetFontFilename;
}

function encode(mapper, sourceText) {
  const targetText = sourceText
    .split('')
    .map(sourceChar => mapper.get(sourceChar) || sourceChar)
    .join('');
  return targetText;
}

function encodeFile(destination, targetFontFilename, filepath) {
  const filename = path.basename(filepath).replace(/(.tmpl)?$/, '');

  let html = fs.readFileSync(filepath, 'utf8');

  const protextStyleRegexp = new RegExp('{{protext}}', 'g');
  const sourceTextRegexp = new RegExp(
    '{{#protext}}([\\s\\S]*?){{/protext}}',
    'g',
  );

  html = html.replace(
    protextStyleRegexp,
    `<style>
      @font-face {
        font-family: "protext";
        src: url("protext/${targetFontFilename}");
      }

      .protext {
        font-family: "protext";
      }
    </style>`,
  );

  html = html.replace(
    sourceTextRegexp,
    (_, p1) => `<span class="protext">${encode(p1)}</span>`,
  );

  fs.writeFileSync(path.resolve(destination, filename), html);
}

function protext(options) {
  const err = validateOptions(options);
  if (err !== null) {
    throw err;
  }

  cleanDestination(options.destination);

  const mapper = new Map();
  populateMapper(mapper, options.charsets);

  const targetFont = generateTargetFont(mapper, options);
  const targetFontFilename = writeTargetFont(targetFont, options);

  return {
    encode(sourceText) {
      return encode(mapper, sourceText);
    },

    encodeFile(filepath) {
      return encodeFile(options.destination, targetFontFilename, filepath);
    },
  };
}

export default protext;
