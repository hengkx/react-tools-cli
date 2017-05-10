function getWatchSagas(str) {
  const result = [];
  const pattern = /(\/\/(.*)[\r\n|\n|\r]+)?export function\* (\w+)\(\)?/g;
  let res;
  while ((res = pattern.exec(str)) != null) {
    result.push({ name: res[3], comment: res[2] });
  }
  return result;
}

function getActions(str) {
  const pattern = /createActions\(([A-Z,_ \r\n]+)\);/
  let res = pattern.exec(str)[1].replace(/\s+/g, '').split(',');
  const result = [];
  res.forEach(item => {
    if (item.indexOf('_RESULT') === -1) {
      result.push(item);
    }
  });
  return result;
}

export { getWatchSagas, getActions };
