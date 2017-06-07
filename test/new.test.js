import { join } from 'path';
import { getRenamePaths } from '../src/utils';

test('getRenamePaths', () => {
  expect(getRenamePaths('C:/', {
    "source": "src",
    "component": "components",
    "script": "js",
    "style": "less",
    "image": "images",
    "staticData": "json",
    "container": "containers",
    "redux": "redux",
    "reduxStore": "store",
    "config": "config",
    "util": "utils",
    "dist": "app"
  })).toEqual([]);

  expect(getRenamePaths('C:/', {
    "source": "src1",
    "component": "components1",
    "script": "js",
    "style": "less",
    "image": "images",
    "staticData": "json",
    "container": "containers",
    "redux": "redux",
    "reduxStore": "store",
    "config": "config",
    "util": "utils",
    "dist": "app"
  })).toEqual([
    { src: join('C:/', 'src', 'components'), dest: join('C:/', 'src', 'components1') },
    { src: join('C:/', 'src'), dest: join('C:/', 'src1') },
  ]);
});
