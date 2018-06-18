'use strict';
var packager        = require('electron-packager');
var electronPackage = require('electron/package.json');
var electronVersion = electronPackage.version;
var pkg             = require('./package.json');
var options = {
	'arch'         : 'ia32',
	'platform'     : 'win32',
	'dir'          : './',
	'app-copyright': pkg.author,
	'app-version'  : pkg.version,
	'asar'         : {unpackDir: config.excludeFromASAR},
	'icon'         : './app.ico',
	'name'         : pkg.name,
	'out'          : './releases',
	'overwrite'    : true,
	'prune'        : true,
	'version'      : pkg.version,
	'electronVersion': electronVersion,
	'version-string': {
		'CompanyName'     : pkg.author,
		'FileDescription' : pkg.description,
		'OriginalFilename': pkg.name,
		'ProductName'     : pkg.name,
		'InternalName'    : pkg.name
	}
};
packager(options, function done_callback(err, appPaths) {
	console.log("Error: ", err);
	console.log("appPaths: ", appPaths);
});


