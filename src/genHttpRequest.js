const config = require('./config');

module.exports = function genHttpRequest() {
  let templateContent;
  if (typeof config.template === 'string') {
    templateContent = fs.readFileSync(path.resolve(__dirname, `../template/${config.template}.js`), 'utf8');
  } else if (typeof config.template === 'function') {
    templateContent = config.template();
  }

  let code = config.globalCode || '';

  code += `

export function httpRequest(interfaceData, params, options) {
  
  let  url =  interfaceData.status === 'done' ? interfaceData.path : interfaceData.mock_path;
  let method = interfaceData.method;

  let isRestful = false;
  if (url.indexOf(':') > 0){
    isRestful = true;
  } else if(url.indexOf('{') > 0 && url.indexOf('}') > 0){
    isRestful = true;
  }

  if(isRestful){
    interfaceData.req_params.forEach(item=>{
      let val = params[item.name];
      if(!val){
        throw new Error('路径参数 ' + item.name + ' 不能为空')
      }
      url = url.replace(":" + item.name , val );
      url = url.replace("{" + item.name + "}", val );
      delete params[item.name]
    })
  }

  ${templateContent}

  return request({
    url,
    method,
    params: method === 'GET' ? params : '',
    data: method === 'GET' ? '' : params
  }, options)
}
`;

  return code;
};
