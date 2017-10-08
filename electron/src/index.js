const electron = require('electron');
const { app, BrowserWindow } = electron;

// When app event "ready" is fired, let's invoke our code.
app.on('ready', () => {
    // Let's make our window.
    let mainWindow = new BrowserWindow({
        width: 1050,
        height: 700
    });

    // Set title and load ViStriker from online website.
    mainWindow.setTitle('Loading ViStriker from GitHub Pages servers...');
    mainWindow.loadURL('http://finalgalaxy.github.io/vistriker-FE/');

    // Clear window when "closed" event is fired on mainWindow object.
    mainWindow.on('closed', () => app.quit());
});
