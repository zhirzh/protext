const path = require('path');

const Protext = require('../build/protext').default;

const SRC_DIR = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'build');

const encoder = new Protext({
  destination: BUILD_DIR,
  font: path.resolve(SRC_DIR, 'fonts', 'font.ttf'),

  count: 7,

  charsets: {
    source: 'abcd'.split(''),
    target: '1234'.split(''),
  },

  fontFamily: 'foo',
});

encoder.encodeHtmlFile(
  path.resolve(SRC_DIR, 'index.html.tmpl'),
  path.resolve(BUILD_DIR, 'index.html'),
);

encoder.encodeHtmlFile(
  path.resolve(SRC_DIR, 'page', 'page.html.tmpl'),
  path.resolve(BUILD_DIR, 'page', 'page.html'),
);
