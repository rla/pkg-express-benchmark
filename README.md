# pkg-express-benchmark

A benchmark to test the performance of a [pkg][pkg]-packaged Express.js
application. The application generates random data and produces an HTML
page from it using the EJS templating engine.

[pkg]:https://github.com/zeit/pkg

Packaging incurs some performance penalty and the goal of this project
was to figure out how much it is for this specific use case.

## Update 2017-06-14

Including the source file will make the performance penalty much
smaller for Crankshaft too.

The following tells which files were added as bytecode:

```
npm run package-crankshaft | grep bytecode
```

To have sources included the `package.json` must have no
`private: true` setting and must have the approriate `license` property.

The benchmarks below are updated to include cases with the source (`index.js`)
included.

More info: <https://github.com/zeit/pkg/issues/74>.

## Results

HTTP benchmarks were run using the [wrk][wrk] tool. The used Node.js
version was `8.0.0`. Benchmarks were run on a i5-6600 4.2Ghz CPU.

[wrk]:https://github.com/wg/wrk

### Without packaging, Crankshaft

Running the application:

```
NODE_ENV=production node --crankshaft index.js
```

Running the benchmark and displaying results:

```
wrk 'http://localhost:8000/handler' -d 10 -c 50 -t 8
Running 10s test @ http://localhost:8000/handler
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    45.98ms    4.80ms  96.35ms   91.91%
    Req/Sec   130.79     26.40   555.00     82.15%
  10443 requests in 10.10s, 434.67MB read
Requests/sec:   1033.98
Transfer/sec:     43.04MB
```

### Packaged, Crankshaft, no source

Building the package:

```
npm run package-crankshaft
```

Running the app:

```
NODE_ENV=production ./app-crankshaft
```

Running the benchmark and displaying results:

```
wrk 'http://localhost:8000/handler' -d 10 -c 50 -t 8
Running 10s test @ http://localhost:8000/handler
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    67.43ms    3.88ms 129.07ms   89.10%
    Req/Sec    88.96     26.70   121.00     29.00%
  7102 requests in 10.01s, 295.61MB read
Requests/sec:    709.56
Transfer/sec:     29.53MB
```

### Packaged, Crankshaft, with source

Building the package:

```
npm run package-crankshaft
```

Running the app:

```
NODE_ENV=production ./app-crankshaft
```

Running the benchmark and displaying results:

```
wrk 'http://localhost:8000/handler' -d 10 -c 50 -t 8
Running 10s test @ http://localhost:8000/handler
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    46.88ms    4.64ms 173.18ms   92.35%
    Req/Sec   128.44     18.24   181.00     82.23%
  10231 requests in 10.01s, 425.85MB read
Requests/sec:   1021.89
Transfer/sec:     42.53MB
```

### Without packaging, Ignition+TurboFan

Running the application:

```
NODE_ENV=production node --ignition --turbo index.js
```

Running the benchmark and displaying results:

```
wrk 'http://localhost:8000/handler' -d 10 -c 50 -t 8
Running 10s test @ http://localhost:8000/handler
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    49.65ms    5.14ms 123.32ms   84.58%
    Req/Sec   121.35     16.54   181.00     84.94%
  9656 requests in 10.01s, 401.91MB read
Requests/sec:    964.79
Transfer/sec:     40.16MB
```

### Packaged, Ignition+TurboFan, without source

Building the package:

```
npm run package-turbo
```

Running the app:

```
NODE_ENV=production ./app-turbo
```

Running the benchmark and displaying results:

```
wrk 'http://localhost:8000/handler' -d 10 -c 50 -t 8
Running 10s test @ http://localhost:8000/handler
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    50.33ms    3.99ms  85.84ms   78.03%
    Req/Sec   119.41     15.27   181.00     84.88%
  9522 requests in 10.01s, 396.34MB read
Requests/sec:    951.00
Transfer/sec:     39.58MB
```

### Packaged, Ignition+TurboFan, with source

Building the package:

```
npm run package-turbo
```

Running the app:

```
NODE_ENV=production ./app-turbo
```

Running the benchmark and displaying results:

```
$ wrk 'http://localhost:8000/handler' -d 10 -c 50 -t 8
Running 10s test @ http://localhost:8000/handler
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    49.13ms    3.89ms  75.91ms   75.75%
    Req/Sec   122.32     16.18   181.00     84.75%
  9753 requests in 10.01s, 405.95MB read
Requests/sec:    974.35
Transfer/sec:     40.56MB
```

### Conclusions

 * Under the Crankshaft compilation pipeline there is a performance
   penalty about 31% when the application source is not included. With source
   it is only 1.1%.
 * For Ignition+TurboFan pipeline the performance penalty is at about 1.4%. With
   source included it is 0.9% faster than without packaging.
 * Without packaging, the Ignition+TurboFan pipeline is 6.7% slower
   than the Crankshaft.

## License

The contents of this repository may be reused under the conditions of
the MIT License.
