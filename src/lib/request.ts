import * as request from "request";

let options = {
	headers: {
		'User-Agent': "charredgrass/charred-discord-bot - @Charred#9898"
	}
}

function callAPI(url : String, cb : Function, ecb : Function) {
	try {
		request({
			url,
			headers: {
				'User-Agent': "charredgrass/charred-discord-bot - @Charred#9898"
			}
		}, cb); //cb(error, response, body)
	} catch (err) {
		ecb("API Error: " + err.message);
	}
}

function callAPIPromise(url : String) : Promise<Object> {
	return new Promise((resolve, reject) => {
		try {
			request({
				url,
				headers: {
					'User-Agent': "charredgrass/charred-discord-bot - @Charred#9898"
				}
			}, (e, r, body) => {
				resolve(body);
			}); //cb(error, response, body)
		} catch (err) {
			reject("API Error: " + err.message);
		}
	});
}

export {callAPI};