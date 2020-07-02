const path = require('path');

module.exports = {
  server: '',
  token: '專案token',
  projectId: '專案id',
  globalCode: `const axios = require('axios'); \n`,
  methodName: function (apipath, method) {
    let apipaths = apipath.split('/');
    let name = [];
    name.push(method.toLowerCase());
    if (apipaths.length > 1) {
      for (let i = 1; i <= apipaths.length; i++) {
        if (
          apipaths.length - i > 2 &&
          !apipaths[i + 2].includes('{') &&
          !apipaths[i + 2].includes('}') &&
          !apipaths[i + 2].includes(projectId) &&
          !apipaths[i + 2].includes('mock')
        ) {
          name.push(apipaths[i + 2]);
        }
      }
    } else if (apipaths.length === 1) {
      name = [].concat(name, [apipaths[0]]);
    }
    name = name.map(p => {
      return p.replace(/[^a-zA-Z0-9\_]+/g, '');
    });
    return name.join('_');
  },
  template: '',
  moduleMode: false, // 檔案輸出是否要依照模組創建
  distFile: path.resolve(process.cwd(), 'yapi.js'), // 檔案輸出至單一檔案 (moduleMode為true時會自動省略)
  distFolder: null, // 檔案輸出資料夾 (moduleMode為true時為必填)
  enableValidte: false,
  useCustomHttpRequest: false, // 是否使用外部引入http-request的檔案
  httpRequestPath: '', // 外部引入http-request檔案的路徑
};
