#!/usr/bin/env node

import chalk from 'chalk';
import { once } from 'events';
import { createReadStream } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

// const { f } = yargs(hideBin(process.argv))
//   .usage('Usage: -f <file>')
//   .option('f', {
//     alias: 'file',
//     demandOption: true,
//     describe: 'HTTP log file to parse',
//     type: 'string',
//   })
//   .parseSync();

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
      demandOption: false,
      describe: 'Number of top results to display',
      type: 'number',
    },
  })
  .parseSync();

const file = join(process.cwd(), f);

interface ProcessLineParams {
  line: string;
  ipMap: Map<string, number>
  urlMap: Map<string, number>
}

export function processLine(params: ProcessLineParams): void {
  const { line, ipMap, urlMap } = params;
  const segments = line.split(' ');
  const ip = segments[0];
  const url = segments[6];

  ipMap.set(ip, (ipMap.get(ip) || 0) + 1);
  urlMap.set(url, (urlMap.get(url) || 0) + 1);
}

export function displayTopNResults(n: number, ...maps: Map<string, number>[]) {
  [...maps].forEach((map) => {
    const topN = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

    console.log(chalk.bold.green(`Top ${n <= map.size ? n : map.size} out of ${map.size} results`));
    console.log(chalk.bold.green('-------------------------------'));
    topN.forEach(([key, value], index) => {
      console.log(`${chalk.bold.yellow(index + 1)}. ${chalk.bold.cyan(key)} -- ${chalk.bold.magenta(`count = ${value}`)}`);
    });
    console.log('\n');
  });
}

export async function processLineByLine(filePath: string, n = 3) {
  try {
    const fileStream = createReadStream(filePath, { encoding: 'utf8' });
    const ipMap = new Map<string, number>();
    const urlMap = new Map<string, number>();

    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Treat instances of CR LF ('\r\n') as a single line break.
    });

    rl.on('line', (line) => processLine({ line, ipMap, urlMap }));

    await once(rl, 'close');

    displayTopNResults(n, ipMap, urlMap);
  } catch (error) {
    console.error(error);
  }
}

processLineByLine(file, t);
