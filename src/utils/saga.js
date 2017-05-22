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
  const pattern = /createActions\(([A-Z,_ '\r\n]+)\);/
  const matchResult = pattern.exec(str);
  if(!matchResult) throw new Error('action match error. action name must be letters or underscore.');
  let res = matchResult[1].replace(/\s+/g, '').split(',');
  const result = [];
  res.forEach(item => {
    if (item.indexOf('_RESULT') === -1) {
      result.push(item.replace(/'/g, ""));
    }
  });
  return result;
}

export { getWatchSagas, getActions };
