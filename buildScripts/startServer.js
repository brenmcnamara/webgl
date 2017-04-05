/* eslint-disable no-console */

import browserSync from 'browser-sync';

const server = browserSync.create();

server.init({ server: './dist' });
