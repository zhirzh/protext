const path = require('path');

const Protext = require('../build/protext').default;

const encoder = new Protext({
  destination: 'build',
  font: path.resolve(__dirname, 'font.ttf'),

  // count: 3,

  // charsets: {
  //   source: 'abcdefghij'.split(''),
  //   target: '1234567890'.split(''),
  // },

  // fontFamily: 'foo',
});

console.log(encoder.encodeText('hello world - 123 !!'));

encoder.encodeHtmlFile(path.resolve(__dirname, 'test.html.tmpl'));

encoder.encodeHtmlStream(path.resolve(__dirname, 'test.html.tmpl'));
