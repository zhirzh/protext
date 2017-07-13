// @flow

type Charset = Array<string>;

type Options = {
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

type Font = Object;

export type {
  Charset,
  Font,
  Mapper,
  Options,
};
