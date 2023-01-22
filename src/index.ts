#!/usr/bin/env node
import { join } from 'path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { processLineByLine } from './helpers.js';

const { f, t } = yargs(hideBin(process.argv))
  .usage('Usage: $0 -f <file> -t <top>')
  .options({
    f: {
      alias: 'file',
      demandOption: true,
      describe: 'HTTP log file to parse',
      type: 'string',
    },
    t: {
      alias: 'top',
      default: 3,
      demandOption: false,
      describe: 'Number of top results to display',
      type: 'number',
    },
  })
  .parseSync();

const file = join(process.cwd(), f);

processLineByLine(file, t);
