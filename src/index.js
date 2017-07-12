import fs from 'fs';
import path from 'path';

import utils from './utils';
import validateOptions from './validate-options';

// import opentype from 'opentype.js';
const opentype = require('opentype.js');

class Protext {
  constructor(options) {
    const err = validateOptions(options);
    if (err !== null) {
      throw err;
    }

    this.unpackOptions(options);

    utils.cleanDestination(this.destination);

    this.mapper = this.generateMapper();
    this.targetFont = this.generateTargetFont();
    this.targetFontFilename = this.writeTargetFont();

    return {
      encodeText: this.encodeText.bind(this),
      encodeHtml: this.encodeHtml.bind(this),
    };
  }

  encodeText(sourceText) {
    const targetText = sourceText
      .split('')
      .map(sourceChar => this.mapper.get(sourceChar) || sourceChar)
      .join('');

    return targetText;
  }

  encodeHead(html) {
    const protextStyleRegexp = new RegExp('{{protext}}', 'g');

    const encodedHtml = html.replace(
      protextStyleRegexp,
      `<style>
        @font-face {
          font-family: "protext";
          src: url("protext/${this.targetFontFilename}");
        }

        .protext {
          font-family: "protext", "${this.fontFamily}";
        }
      </style>`,
    );

    return encodedHtml;
  }

  encodeBody(html) {
    const sourceTextRegexp = new RegExp(
      '{{#protext}}([\\s\\S]*?){{/protext}}',
      'g',
    );

    const encodedHtml = html.replace(
      sourceTextRegexp,
      (_, p1) => `<span class="protext">${this.encodeText(p1)}</span>`,
    );

    return encodedHtml;
  }

  encodeHtml(filepath) {
    const filename = path.basename(filepath).replace(/(.tmpl)?$/, '');

    let html = fs.readFileSync(filepath, 'utf8');

    html = this.encodeHead(html);
    html = this.encodeBody(html);

    fs.writeFileSync(path.resolve(this.destination, filename), html);
  }

  unpackOptions(options) {
    this.destination = options.destination;

    this.sourceFont = opentype.loadSync(options.font);

    const charsets = options.charsets || utils.getDefaultCharsets();
    this.sourceCharset = charsets.source;
    this.targetCharset = charsets.target;

    this.fontFamily = options.fontFamily || this.sourceFont.names.fontFamily.en;
  }

  generateMapper() {
    const mapper = new Map();

    this.sourceCharset.forEach(sourceChar => {
      const randomIdx = Math.floor(this.targetCharset.length * Math.random());
      const targetChar = this.targetCharset.splice(randomIdx, 1)[0];

      mapper.set(sourceChar, targetChar);
    });

    return mapper;
  }

  generateTargetFont() {
    const glyphs = [this.sourceFont.glyphs.get(0)];

    Array.from(this.mapper.entries()).forEach(([sourceChar, targetChar]) => {
      const sourceGlyph = this.sourceFont.charToGlyph(sourceChar);
      const targetGlyph = new opentype.Glyph(
        this.sourceFont.charToGlyph(targetChar),
      );

      targetGlyph.path = sourceGlyph.path;
      glyphs.push(targetGlyph);
    });

    const targetFont = new opentype.Font({
      familyName: this.sourceFont.names.fontFamily.en,
      styleName: this.sourceFont.names.fontSubfamily.en,

      unitsPerEm: this.sourceFont.unitsPerEm,
      ascender: this.sourceFont.ascender,
      descender: this.sourceFont.descender,

      glyphs,
    });

    return targetFont;
  }

  writeTargetFont() {
    const targetFontFilename = `${utils.randomString()}.ttf`;
    const protextDirpath = path.resolve(this.destination, 'protext');

    this.targetFont.download(path.resolve(protextDirpath, targetFontFilename));

    return targetFontFilename;
  }
}

export default Protext;
