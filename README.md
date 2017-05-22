# react-tools-cli

## Getting Started

Install, create and start.

```bash
# Install
$ npm install react-tools-cli -g
```

## Commands

We have 3 commands: `init`, `generate`(alias `g`) and `watch`.

### react init [options]
#### Usage Examples
``` bash
$ react init
```
#### options
* directory
  * `source dir` -- project source directory. default `src`
    * `component dir` -- project component directory. default `components`
      * `script dir` -- component script directory. default `js`
      * `style dir` -- component style directory. default `less`
      * `image dir` -- component image directory. default `images`
      * `static data dir` -- component static data directory. default `json`
    * `container dir` -- project container directory. default `containers`
    * `saga dir` -- project saga directory. default `sagas`
    * `reducer dir` -- project reducer directory. default `reducers`
* saga
  * `url prefix` -- Generate a saga request url prefix. eg : `APP.HOT.API.`
  * `method` -- Generate a saga request method. default `get`
  * `extra import` -- Generate a saga extra import file

### react generate (short-cut alias: "g") [options]
#### Usage Examples
``` bash
$ react g fileName actionName url
```
#### Detailed help
```
Options:

    -h, --help                       output usage information
    --no-p, --no-progress            Don't generate progress
    --p, --no-params                 Don't requst params
    -m, --method [method]            Specify request method, default get
    -i, --extraImport [extraImport]  Specify extraImport
```
### react watch
auto monitor redux saga file change, generate redux/sagas.js and redux/reducers.js
#### Usage Examples
``` bash
$ react watch
```
