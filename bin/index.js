#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from 'chalk';
import { once } from 'events';
import { createReadStream } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
const { f } = yargs(hideBin(process.argv))
    .usage('Usage: -f <file>')
    .option('f', {
    alias: 'file',
    demandOption: true,
    describe: 'HTTP log file to parse',
    type: 'string',
})
    .parseSync();
const file = join(process.cwd(), f);
export function processLine(params) {
    const { line, ipMap, urlMap } = params;
    const segments = line.split(' ');
    const ip = segments[0];
    const url = segments[6];
    ipMap.set(ip, (ipMap.get(ip) || 0) + 1);
    urlMap.set(url, (urlMap.get(url) || 0) + 1);
}
export function displayTopNResults(n, ...maps) {
    [...maps].forEach((map) => {
        const topN = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
        console.log(chalk.bold.green(`Top ${n <= map.size ? n : map.size} out of ${map.size}`));
        console.log(chalk.bold.green('-------------------------------'));
        topN.forEach(([key, value], index) => {
            console.log(`${chalk.bold.yellow(index + 1)}. ${chalk.bold.cyan(key)} -- ${chalk.bold.magenta(`count = ${value}`)}`);
        });
        console.log('\n');
    });
}
export function processLineByLine(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileStream = createReadStream(filePath, { encoding: 'utf8' });
            const ipMap = new Map();
            const urlMap = new Map();
            const rl = createInterface({
                input: fileStream,
                crlfDelay: Infinity, // Treat instances of CR LF ('\r\n') as a single line break.
            });
            rl.on('line', (line) => processLine({ line, ipMap, urlMap }));
            yield once(rl, 'close');
            displayTopNResults(28, ipMap, urlMap);
        }
        catch (error) {
            console.error(error);
        }
    });
}
processLineByLine(file);
