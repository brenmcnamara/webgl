/* eslint-disable no-console */

import chalk from 'chalk';
import commander from 'commander';
import webpack from 'webpack';
import webpackConfig from '../webpack.config';

commander
  .version('0.0.1')
  .option('-w, --watch', 'Watch for changes to js files')
  .parse(process.argv);

console.log(chalk.blue('Generating build. This will take a moment...'));

const compiler = webpack(webpackConfig);

if (commander.watch) {
  compiler.watch({}, onCompiled);
}
else {
  compiler.run(onCompiled);
}

function onCompiled(err, stats) {
  if (err) { // so a fatal error occurred. Stop here.
    console.log(chalk.red(err));
    return 1;
  }

  const jsonStats = stats.toJson();

  if (jsonStats.hasErrors) {
    return jsonStats.errors.map(error => console.log(chalk.red(error)));
  }

  if (jsonStats.hasWarnings) {
    console.log(chalk.yellow('Webpack generated the following warnings: '));
    jsonStats.warnings.map(warning => console.log(chalk.yellow(warning)));
  }

  // if we got this far, the build succeeded.
  if (commander.watch) {
    console.log('Build successful...');
  }
  else {
    console.log(`Webpack stats: ${stats}`);
    console.log(chalk.green('Done building JS'));
  }


  return 0;
}
