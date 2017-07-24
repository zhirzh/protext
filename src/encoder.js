// @flow

import fs from 'fs';
import path from 'path';

import utils from './utils';

import type { EncoderOptions, Mapper } from './types';

const replaceStream = require('replacestream');

/**
 * Encoder class
 */
class Encoder {
  destination: string;
  fontFamily: string;
  mapper: Mapper;
  targetFontFilenames: Array<string>;

  protextStyleRegexp: RegExp;
  sourceTextRegexp: RegExp;

  constructor(options: EncoderOptions) {
    this.unpackOptions(options);

    this.protextStyleRegexp = new RegExp('{{protext}}', 'g');
    this.sourceTextRegexp = new RegExp('{{#protext}}([\\s\\S]*?){{/protext}}', 'g');
  }

  sourceTextReplacer = (_: any, p1: string) =>
    `<span class="protext">${this.encodeText(p1)}</span>`;

  unpackOptions(options: EncoderOptions) {
    this.destination = options.destination;
    this.fontFamily = options.fontFamily;
    this.mapper = options.mapper;
    this.targetFontFilenames = options.targetFontFilenames;
  }

  generateStyleTag(output: string) {
    const relativePath = path.relative(path.dirname(output), this.destination);
    const styleTag = utils.generateStyleTag(
      relativePath || '.',
      this.targetFontFilenames,
      this.fontFamily,
    );

    return styleTag;
  }

  encodeHtmlFile = (entry: string, output: string) => {
    output = output.replace(/\.tmpl$/g, ''); // eslint-disable-line no-param-reassign

    let html = fs.readFileSync(entry, 'utf8');

    const styleTag = this.generateStyleTag(output);

    html = html.replace(this.protextStyleRegexp, styleTag);

    html = html.replace(this.sourceTextRegexp, this.sourceTextReplacer);

    fs.writeFileSync(output, html);
  };

  encodeHtmlStream = (entry: string, output: string) => {
    output = output.replace(/\.tmpl$/g, ''); // eslint-disable-line no-param-reassign

    if (entry === output) {
      throw new Error('`entry` and `output` paths MUST be different');
    }

    const inStream = fs.createReadStream(entry);
    const outStream = fs.createWriteStream(output);

    const styleTag = this.generateStyleTag(output);

    inStream
      .pipe(replaceStream(this.protextStyleRegexp, styleTag))
      .pipe(replaceStream(this.sourceTextRegexp, this.sourceTextReplacer))
      .pipe(outStream);
  };

  encodeText = (sourceText: string): string => {
    const targetText = sourceText
      .split('')
      .map(sourceChar => this.mapper.get(sourceChar) || sourceChar)
      .join('');

    return targetText;
  };
}

export default Encoder;
