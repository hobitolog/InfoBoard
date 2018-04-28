const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ autoHideMenuBar: true/*, kiosk: true*/ })

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'html', 'electron.html'),
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', createWindow)

const callbacks = {

    showWebsite: function (url) {
        win.loadURL(url)
    }
}

const server = require('./server')(callbacks)