
import fs from 'fs';
import path from 'path';

const Stylesheets = {

  /**
   * Get a list of all less filenames in the less directory.
   */
  getSrcLessFiles() {
    return fs
      .readdirSync(path.resolve('src/less'))
      .map(file => path.resolve('src/less', file))
      .filter(file => file.endsWith('.less'));
  },

  /**
   * For a given less filename, get the name of the css file that is compiled from this less
   * file.
   */
  getDistCSSFileForLessFile(filename) {
    const basename = path.basename(filename);
    const basenameNoExtension = basename.split('.')[0];
    return path.resolve('dist/css', basenameNoExtension + '.css');
  },

  /**
   * For a given less path, get the name of the css path
   */
  getDistCSSPathForLessPath(pathname) {
    const basename = path.basename(pathname);
    return path.resolve('dist/css', basename);
  },

  /**
   * For a given less filename, get the name of the css map file that is compiled from the less
   * file.
   */
  getDistCSSMapFileForLessFile(filename) {
    return `${Stylesheets.getDistCSSFileForLessFile(filename)}.map`;
  },

  /**
   * Get a list of the filenames of the CSS files that are compiled from the less files.
   */
  getDistCSSFiles() {
    return Stylesheets.getSrcLessFiles().map(Stylesheets.getDistCSSFileForLessFile);
  },

  /**
   * Get a list of the filenames of the CSS Map files that are compiled from the less files.
   */
  getDistCSSMapFiles() {
    return Stylesheets.getSrcLessFiles().map(Stylesheets.getDistCSSMapFileForLessFile);
  },

  /**
   * Get a list of the basenames of the CSS files compiled from the less files. This is the
   * name of the file without the path.
   */
  getDistCSSFilesBasename() {
    return Stylesheets.getDistCSSFiles().map(filename => path.basename(filename));
  },

};

export default Stylesheets;
