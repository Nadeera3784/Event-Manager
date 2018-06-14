Object.defineProperty(exports, "__esModule", { value: true });

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
	
	return SanitizeHelpers;
}());
exports.SanitizeHelpers = SanitizeHelpers;