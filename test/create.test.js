import { join } from 'path';
import { create } from '../src/index';

test('create', () => {
  expect(create(
    {
      "directory": {
        "source": "src",
        "component": "components",
        "test": "test",
        "style": "less",
        "container": "containers",
        "redux": "redux"
      }
    },
    {
      "name": "AB",
      type: 1,
      "description": "",
      "version": "1.0.0",
      "module": [
        "style"
      ],
      "lifecycle": [
        "constructor"
      ],
      "isPropCheck": true,
      progress: true,
      importContent: "ddd",
      exportActions: 'dadasdaasdas',
      mapStateToProps: 'ccccc',
      extraImport: 'import test',
      "sagas": [
        {
          type: 'get_student',
          url: 'Api.test',
          method: 'get',
          needParam: true,
        },
        {
          type: 'p_student',
          url: 'Api.test',
          method: 'post',
          needParam: true,
        }
      ]
    }));
});
