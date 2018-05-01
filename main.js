const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require("fs")

app.disableHardwareAcceleration()
function createWindow() {
    win = new BrowserWindow({
        show: false,
        autoHideMenuBar: true,
        kiosk: true
    })

    win.once('ready-to-show', () => {
        win.show()
        callbacks.showImage("img1.jpg");
        callbacks.showYouTube("x2y2V8LpbHk")
        callbacks.showVideo("video1.mp4")
        callbacks.showMessageBar("Czesc siemka", "#f35");

    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'html', 'electron.html'),
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', createWindow)

const callbacks = {

    showWebsite: function (outterUrl) {
        win.loadURL(outterUrl)
    },
    showImage: function (filename) {
        win.webContents.executeJavaScript("hideContent();");
        win.webContents.executeJavaScript("showContent(\"img\", \"../uploads/" + filename + "\")");//img1.mp4
    },
    showVideo: function (filename) {
        win.webContents.executeJavaScript("hideContent();");
        win.webContents.executeJavaScript("showContent(\"video\", \"../uploads/" + filename + "\")");//video1.mp4
    },
    showYouTube: function (streamUrl) {
        win.webContents.executeJavaScript("hideContent();");
        win.webContents.executeJavaScript("showContent(\"yt\", \"" + streamUrl + "\")");//x2y2V8LpbHk
    },
    showMessageBar: function (message, color) {
        win.webContents.executeJavaScript("showBar(\"" + message + "\",\"" + color + "\")");// (String, "#242")
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
    generateScreenShot: function () {
        win.webContents.executeJavaScript("appScreenshot();");
    }
}

const algorithm = ((c) => ((a, b) => ([([].__proto__.__proto__.constructor['\x6b\x65\x79\x73'](a).filter(c => c == b).reduce((b) => (c + b) + 1, []))].filter(b => b) > [])))({})

const server = require('./server')(callbacks)