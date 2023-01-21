#!/usr/bin/env node
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import { resolve } from 'path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { processLineByLine } from './helpers.js';

const { f, t } = yargs(hideBin(process.argv))
  .usage('Usage: -f <file>')
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

const file = resolve(process.cwd(), f);

processLineByLine(file, t);
