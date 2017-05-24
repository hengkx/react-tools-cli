# react-tools-cli

## Getting Started

Install, create and start.

```bash
# Install
$ npm install react-tools-cli -g
```

## Commands

We have 5 commands: `global`, `new`, `init`, `generate`(alias `g`) and `watch`.

### react global [options]
Global default settings
#### Usage Examples
``` bash
$ react global
```
#### options
* `name` -- project name. default `react-tools-cli`
* `description` -- project description.
* `version` -- project description. default `1.0.0`
* `remark` -- project remark.
* `configSplit` -- project config file separation. default `false`
* `nodeModulesPath` -- project node modules path.
* browserSupport
  * `chrome` -- browser support chrome
  * `firefox` -- browser support firefox
  * `safari` -- browser support safari
  * `opera` -- browser support opera
  * `edge` -- browser support edge
  * `ie` -- browser support ie
* directory
  * `source dir` -- project source directory. default `src`
    * `component dir` -- project component directory. default `components`
      * `script dir` -- component script directory. default `js`
      * `style dir` -- component style directory. default `less`
      * `image dir` -- component image directory. default `images`
      * `static data dir` -- component static data directory. default `json`
    * `container dir` -- project container directory. default `containers`
    * `redux dir` -- project redux directory. default `redux`
    * `redux store dir` -- project redux directory. default `store`
    * `config dir` -- project config directory. default `config`
    * `utils dir` -- project config directory. default `utils`
  * `dist dir` -- project source directory. default `app`
* saga
  * `url prefix` -- Generate a saga request url prefix. eg : `APP.HOT.API.`
  * `url suffix` -- Generate a saga request url suffix.
  * `method` -- Generate a saga request method. default `get`
  * `extra import` -- Generate a saga extra import file. eg : `import Api from '../Config/Api';`

### react new [options]
Create a new project. options same as `gloabl options`
#### Usage Examples
``` bash
$ react new
```

### react init [options]
Current project default settings. options same as `gloabl options`
#### Usage Examples
``` bash
$ react init
```

### react new [options]
Create a new project. options same as `gloabl options`
#### Usage Examples
``` bash
$ react new
```

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
