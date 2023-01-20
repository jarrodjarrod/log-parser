# README

This is a command line interface (CLI) for getting a couple simple but useful metrics from HTTP logs that follow the Common and Combined Log Formats. It takes in a file of logs and an optional number (t) of top results to display, returning the top t (3 by default) IP addresses and URLs that appeared in the logs, along with their counts.

## Installation

npm install <package-name>

## Usage

log-parser -f <file> -t <top>

- `-f, --file`: The HTTP log file to parse. This option is required.
- `-t, --top`: The number of top results to display. This option is optional, and the default value is 3.

The tool will output the top IP addresses and URLs from the log file, along with the number of times they appear in the log.

HINT: Use `npx @code-slice/log-parser -f <file> -t <top>` to execute the package without installing.

## Example

log-parser -f access.log -t 5


This will parse the `access.log` file and display the top 5 IP addresses and URLs that were recorded, along with a count of their occurrences.

````
Top 5 out of 11 results
-------------------------------
1. 168.41.191.40 -- count = 4
2. 177.71.128.21 -- count = 3
3. 50.112.00.11 -- count = 3
4. 72.44.32.10 -- count = 3
5. 168.41.191.9 -- count = 2


Top 5 out of 22 results
-------------------------------
1. /docs/manage-websites/ -- count = 2
2. /intranet-analytics/ -- count = 1
3. http://example.net/faq/ -- count = 1
4. /this/page/does/not/exist/ -- count = 1
5. http://example.net/blog/category/meta/ -- count = 1
````
