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

  encodeText: Function;
  encodeHtmlFile: Function;
  encodeHtmlStream: Function;

  constructor(options: EncoderOptions) {
    this.unpackOptions(options);

    this.encodeText = this.encodeText.bind(this);
    this.encodeHtmlFile = this.encodeHtmlFile.bind(this);
    this.encodeHtmlStream = this.encodeHtmlStream.bind(this);
  }

  unpackOptions(options: EncoderOptions) {
    this.destination = options.destination;
    this.fontFamily = options.fontFamily;
    this.mapper = options.mapper;
    this.targetFontFilenames = options.targetFontFilenames;
  }

  encodeBody(html: string): string {
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

  encodeHead(html: string): string {
    const protextStyleRegexp = new RegExp('{{protext}}', 'g');

    const encodedHtml = html.replace(
      protextStyleRegexp,
      utils.getStyleTag(this.targetFontFilenames, this.fontFamily),
    );

    return encodedHtml;
  }

  encodeHtmlFile(filepath: string) {
    const filename = path.basename(filepath).replace(/(.tmpl)?$/, '');

    let html = fs.readFileSync(filepath, 'utf8');

    html = this.encodeHead(html);
    html = this.encodeBody(html);

    fs.writeFileSync(path.resolve(this.destination, filename), html);
  }

  encodeHtmlStream(filepath: string) {
    const filename = path.basename(filepath).replace(/(.tmpl)?$/, '');

    const protextStyleRegexp = new RegExp('{{protext}}', 'g');
    const sourceTextRegexp = new RegExp(
      '{{#protext}}([\\s\\S]*?){{/protext}}',
      'g',
    );

    const inStream = fs.createReadStream(filepath);
    const outStream = fs.createWriteStream(
      path.resolve(this.destination, filename),
    );

    inStream
      .pipe(
        replaceStream(
          protextStyleRegexp,
          utils.getStyleTag(this.targetFontFilenames, this.fontFamily),
        ),
      )
      .pipe(
        replaceStream(
          sourceTextRegexp,
          (_, p1) => `<span class="protext">${this.encodeText(p1)}</span>`,
        ),
      )
      .pipe(outStream);
  }

  encodeText(sourceText: string): string {
    const targetText = sourceText
      .split('')
      .map(sourceChar => this.mapper.get(sourceChar) || sourceChar)
      .join('');

    return targetText;
  }
}

export default Encoder;
