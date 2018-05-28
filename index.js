const electron = require("electron");
const url = require("url");
const path = require("path");
const {app,  BrowserWindow, Tray, Menu} = electron;

let mainWindow = null;

let logo = path.join(__dirname, 'images', 'logo.png');

process.env.NODE_ENV = 'development';

app.on('ready', function(){
    
    Windowfactory(800, 850);
    
    generateTray();
    
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname, 'index.html'),
        protocol : 'file:',
        slashes : true
    })); 
    //debug
    mainWindow.openDevTools();
    
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

function Windowfactory(width, height){
    
    //const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        icon: logo,
        width: width,
        height: height,
        transparent: true,
        frame: false,
        resizable: false
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











