
import fs from 'fs';
import path from 'path';

const Stylesheets = {

  getSrcLessFiles() {
    return fs
      .readdirSync(path.resolve('src/less'))
      .map(file => path.resolve('src/less', file));
  },

  getDistCSSFiles() {
    return Stylesheets.getSrcLessFiles().map(filename => {
      const basename = path.basename(filename);
      const basenameNoExtension = basename.split('.')[0];
      return path.resolve('dist/css', basenameNoExtension + '.css');
    });
  },

  getDistCSSMapFiles() {
    return Stylesheets.getDistCSSFiles().map(filename => `${filename}.map`);
  },

  getDistCSSFilesBasename() {
    return Stylesheets.getDistCSSFiles().map(filename => path.basename(filename));
  },

};

export default Stylesheets;
