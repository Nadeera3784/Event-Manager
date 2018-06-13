const teeny    = require('teeny-conf');
const path     = require('path');

class Settings {
	constructor(app) {
	
		const defaultConfig = this.getDefaultConfig();
		const pathUserData = app.getPath('userData');

		this.conf = new teeny(path.join(pathUserData, 'config.json'));
		this.conf.loadOrCreateSync(defaultConfig);

		// Check if config update
		let configChanged = false;

		for(const key in defaultConfig) {
			if(this.conf.get(key) === undefined) {
				this.conf.set(key, defaultConfig[key]);
				configChanged = true;
			}
		}

		// save config if changed
		if(configChanged) this.conf.saveSync();
	}

	getDefaultConfig() {
		return {
			username: 'light',
			password: '12345',
		};
	}

	getConfig() {
		return this.conf.getAll();
	}
}

module.exports = Settings;
