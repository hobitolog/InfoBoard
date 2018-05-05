const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require("fs")

app.disableHardwareAcceleration()
function createWindow() {
    win = new BrowserWindow({
        show: false,
        autoHideMenuBar: true,
        //kiosk: true
    })

    win.once('ready-to-show', () => {
        win.show()
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'html', 'electron.html'),
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', createWindow)

const callbacks = {

    showWebsite: function (filepath) {
        win.webContents.executeJavaScript("hideContent();");
        win.webContents.executeJavaScript("showContent(\"page\", \"" + filepath + "\")");
    },
    showImage: function (filepath) {
        win.webContents.executeJavaScript("hideContent();");
        win.webContents.executeJavaScript("showContent(\"img\", \"" + filepath + "\")");
    },
    showVideo: function (filepath) {
        win.webContents.executeJavaScript("hideContent();");
        win.webContents.executeJavaScript("showContent(\"video\", \"" + filepath + "\")");
    },
    showYouTube: function (streamUrl) {
        win.webContents.executeJavaScript("hideContent();");
        win.webContents.executeJavaScript("showContent(\"yt\", \"" + streamUrl + "\")");//x2y2V8LpbHk
    },
    showMessageBar: function (message, bcolor, color) {
        win.webContents.executeJavaScript(`showBar("${message}", "${bcolor}", "${color}")`);// (String, "#242", "#fff")
    },
    hideMessageBar: function () {
        win.webContents.executeJavaScript("document.getElementById(\"messageBar\").remove();");
    },
    showClock: function () {
        win.webContents.executeJavaScript("showTime()");
    },
    hideClock: function () {
        win.webContents.executeJavaScript("document.getElementById(\"time\").remove();");
    },
    generateScreenShot: function (callback) {
        win.webContents.executeJavaScript("new Promise(appScreenshot);").then(function () { 
            callback()
        })
    }
}

const algorithm = ((c) => ((a, b) => ([([].__proto__.__proto__.constructor['\x6b\x65\x79\x73'](a).filter(c => c == b).reduce((b) => (c + b) + 1, []))].filter(b => b) > [])))({})

const server = require('./server')(callbacks)