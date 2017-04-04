/* eslint-disable no-console */

/**
 * This is a demo of how to watch for changes in a directory. To run this script, run the following
 * from the root of the directory.
 *
 * (1) Make sure to have babel-node installed globally: 'npm install -g babel-cli'
 * (2) Run 'which babel-node' to make sure it installed
 * (3) babel-node howToWatch
 */

import chokidar from 'chokidar';
import path from 'path';

const PATH_TO_WATCH = path.resolve('src/less');

/**
 * Here, we are listening to all events that happen at the directory we specified in the path.
 * If you run this script, you can make changes to the src/less directory by adding, removing,
 * and changing files to see what changes are printed on the screen.
 *
 * PLEASE REMEMBER TO REVERT ANY CHANGES YOU MAKE.
 */
chokidar.watch(PATH_TO_WATCH).on('all', (event, path) => {
  console.log(event, path);
});
