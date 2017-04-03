
import fs from 'fs';
import path from 'path';

let SrcLessFiles = fs
  .readdirSync(path.resolve('src/less'))
  .map(file => path.resolve('src/less', file));

let DistCSSFiles = SrcLessFiles.map(filename => {
  const basename = path.basename(filename);
  const basenameNoExtension = basename.split('.')[0];
  return path.resolve('dist/css', basenameNoExtension + '.css');
});

let DistCSSMapFiles = DistCSSFiles.map(filename => `${filename}.map`);

let DistCSSFilesBasename = DistCSSFiles.map(filename => path.basename(filename));

export default {

  SrcLessFiles,

  DistCSSFiles,

  DistCSSMapFiles,

  DistCSSFilesBasename,

};
