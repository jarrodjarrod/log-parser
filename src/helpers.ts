import chalk from 'chalk';
import { once } from 'events';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

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

export function generateReports(n: number, ...maps: Map<string, number>[]): string[] {
  return [...maps].map((map) => {
    const topN = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
    let report = '';

    report += chalk.bold.green(`Top ${n <= map.size ? n : map.size} out of ${map.size} results`);
    report += chalk.bold.green('\n-------------------------------\n');
    report += topN.map(([key, value], index) => `${chalk.bold.yellow(index + 1)}. ${chalk.bold.cyan(key)} -- ${chalk.bold.magenta(`count = ${value}`)}`).join('\n');
    report += '\n';

    return report;
  });
}

export async function processLineByLine(filePath: string, n: number) {
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

    const reports = generateReports(n, ipMap, urlMap);
    reports.forEach((report) => console.log(report));
  } catch (error) {
    console.error(error);
  }
}
