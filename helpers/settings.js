const fs = require('fs');

class SettingsHelpers {
	constructor(app) {

		this.path = app.getPath('userData');
		this.config_path = `${this.path}/config.json`;

		
		if (!fs.existsSync(this.config_path)) {

			this.default_config = {
				username: '',
				password: ''
			};

			fs.openSync(this.config_path, 'w');
			fs.writeFileSync(this.config_path, JSON.stringify(this.default_config, null), { flag: 'w' });
		}
	}
	
	setConfig(data) {
		fs.writeFile(this.config_path, JSON.stringify(data, null), { flag: 'w' },  function(err){
			console.log(err);
		});
	}
	
	getConfig() {
		return JSON.parse(fs.readFileSync(this.config_path).toString());
	}
}

module.exports = SettingsHelpers;
