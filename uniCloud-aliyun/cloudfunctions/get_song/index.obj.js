const fs = require('node:fs');
const path = require('path');
const { cookieToJson } = require('./util');

/** @type {Record<string, any>} */
let obj = {};

fs.readdirSync(path.join(__dirname, 'module'))
  .reverse()
  .forEach((file) => {
    if (!file.endsWith('.js')) return;
    let fileModule = require(path.join(__dirname, 'module', file));
    let fn = file.split('.').shift() || '';
    obj[fn] = (data = {}) => {
      if (typeof data.cookie === 'string') data.cookie = cookieToJson(data.cookie);
      return fileModule({ ...data, cookie: data.cookie ? data.cookie : {} }, (...args) => {
        const { createRequest } = require('./util/request');
        return createRequest(...args);
      });
    };
  });

/**
 * @type {Record<string, any> & import("./server")}
 */

// module.exports = { ...require('./util/request'), ...obj };
// module.exports = { ...require('./util/request'), ...obj };
module.exports = {
	_before: function () { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	say() {
		console.log(obj)
		// 参数校验，如无参数则不需要
		
		// 业务逻辑
		
		// 返回结果
		return {
				code: '1',
				Msg: 'success'
		}
	},
	...obj
}