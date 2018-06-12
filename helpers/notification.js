"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var Noty = require('../js/notie.min.js');

var NotificationHelpers = (function () {
    function NotificationHelpers() {
    }
    NotificationHelpers.prototype.error = function (msg, timeout) {
        Noty.alert({
            type: 3,
            text: msg,
            time: timeout
        });
    };
    
    NotificationHelpers.prototype.success = function (msg, timeout) {
        Noty.alert({
            type: 1,
            text: msg,
            time: timeout
        });
    };
    
    NotificationHelpers.prototype.warning = function (msg, timeout) {
        Noty.alert({
            type: 2,
            text: msg,
            time: timeout
        });
    };
    
    NotificationHelpers.prototype.confirm = function (msg, callback, subcallback) {
        Noty.confirm({
            type: 1,
            text: msg,
            cancelCallback: function () {
                callback();
            },
            submitCallback: function () {
                subcallback();
            }            
        });        
    };    
	
	NotificationHelpers.prototype.input = function (callback, subcallback) {
		Noty.input({
			text: 'Please Enter Recipient Email Address',
			cancelCallback: function (value) {
				callback(value);
			},
			submitCallback: function (value) {
				subcallback(value);
			},
			type: 'email',
			placeholder: 'name@example.com',
			spellcheck: 'true',
			allowed: new RegExp('^(([-\w\d]+)(\.[-\w\d]+)*@([-\w\d]+)(\.[-\w\d]+)*(\.([a-zA-Z]{2,5}|[\d]{1,3})){1,2})$')
		});        
	};  
    return NotificationHelpers;
}());
exports.NotificationHelpers = NotificationHelpers;
