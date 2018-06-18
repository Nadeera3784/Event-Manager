var os          = require('os');
var cp          = require('child_process');
var fs          = require('fs');
var path        = require('path');
var mkdirp      = require('mkdirp');
var electronPackager = require('electron-packager');
var series      = require('run-series');
var minimist    = require('minimist');
var pkg         = require('./package.json');
var zip         = require('cross-zip');
var rimraf      = require('rimraf');

var APP_NAME    = 'EventManager';
var APP_TEAM    = 'EventManager';
var APP_VERSION = pkg.version;
var BUILD_NAME  = APP_NAME + '-v' + APP_VERSION;
var ROOT_PATH   = __dirname;
var DIST_PATH   = path.join(ROOT_PATH, 'dist');
var APP_ICON    = path.join(__dirname, 'images', 'icon');
	
var argv = minimist(process.argv.slice(2), {
	boolean: [
		'sign'
	],
	default: {
		package: 'all',
		sign: false
	},
	string: [
		'package'
	]
});

function build () {
	rimraf.sync(DIST_PATH)
	var platform = argv._[0]
	if(platform === 'win32') {
		buildWin32(printDone);
	}else{
		buildWin32(function (err) {
			printDone(err);
		});
	}
}

var win32 = {
	// Build for Windows.
	platform: 'win32',

	// Build 32 bit binaries only.
	arch: 'ia32',

	// Object hash of application metadata to embed into the executable (Windows only)
	'version-string': {

		// Company that produced the file.
		CompanyName: APP_NAME,

		// Name of the program, displayed to users
		FileDescription: APP_NAME,

		// Original name of the file, not including a path. This information enables an
		// application to determine whether a file has been renamed by a user. The format of
		// the name depends on the file system for which the file was created.
		OriginalFilename: APP_NAME + '.exe',

		// Name of the product with which the file is distributed.
		ProductName: APP_NAME,

		// Internal name of the file, if one exists, for example, a module name if the file
		// is a dynamic-link library. If the file has no internal name, this string should be
		// the original filename, without extension. This string is required.
		InternalName: APP_NAME
	},

	// Application icon.
	icon: APP_ICON + '.ico'
}

build();

function buildWin32 (cb) {
	var installer = require('electron-winstaller');
	console.log('Windows: Packaging electron...');
	electronPackager(Object.assign({}, win32), function (err, buildPath) {
		if (err) return cb(err)
		console.log('Windows: Packaged electron. ' + buildPath);
		
		var tasks = []
		if (argv.package === 'exe') {
			tasks.push((cb) => packageInstaller(cb))
		}
		series(tasks, cb)

		function packageInstaller (cb) {
			console.log('Windows: Creating installer...')

			installer.createWindowsInstaller({
				appDirectory: buildPath[0],
				authors: APP_TEAM,
				description: APP_NAME,
				exe: APP_NAME + '.exe',
				//iconUrl: config.GITHUB_URL_RAW + '/static/' + config.APP_NAME + '.ico',
				//loadingGif: path.join(config.STATIC_PATH, 'loading.gif'),
				name: APP_NAME,
				noMsi: true,
				outputDirectory: DIST_PATH,
				productName: APP_NAME,
				//remoteReleases: config.GITHUB_URL,
				setupExe: APP_NAME + 'Setup-v' + APP_VERSION + '.exe',
				setupIcon: APP_ICON + '.ico',
				//signWithParams: signWithParams,
				title: APP_NAME,
				usePackageJson: false,
				version: pkg.APP_VERSION
			}).then(function () {
				console.log('Windows: Created installer.')
				cb(null)
			}).catch(cb)
		}
	});
}
function printDone (err) {
	if (err) console.error(err.message || err);
}

function printWarning () {
	console.log('Error!!!');
}

