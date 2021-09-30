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

export {callAPI};