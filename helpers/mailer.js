Object.defineProperty(exports, "__esModule", { value: true });

let mailer = require("nodemailer");

let MailHelpers = (function () {
	function MailHelpers() {
	}

	MailHelpers.prototype.send = function (value, subject, text) {
		return new Promise(function(resolve, reject) {
			let smtpTransport = mailer.createTransport({
				service: "gmail",
				host:'smtp.gmail.com',
				auth: {
					user: "gmail_id@gmail.com",
					pass: "gmail_password"
				}
			});

			let mail = {
				from: "Yashwant Chavan <from@gmail.com>",
				to: value,
				subject: subject,
				text: text
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