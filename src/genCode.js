const config = require('./config');
const genParamsCode = require('./genParamsCode');

module.exports = function genCode(interfaceList) {
  let code = '';
  code = `/* eslint-disable */\n`;
  code += config.useCustomHttpRequest ? `import httpRequest from '@/http-request';` : `import httpRequest from './http-request';`;
  interfaceList.forEach(interfaceData => {
    let interfaceDataTemplate = {
      title: interfaceData.title,
      method: interfaceData.method,
      path: interfaceData.path,
      mock_path: `${config.server}/mock/${config.projectId}${interfaceData.path}`,
      status: interfaceData.status,
      req_params: interfaceData.req_params,
      req_query: interfaceData.req_query,
      req_body: interfaceData.req_body_other ? JSON.parse(interfaceData.req_body_other).properties : {},
    };
    const allParams = [...interfaceData.req_params, ...interfaceData.req_query];

    const functionName = interfaceData.custom_field_value
      ? interfaceData.custom_field_value
      : config.methodName(interfaceData.path, interfaceData.method);

    code += `
/**
 * @title ${interfaceData.title}
 * @path ${interfaceData.path}
 * ${genParamsCode(allParams)}
 */
export const ${functionName} = (params, options = {}) => {
  const interfaceData=${JSON.stringify(interfaceDataTemplate, null, 2)};
  return httpRequest(interfaceData,params, options)
}
  `;
  });

  return code;
};
