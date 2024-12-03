const https = require("https");

const signatureAndroidParams = (params, data) => {
  // const isLite = process.env.platform === 'lite';
  const str =  'LnT6xpN3khm36zse0QzvmgTZ3waWdRSA'
  const paramsString = Object.keys(params)
    .sort()
    .map((key) => `${key}=${typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key]}`)
    .join('');
  return cryptoMd5(`${str}${paramsString}${data || ''}${str}`);
};
let  params = {
	    dfid: '-',
	    mid: '336d5ebc5436534e61d16e63ddfca327',
	    uuid: '15e772e1213bdd0718d0c1d10d64e06f',
	    appid: 3116,
	    clientver: 10940,
	    userid: 0,
	    clienttime: 1733207567,
	    platform: 'AndroidFilter',
	    keyword: '海阔天空',
	    page: 1,
	    pagesize: 30,
	    category: 1,
	  };
	  // let signature= signatureAndroidParams(params,'')
	  params.signature ='478e8b8010fd903cc1c16c07bbaa1d73'
const options = 
	{
	  data: undefined,
	  method: 'GET',
	  baseURL: 'https://gateway.kugou.com',
	  url: '/v2/search/song',
	  headers: {
	    'x-router': 'complexsearch.kugou.com',
	    dfid: '-',
	    clienttime: 1733207567,
	    mid: '336d5ebc5436534e61d16e63ddfca327',
	    'X-Real-IP': '::1',
	    'X-Forwarded-For': '::1'
	  },
	  withCredentials: true,
	  responseType: undefined
	}
	options.params = params
'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ',context)
	
	try {
	   const body = await new Promise((resolve, reject) => {
	     let data = '';
	     const req = https.request(options, res => {
	       res.on('data', chunk => {
	         data += chunk;
	       });
	       res.on('end', () => {
	         try {
	           resolve(JSON.parse(data));
	         } catch (parseErr) {
	           reject(parseErr);
	         }
	       });
	     });
		
	     req.on('error', err => {
	       reject(err);
	     });
		
	     req.end();
	   });
		
	   console.log(body);
	   return {
	     code: '1',
	     Msg: 'success',
	     body: body
	   };
	 } catch (error) {
	   console.error("Error with the request:", error);
	   return {
	     code: '2',
	     Msg: 'error',
	     error: error.message
	   };
	 }
};
