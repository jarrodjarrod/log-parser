import stripAnsi from 'strip-ansi';
import {
  describe, expect, test,
} from 'vitest';
import { generateReports, processLine } from './helpers';

describe('processLine', () => {
  test('should add one to the count of a given IP address in the ipMap', () => {
    const ipMap = new Map<string, number>();
    const urlMap = new Map<string, number>();
    processLine({ line: '127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326', ipMap, urlMap });
    expect(ipMap.get('127.0.0.1')).toBe(1);
  });

  test('should add one to the count of a given URL in the urlMap', () => {
    const ipMap = new Map<string, number>();
    const urlMap = new Map<string, number>();
    processLine({ line: '127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326', ipMap, urlMap });
    expect(urlMap.get('/apache_pb.gif')).toBe(1);
  });
});

describe('displayTopNResults', () => {
  test('should display the top 3 IP addresses in the console', () => {
    const ipMap = new Map<string, number>();

    ipMap.set('192.168.1.1', 5);
    ipMap.set('192.168.1.2', 2);
    ipMap.set('192.168.1.3', 10);
    ipMap.set('192.168.1.4', 7);

    const report = stripAnsi(generateReports(3, ipMap)[0]); // strip away the colors

    expect(report).toMatch('1. 192.168.1.3 -- count = 10');
  });

  test('should display the top 5 URLs in the console', () => {
    const urlMap = new Map<string, number>();

    urlMap.set('/index.html', 5);
    urlMap.set('/about.html', 2);
    urlMap.set('/contact.html', 10);
    urlMap.set('/faq.html', 7);
    urlMap.set('/services.html', 12);

    const report = stripAnsi(generateReports(3, urlMap)[0]); // strip away the colors

    expect(report).toMatch('1. /services.html -- count = 12');
  });
});
