// @flow

type Charset = Array<string>;

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

type Mapper = Map<string, string>;

type EncoderOptions = {
  destination: string,
  fontFamily: string,
  mapper: Mapper,
  targetFontFilenames: Array<string>,
};

type Font = Object;

export type { Charset, EncoderOptions, Font, Mapper, ProtextOptions };
