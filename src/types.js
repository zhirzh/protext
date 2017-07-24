// @flow

/**
 * @typedef
 */
type Charset = Array<string>;

/**
 * @typedef {Object}
 */
type ProtextOptions = {
  charsets: {
    source: Charset,
    target: Charset,
  },
  count: number,
  destination: string,
  font: string,
  fontFamily: string,
};

/**
 * @typedef
 */
type Mapper = Map<string, string>;

/**
 * @typedef {Object}
 */
type EncoderOptions = {
  destination: string,
  fontFamily: string,
  mapper: Mapper,
  targetFontFilenames: Array<string>,
};

/**
 * [Font class in `opentype.js`](https://github.com/nodebox/opentype.js#the-font-object)
 * @typedef
 */
type Font = Object;

export type { Charset, EncoderOptions, Font, Mapper, ProtextOptions };
