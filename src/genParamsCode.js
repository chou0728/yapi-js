module.exports = function genParamsCode(paramsList) {
  let code = '';
  paramsList.forEach(param => {
    code += `@param ${param.name} ${param.desc} ${param.required ? 'required' : ''}\n * `;
});
  return code;
};
