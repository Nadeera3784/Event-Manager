Object.defineProperty(exports, "__esModule", { value: true });

let mailer = require("nodemailer");

let MailHelpers = (function () {
	function MailHelpers() {
	}

	SanitizeHelpers.prototype.send = function (to, subject, text) {
		return new Promise(function(resolve, reject) {
			let smtpTransport = mailer.createTransport("SMTP", {
				service: "gmail",
				host:'smtp.gmail.com',
				auth: {
					user: "gmail_id@gmail.com",
					pass: "gmail_password"
				}
			});

			let mail = {
				from: "Yashwant Chavan <from@gmail.com>",
				to: to,
				subject: "Send Email Using Node.js",
				text: subject
			}
			
			smtpTransport.sendMail(mail, function(error, response){
				if (error) reject(error);
				resolve(response);
				smtpTransport.close();
			});
		});
	};

	return MailHelpers;
}());
exports.MailHelpers = MailHelpers;