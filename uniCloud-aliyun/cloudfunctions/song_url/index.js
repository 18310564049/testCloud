const https = require("https");

const options = {
  hostname: 'jsonplaceholder.typicode.com',
  port: 443,
  path: '/posts/1',
  method: 'GET',
  headers: {
    // 'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  }
};
'use strict';
exports.main = async(event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
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