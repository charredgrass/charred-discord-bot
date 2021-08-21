import * as request from "request";

function callAPI(url : String, cb : Function, ecb : Function) {
	try {
		request(url, cb); //cb(error, response, body)
	} catch (err) {
		ecb("API Error: " + err.message);
	}
}

export {callAPI};