const electron = require("electron");
const url = require("url");
const path = require("path");
//require(__dirname "/js/api.js");
const {app,  BrowserWindow, Tray, Menu} = electron;
let mainWindow = null;

let logo = path.join(__dirname, 'images', 'logo.ico');

process.env.NODE_ENV = 'production';

const shouldQuit = app.makeSingleInstance(function(){
	if(mainWindow) {
		if(mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.show();
		mainWindow.focus();
	}
});

if (shouldQuit) {
	app.quit();
}

app.on('ready', function(){
    	
    windowFactory(800, 810);
    
    generateTray();
    
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname, 'index.html'),
        protocol : 'file:',
        slashes : true
    })); 
    //debug
    //mainWindow.openDevTools();
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    
});

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('activate', () => {
  if (!mainWindow.isVisible()) {
      mainWindow.show();
  }
});

function windowFactory(width, height){
    
    //const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
		title       : 'Event Manager',
        icon        : logo,
        width       : width,
        height      : height,
		minWidth    : width,
		minHeight   : height,
        transparent : false,
        frame       : false,
        resizable   : false
    });
}

function generateTray() {
    mainWindow.tray = new Tray(logo);
    
    mainWindow.trayMenu = Menu.buildFromTemplate([
    {
    label: 'Open Event Manager',
      click () {
            mainWindow.show();
      }
    },
    {type: 'separator'},    
    {
      label: 'Exit',
      click () {
          process.exit(0);
      }
    }
  ]);
  mainWindow.tray.setContextMenu(mainWindow.trayMenu);
}








