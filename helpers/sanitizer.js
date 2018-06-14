"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

let SanitizeHelpers = (function () {
	function SanitizeHelpers {
	}
	
	SanitizeHelpers.prototype.charScape = function (str) {
		return str.replace(/^[hr]+/, ':)')
	};
	
	SanitizeHelpers.prototype.isEmpty = function (str) {
		if(str != '' || str != null ){
			return str;
		 }else{
		    return false;
		 }
	};
	
	return SanitizeHelpers;
}());
exports.SanitizeHelpers = SanitizeHelpers;