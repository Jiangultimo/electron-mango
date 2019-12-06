const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'elecdist')
  },
  'mode':'production',
  target: 'electron-main',
};
