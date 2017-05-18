# react-tools-cli

## Getting Started

Install, create and start.

```bash
# Install
$ npm install react-tools-cli -g

# Create app
$ react new myapp

# Start app
$ cd myapp
$ npm start
```

## Commands

We have 3 commands: `new`, `init` and `generate`(alias `g`).

``` javascript
// 创建saga根据默认配置创建
react g filename actionName url
// 创建saga指定请求方式
react g filename actionName url -m post
```

``` bash
# create default config file
$ react init
```

#### options

* `source dir` -- project source directory. default `src`
  * `component dir` -- project component directory. default `components`
    * `script dir` -- component script directory. default `js`
    * `style dir` -- component style directory. default `less`
    * `image dir` -- component image directory. default `images`
    * `static data dir` -- component static data directory. default `json`
  * `container dir` -- project container directory. default `containers`
  * `saga dir` -- project saga directory. default `sagas`
  * `reducer dir` -- project reducer directory. default `reducers`
* `url prefix` -- Generate a saga request url prefix. eg : `APP.HOT.API.`
* `method` -- Generate a saga request method. default `get`
* `extra import` -- Generate a saga extra import file
