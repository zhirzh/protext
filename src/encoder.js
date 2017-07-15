// @flow

import fs from 'fs';
import path from 'path';

import utils from './utils';

import type { EncoderOptions, Mapper } from './types';

const replaceStream = require('replacestream');

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
    this.sourceTextRegexp = new RegExp(
      '{{#protext}}([\\s\\S]*?){{/protext}}',
      'g',
    );
  }

  sourceTextReplacer = (_: any, p1: string) => {
    return `<span class="protext">${this.encodeText(p1)}</span>`;
  };

  unpackOptions(options: EncoderOptions) {
    this.destination = options.destination;
    this.fontFamily = options.fontFamily;
    this.mapper = options.mapper;
    this.targetFontFilenames = options.targetFontFilenames;
  }

  encodeBody(html: string): string {
    const encodedHtml = html.replace(
      this.sourceTextRegexp,
      this.sourceTextReplacer,
    );

    return encodedHtml;
  }

  encodeHead(html: string, relativePath: string): string {
    const styleTag = utils.getStyleTag(
      relativePath,
      this.targetFontFilenames,
      this.fontFamily,
    );

    const encodedHtml = html.replace(this.protextStyleRegexp, styleTag);

    return encodedHtml;
  }

  encodeHtmlFile = (entry: string, output: string) => {
    let html = fs.readFileSync(entry, 'utf8');

    const relativePath = path.relative(path.dirname(output), this.destination);

    html = this.encodeHead(html, relativePath.length > 0 ? relativePath : '.');
    html = this.encodeBody(html);

    fs.writeFileSync(output, html);
  };

  encodeHtmlStream = (entry: string, output: string) => {
    const inStream = fs.createReadStream(entry);
    const outStream = fs.createWriteStream(output);

    const styleTag = utils.getStyleTag(
      this.targetFontFilenames,
      this.fontFamily,
    );

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
