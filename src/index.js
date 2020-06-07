const axios = require('axios');
const fs = require('fs');
const path = require('path');
const genCode = require('./genCode');
const json5 = require('json5');
const config = require('./config')
const deleteDir = require('./deleteDir')
const genHttpRequest = require('./genHttpRequest')

function json_parse(json) {
  try {
    return json5.parse(json)
  } catch (err) {
    return null;
  }
}

module.exports = gen;

async function gen(options = {}) {

  // 將config改為客製的設定
  Object.assign(config, options);
  
  let ApiList; // 全部接口
  let projectId; // 項目id
  let categoryList; // 接口分類

  try {

    // 獲取接口列表數據
    const { data: { data: { list } } } = await axios.get(`${config.server}/api/interface/list?limit=10000&token=${config.token}`);
    ApiList = list

    // 獲取專案基本資訊
    const { data: { data: { _id } } } = await axios.get(`${config.server}/api/project/get?token=${config.token}`);
    projectId = _id
    
    // 獲取專案接口分類
    const { data: { data } } = await axios.get(`${config.server}/api/interface/getCatMenu?project_id=${config.projectId}&token=${config.token}`);
    categoryList = data

  } catch (err) {
    console.log('調用 yapi 接口失敗')
    console.log(`status: ${err.response.status}`)
    console.log(`statusText: ${err.response.statusText}`)
    console.log(`url: ${err.response.config.url}`)
  }

  let categoryCollection = {}
  for (const category of categoryList) {
    categoryCollection[category._id] = []
  }

  for (let i = 0; i < ApiList.length; i++) {
    if (config.categoryId) {
      if (ApiList[i].catid != config.categoryId) continue;
    }
    const { data: { data } } = await axios.get(`${config.server}/api/interface/get?id=${ApiList[i]._id}&token=${config.token}`);
    const interface = data;
    categoryCollection[interface.catid].push(interface)
  }

  let code = '';
  if (config.moduleMode && !!config.distFolder) {
    deleteDir(config.distFolder) // 先刪除指定資料夾
    fs.mkdirSync(config.distFolder) // 再重新創建資料夾

    // 按照每個接口分類去產生對應檔案
    for (const category of categoryList) {
      code = genCode(categoryCollection[category._id])
      fs.writeFileSync(`${config.distFolder}/${category.desc}.js`, code, 'utf8');
    }
    fs.writeFileSync(`${config.distFolder}/http-request.js`, genHttpRequest(), 'utf8');
    return
  }
  fs.writeFileSync(config.distFile, code, 'utf8');
}
