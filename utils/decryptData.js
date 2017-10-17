var WXBizDataCrypt = require('./WXBizDataCrypt');

var appId = 'wxd7a769c6f2a08b9a';

function decryptData(sessionKey, encryptedData, iv) {
	var pc = new WXBizDataCrypt(appId, sessionKey);
	var data = pc.decryptData(encryptedData, iv);
	console.log('解密后 data: ', data);
	return data;
}
module.exports = {
	decryptData: decryptData,
	appId: appId,
};
