const fs = require('fs');
const path = require('path');

module.exports = function deleteDir(url) {
  var files = [];

  if (fs.existsSync(url)) {
    // 判定給定路徑是否存在

    files = fs.readdirSync(url); // 返回文件和子目錄的陣列
    files.forEach(function (file, index) {
      var curPath = path.join(url, file);

      if (fs.statSync(curPath).isDirectory()) {
        // 同步讀取資料夾內資料，如果為資料夾，則回調自身
        deleteDir(curPath);
      } else {
        fs.unlinkSync(curPath); // 是指定文件則刪除
      }
    });

    fs.rmdirSync(url); // 資料夾
  }
};
