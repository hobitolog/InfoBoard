const scrape = require('website-scraper')
const path = require('path')
const fs = require('fs')

const BACKUPS_DIR = 'site_backups'
const TEMP_DIR = 'site_temp'

if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR)
}
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR)
}

module.exports = {

    backupWebsite: function (event) {

        if (event.type != "remote")
            throw new Error("Event musi mieć typ remote, a ma " + event.type)

        download(event, function (err, result) { }, true)
    },

    getWebsitePath: function (event, callback) {

        if (event.type != "remote")
            throw new Error("Event musi mieć typ remote, a ma " + event.type)

        download(event, function (err, result) {
            if(err) {
                callback(path.join(BACKUPS_DIR, event.name, '/index.html'))
            }
            else
                callback(path.join(TEMP_DIR, event.name, '/index.html'))
        }, false)
    }
}

function download(event, callback, backup) {

    const htmlDir = backup ? 
    path.join(BACKUPS_DIR, event.name) : path.join(TEMP_DIR, event.name)

    if (fs.existsSync(htmlDir)) {
        deleteFolderRecursive(htmlDir)
    }

    const options = {
        urls: [event.uri],
        directory: htmlDir,
    }

    scrape(options).then((result) => {
        callback(null, result)
    }).catch((err) => {
        callback(err, null)
    })
}

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath)
            } else {
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(path)
    }
}