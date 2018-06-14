Object.defineProperty(exports, "__esModule", { value: true });

const crypto = require('crypto');

let SanitizeHelpers = (function () {
	function SanitizeHelpers() {
	}
	
	SanitizeHelpers.prototype.charScape = function (str) {
		//return str.replace(/^[hr|br|strong|caption|thead]+/, 'removed')
		return str
				.replace('caption', 'removed')
				.replace('strong', 'removed')
				.replace('hr', 'removed')
			    .replace('thead', 'removed')
			    .replace('code', 'removed')
			    .replace('blockquote', 'removed')
			    .replace('iframe', 'removed')
			    .replace('mailto', 'removed')
			    .replace('em', 'removed')
			    .replace('aside', 'removed');
	};
	
	SanitizeHelpers.prototype.isEmpty = function (str) {
		if(str != '' || str != null || str.length > 0 ){
			return str;
		 }else{
		    return false;
		 }
	};
	
	SanitizeHelpers.prototype.encrypt = function (str) {
		const cipher = crypto.createCipher('aes192', '32C8A5A563F7EE8A01AC4EA062528763215FAB398837212762C3F2CF4FE57A99');
		let encrypted = cipher.update(str, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		return encrypted;
	};
	
	SanitizeHelpers.prototype.decrypt = function (str) {
		const decipher = crypto.createDecipher('aes192', '32C8A5A563F7EE8A01AC4EA062528763215FAB398837212762C3F2CF4FE57A99');
		const encrypted = str;
		let decrypted = decipher.update(encrypted, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	};

	return SanitizeHelpers;
}());
exports.SanitizeHelpers = SanitizeHelpers;