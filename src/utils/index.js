import { join } from 'path';

function getRenamePaths(projectPath, dirConfig) {
  const sourcePath = join(projectPath, 'src');
  const componentPath = join(sourcePath, 'components');
  const defaultComponent = 'Index';
  const srcPaths = [
    { src: sourcePath, dest: join(projectPath, dirConfig.source) },
    { src: join(sourcePath, 'components'), dest: join(sourcePath, dirConfig.component) },
    { src: join(componentPath, defaultComponent, 'js'), dest: join(componentPath, defaultComponent, dirConfig.script) },
    { src: join(componentPath, defaultComponent, 'less'), dest: join(componentPath, defaultComponent, dirConfig.style) },
    { src: join(componentPath, defaultComponent, 'images'), dest: join(componentPath, defaultComponent, dirConfig.image) },
    { src: join(componentPath, defaultComponent, 'json'), dest: join(componentPath, defaultComponent, dirConfig.staticData) },
    { src: join(sourcePath, 'containers'), dest: join(sourcePath, dirConfig.container) },
    { src: join(sourcePath, 'redux'), dest: join(sourcePath, dirConfig.redux) },
    { src: join(sourcePath, 'store'), dest: join(sourcePath, dirConfig.reduxStore) },
    { src: join(sourcePath, 'config'), dest: join(sourcePath, dirConfig.config) },
    { src: join(sourcePath, 'utils'), dest: join(sourcePath, dirConfig.util) },
    { src: join(projectPath, 'app'), dest: join(projectPath, dirConfig.dist) }
  ];
  let result = [];
  srcPaths.forEach((item) => {
    if (item.src !== item.dest) result.push(item);
  });
  return result.sort((a, b) => (b.src.length - a.src.length));
}

export { getRenamePaths };


