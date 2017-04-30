/* eslint-disable no-console */

import LessPluginAutoPrefix from 'less-plugin-autoprefix';
import Stylesheets from '../utils/Stylesheets';

import chalk from 'chalk';
import chokidar from 'chokidar';
import commander from 'commander';
import fs from 'fs';
import less from 'less';
import mkdirp from 'mkdirp';
import path from 'path';


commander
  .version('0.0.1')
  .option('-w, --watch', 'Watch for changes to less files')
  .parse(process.argv);

const prefixer = new LessPluginAutoPrefix({ browsers: ['last 2 versions'] });

const compilePromises = [];

const PATH_TO_WATCH = path.resolve('src/less/');

if (commander.watch) {
  console.log(chalk.blue('Compiling less files and watch for changes...'));
  chokidar.watch(PATH_TO_WATCH).on('all', (event, path) => {
    switch(event){
      case 'add':
      case 'change':
        console.log(chalk.blue(event, path));
        compileLessAndWriteToCSSFile(path)
          .then(() => {
            console.log(chalk.green(`Done compiling  ${path}`));
          });
      break;

      case 'unlink': {
        const cssFilename = Stylesheets.getDistCSSFileForLessFile(path);
        const cssMapFilename = Stylesheets.getDistCSSMapFileForLessFile(path);
        Promise.all([removeFile(cssFilename), removeFile(cssMapFilename)]);
        break;
      }

      case 'unlinkDir': {
        const cssFilepath = Stylesheets.getDistCSSPathForLessPath(path);
        removePath(cssFilepath);
        break;
      }

      case 'addDir': {
        if (path !== PATH_TO_WATCH) {
          createCSSDirectory(path)
          .catch(error => {
            console.error(chalk.red(error));
          });
        }
        break;
      }
    }
  });
}
else {
  console.log(chalk.blue('Compiling less files...'));
  Stylesheets.getSrcLessFiles().forEach(filename => {
    const promise = compileLessAndWriteToCSSFile(filename);
    compilePromises.push(promise);
  });

  Promise.all(compilePromises)
    .then(() => {
      console.log(chalk.green('Done compiling less!'));
      process.exit(0);
    })
    .catch(error => {
      console.error(chalk.red(error));
      process.exit(1);
    });
}


// ------------------------------------------------------------------------------------------------
//
// UTILITY FUNCTIONS
//
// ------------------------------------------------------------------------------------------------

/**
 * Takes a less filename, compiles the less file, then writes the contents of the file to a CSS
 * file. The promise completes when all this is successfully completed.
 */
function compileLessAndWriteToCSSFile(filename) {
  const cssFilename = Stylesheets.getDistCSSFileForLessFile(filename);
  const cssMapFilename = Stylesheets.getDistCSSMapFileForLessFile(filename);
  let output = null;
  return readFile(filename)
    .then(buffer => less.render(buffer.toString(), { plugins: [prefixer], sourceMap: {} }))
    .then(_output => output = _output)
    .then(() => writeFile(cssFilename, Buffer.from(output.css)))
    .then(() => {
      if (output.map) {
        writeFile(cssMapFilename, Buffer.from(output.map.toString()));
      }
    });
}

/**
 * Creates a new directory in the css folder to match that in the less folder
 */
function createCSSDirectory(pathname) {
  return new Promise((resolve, reject) => {
      const cssPathname = Stylesheets.getDistCSSPathForLessPath(pathname);
      mkdirp(cssPathname, error => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
  });
}

/**
 * Takes a filename and returns a promise that is completed with a buffer containing the contents
 * of the file.
 */
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

/**
 * Takes a filename and a buffer / string, then writes the buffer into the file. If writing to a
 * file in a directory that does not exist, this will create all the missing directories as well.
 */
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

/**
 * Takes a filename to remove and returns a promise that is completed when the file has been
 * deleted.
 */
function removeFile(filename) {
  return new Promise((resolve, reject) => {
    fs.unlink(filename, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

/**
 * Takes a filepath to remove and returns a promise that is completed when the path has been
 * deleted.
 */
function removePath(filepath) {
  return new Promise((resolve, reject) => {
    fs.rmdir(filepath, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}
