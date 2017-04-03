/* eslint-disable no-console */

import express from 'express';
import path from 'path';
import compression from 'compression';

const port = 3000;
const app = express();

app.use(express.static('dist'));
app.use(compression());

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('listening on port ' + port);
  }
});
