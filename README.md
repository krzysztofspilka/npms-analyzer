# npms-analyzer

[![Build status][travis-image]][travis-url] [![Coverage status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev dependency status][david-dm-dev-image]][david-dm-dev-url]

The npms-analyzer analyzes the npm ecosystem, collecting info, evaluating and scoring each package.


## Usage

This project offers all its functionality through a CLI.

![Demo](https://i.imgur.com/nz9CzVR.gif)
*(output might be outdated)*

Note that you must [setup](./docs/setup.md) the project before using the CLI. The most important commands will be described below. To discover the other ones run `$ npms-analyzer -h`.

### npms-analyzer observe

The `observe` command starts observing changes that occur in the `npm` registry as well as packages that were not analyzed for a while. Each reported package will be pushed into a queue to be processed by the queue consumers.

```bash
$ npms-analyzer observe --log-level debug | pino
```

For more information about the command, run `$ npms-analyzer observe -h`

### npms-analyzer consume

The `consume` command starts consuming the queue, running the analysis process for each queued package.

```bash
$ npms-analyzer consume --log-level debug --concurrency 5 | pino
```

For more information about the command, run `$ npms-analyzer consume -h`

### npms-analyzer scoring

The `scoring` command, continuously iterates over the analysis results and calculates a score for all the `npm` packages, storing its result in `elasticsearch`.

```bash
$ npms-analyzer scoring
```

For more information about the command, run `$ npms-analyzer scoring -h`


## Architecture

There's a separate document that explains the architecture, you may read it [here](./docs/architecture.md).


## Setup

There's a separate document that explains the setup procedure, you may read it [here](./docs/setup.md).


## Deploys

There's a separate document that explains the deployment procedure, you may read it [here](./docs/deploys.md).


## Tests

Before running the tests, you must have read through the setup guide.

```bash
$ npm test
$ npm test-cov # to get coverage report
```

[codecov-url]:https://codecov.io/gh/npms-io/npms-analyzer
[codecov-image]:https://img.shields.io/codecov/c/github/npms-io/npms-analyzer/master.svg
[david-dm-dev-image]: https://img.shields.io/david/dev/npms-io/npms-analyzer.svg
[david-dm-dev-url]: https://david-dm.org/npms-io/npms-analyzer#info=devDependencies
[david-dm-image]: https://img.shields.io/david/npms-io/npms-analyzer.svg
[david-dm-url]: https://david-dm.org/npms-io/npms-analyzer
[travis-image]: http://img.shields.io/travis/npms-io/npms-analyzer/master.svg
[travis-url]: https://travis-ci.org/npms-io/npms-analyzer
