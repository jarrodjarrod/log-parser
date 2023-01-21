/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { describe, expect, test } from 'vitest';
import { processLine } from './helpers';

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
