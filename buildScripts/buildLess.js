/* eslint-disable no-console */

import Stylesheets from '../utils/Stylesheets';

import chalk from 'chalk';
import fs from 'fs';
import less from 'less';
import mkdirp from 'mkdirp';
import path from 'path';

const compilePromises = [];

Stylesheets.SrcLessFiles.forEach((filename, i) => {
  const outputCSSFilename = Stylesheets.DistCSSFiles[i];
  const outputCSSMapFilename = Stylesheets.DistCSSMapFiles[i];
  const promise = readFile(filename)
    .then(buffer => less.render(buffer.toString(), { sourceMap: {} }))
    .then(output =>
      writeFile(outputCSSFilename, output.css)
        .then(() => writeFile(outputCSSMapFilename, output.map))
    );
  compilePromises.push(promise);
});

Promise.all(compilePromises)
  .then(() => {
    console.log(chalk.green('Done compiling less!'))
    process.exit(0);
  })
  .catch(error => {
    console.error(chalk.red(error));
    process.exit(1);
  });

function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, buffer) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(buffer);
    });
  });
}

function writeFile(filename, buffer) {
  return new Promise((resolve, reject) => {
    const dirname = path.dirname(filename);
    mkdirp(dirname, error => {
      if (error) {
        reject(error);
        return;
      }
      fs.writeFile(filename, buffer, error => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });
}
