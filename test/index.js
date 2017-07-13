const path = require('path');

const Protext = require('../build/protext').default;

const encoder = new Protext({
    destination: 'build',
    font: path.resolve(__dirname, 'Lobster-Regular.ttf'),
});

console.log(
    encoder.encodeHtml(
        path.resolve(__dirname, 'test.html.tmpl')
    )
);
