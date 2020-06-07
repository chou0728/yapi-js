const config = require('./config');
const genParamsCode = require('./genParamsCode')

module.exports = function genCode(interfaceList) {
  let code = '';
  code = `import { httpRequest } from './http-request'; `;
  interfaceList.forEach(async interfaceData => {
    let interfaceDataTemplate = {
      title: interfaceData.title,
      method: interfaceData.method,
      path: interfaceData.path,
      status: interfaceData.status,
      req_params: interfaceData.req_params,
      req_query: interfaceData.req_query,
      req_body: interfaceData.req_body_other ? JSON.parse(interfaceData.req_body_other).properties : {}
    }
    if (interfaceData.req_body_other) {
      console.log(JSON.parse(interfaceData.req_body_other))
    }
    const allParams = [...interfaceData.req_params, ...interfaceData.req_query]

    code += `
/**
 * @title ${interfaceData.title}
 * @path ${interfaceData.path}
 * ${genParamsCode(allParams)}
 */
export const ${config.methodName(interfaceData.path, interfaceData.method)} = (params, options = {}) => {
  let interfaceData=${JSON.stringify(interfaceDataTemplate, null, 2)};
  return httpRequest(interfaceData,params, options)
}
  `;
  });

  return code;
};
