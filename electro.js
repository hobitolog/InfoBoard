const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

var ipc = require('node-ipc');

ipc.config.id = 'InfoBoardClient';
ipc.config.retry = 1500

ipc.connectTo('InfoBoardServer', function () {
    ipc.of.InfoBoardServer.on('connect', function () {
        ipc.of.InfoBoardServer.emit('message', 'hello')
    })
    ipc.of.InfoBoardServer.on('disconnect', function () {
        ipc.log('disconnected from InfoBoardServer'.notice);
    });
    ipc.of.InfoBoardServer.on('message', function (data) {
        win.loadURL(data)
    });
});

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ autoHideMenuBar: true, kiosk: true })

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'html', 'electron.html'),
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', createWindow)