// @flow

import path from 'path';

import utils from './utils';
import validateOptions from './validate-options';

import type { Charset, Font, Mapper, ProtextOptions } from './types';

import Encoder from './encoder';

// import opentype from 'opentype.js';
const opentype = require('opentype.js');

class Protext {
  destination: string;
  fontFamily: string;
  mapper: Mapper;
  targetFontFileCount: number;
  targetFontFilenames: Array<string>;

  sourceFont: Font;
  targetFonts: Array<Font>;

  sourceCharset: Charset;
  targetCharset: Charset;

  constructor(options: ProtextOptions) {
    const err = validateOptions(options);
    if (err !== null) {
      throw err;
    }

    this.unpackOptions(options);

    utils.cleanDestination(this.destination);

    this.mapper = this.generateMapper();
    this.targetFonts = this.generateTargetFonts();
    this.targetFontFilenames = this.writeTargetFont();

    return new Encoder({
      destination: this.destination,
      fontFamily: this.fontFamily,
      mapper: this.mapper,
      targetFontFilenames: this.targetFontFilenames,
    });
  }

  generateMapper(): Mapper {
    const mapper = new Map();

    this.sourceCharset.forEach(sourceChar => {
      const randomIdx = Math.floor(this.targetCharset.length * Math.random());
      const targetChar = this.targetCharset.splice(randomIdx, 1)[0];

      mapper.set(sourceChar, targetChar);
    });

    return mapper;
  }

  generateTargetFonts(): Array<Font> {
    const notdefGlyph = new opentype.Glyph({
      name: '.notdef',
      unicode: 0,
      advanceWidth: 650,
      path: new opentype.Path(),
    });

    const glyphsets = [];
    for (let i = 0; i < this.targetFontFileCount; i += 1) {
      glyphsets.push([notdefGlyph]);
    }

    Array.from(this.mapper.entries()).forEach(([sourceChar, targetChar]) => {
      const sourceGlyph = this.sourceFont.charToGlyph(sourceChar);
      const targetGlyph = new opentype.Glyph(
        this.sourceFont.charToGlyph(targetChar),
      );

      targetGlyph.path = sourceGlyph.path;
      targetGlyph.advanceWidth = sourceGlyph.advanceWidth;

      const randomIdx = Math.floor(Math.random() * glyphsets.length);
      const glyphset = glyphsets[randomIdx];
      glyphset.push(targetGlyph);
    });

    const targetFonts = glyphsets.map(glyphs => {
      const targetFont = new opentype.Font({
        familyName: this.sourceFont.familyName,
        styleName: this.sourceFont.styleName,

        unitsPerEm: this.sourceFont.unitsPerEm,
        ascender: this.sourceFont.ascender,
        descender: this.sourceFont.descender,

        glyphs,
      });

      targetFont.filename = utils.randomString();

      return targetFont;
    });

    return targetFonts;
  }

  unpackOptions(options: ProtextOptions) {
    this.destination = options.destination;

    const charsets = options.charsets || utils.getDefaultCharsets();
    this.sourceCharset = charsets.source;
    this.targetCharset = charsets.target;

    this.sourceFont = opentype.loadSync(options.font);
    this.sourceFont.familyName =
      this.sourceFont.names.fontFamily.en || utils.randomString();
    this.sourceFont.styleName =
      this.sourceFont.names.fontSubfamily.en || utils.randomString();

    this.fontFamily =
      options.fontFamily ||
      this.sourceFont.names.fontFamily.en ||
      utils.randomString();

    this.targetFontFileCount = options.count || 1;
  }

  writeTargetFont(): Array<string> {
    const protextDirpath = path.resolve(this.destination, 'protext');

    this.targetFonts.forEach(targetFont => {
      const targetFontFilepath = path.resolve(
        protextDirpath,
        `${targetFont.filename}.ttf`,
      );
      targetFont.download(targetFontFilepath);
    });

    const targetFontFilenames = this.targetFonts.map(
      targetFont => targetFont.filename,
    );
    return targetFontFilenames;
  }
}

export default Protext;
