const path = require('path')
const url = require('url')
const fs = require('fs')
const auth = require('basic-auth')

const schedule = require('./schedule')
schedule.load()

const formidableFix = require('./formidableFix')
const formidable = require('formidable')
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.static(path.join(__dirname, '/public')))
app.use(morgan('dev'))

function topSecretAuth(req, res, next) {
    const login = auth(req)
    //TODO credential from config file
    if (!login || login.name !== "admin" || login.pass !== "admin") {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="admin"')
        res.end('Access denied')
        return
    }
    else {
        return next()
    }
}

app.get('/', topSecretAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "/html", "index.html"))
})

app.get('/schedule', topSecretAuth, (req, res) => {
    res.json(schedule.getNameList())
})

app.get('/addSchedule', topSecretAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "/html", "add.html"))
})

app.get('/editSchedule', topSecretAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "/html", "edit.html"))
})

app.post('/getEvent', topSecretAuth, (req, res) => {
    const form = new formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        return res.json(schedule.getEventByName(fields.name))
    })
})
app.get('/currentScreen', topSecretAuth, (req, res) => {

    electronCallbacks.generateScreenShot(function () {
        res.sendFile(path.join(__dirname, "/uploads", "currentScreen.png"))
    })
})

app.get('/deleteEvent', topSecretAuth, (req, res) => {
    schedule.removeEvent(req.query["name"])
    res.redirect('/')
})

app.post('/editSchedule', topSecretAuth, (req, res) => {

    const allowedChars = "1234567890abcdefghijklmnopqrstuvwxyz" +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ_-."

    const form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '/uploads')
    form.multiples = true

    form.parse(req, function (err, fields, files) {

        const name = fields.name

        if (!name) {
            const errorMsg = "Nazwa nie może być pusta."
            return res.redirect(url.format({
                pathname: "/editSchedule",
                query: {
                    "name": fields.previous,
                    "err": errorMsg
                }
            }))
        }

        for (let i = 0; i < name.length; i++) {
            const char = name.charAt(i)
            if (!allowedChars.includes(char)) {
                const errorMsg = "Nazwa zawiera niedozwolony znak: '" + char + "'"
                return res.redirect(url.format({
                    pathname: "/editSchedule",
                    query: {
                        "name": fields.previous,
                        "err": errorMsg
                    }
                }))
            }
        }

        let uri = ""
        let message = ""
        switch (fields.contentType) {
            case "remote":
            case "youtube":
                uri = fields.url
                break
            case "video":
            case "image":
                uri = handleFileUpload(files.file, name)
                break
            case "bar":
                message = fields.message
                break
            case "clock":
                break
        }

        if (files.file.size == 0) {
            fs.unlink(files.file.path, (err) => { })
        }

        let startTime = valueOrAsterisk(fields.startSeconds) + " " +
            valueOrAsterisk(fields.startMinutes) + " " +
            valueOrAsterisk(fields.startHours) + " " +
            valueOrAsterisk(fields.startDoM) + " "
        if (fields.startMonths) {
            if (Array.isArray(fields.startMonths))
                startTime += fields.startMonths.join() + " "
            else
                startTime += fields.startMonths + " "
        }
        else
            startTime += "* "
        if (fields.startDoW) {
            if (Array.isArray(fields.startDoW))
                startTime += fields.startDoW.join()
            else
                startTime += fields.startDoW
        }
        else
            startTime += "*"

        let stopTime = valueOrAsterisk(fields.stopSeconds) + " " +
            valueOrAsterisk(fields.stopMinutes) + " " +
            valueOrAsterisk(fields.stopHours) + " " +
            valueOrAsterisk(fields.stopDoM) + " "
        if (fields.stopMonths) {
            if (Array.isArray(fields.stopMonths))
                stopTime += fields.stopMonths.join() + " "
            else
                stopTime += fields.stopMonths + " "
        }
        else
            stopTime += "* "
        if (fields.stopDoW) {
            if (Array.isArray(fields.stopDoW))
                stopTime += fields.stopDoW.join()
            else
                stopTime += fields.stopDoW
        }
        else
            stopTime += "*"


        schedule.updateEvent(fields.previous, {
            "name": name,
            "start": startTime,
            "stop": stopTime,
            "type": fields.contentType,
            "uri": uri,
            "message": message,
            "priority": fields.priority,
            "bcolor": fields.bcolor,
            "color": fields.color
        })

        res.redirect('/')
    })
})

app.post('/addSchedule', topSecretAuth, (req, res) => {

    const allowedChars = "1234567890abcdefghijklmnopqrstuvwxyz" +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ_-."

    const form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '/uploads')
    form.multiples = true

    form.parse(req, function (err, fields, files) {

        const name = fields.name

        if (!name) {
            const errorMsg = "Nazwa nie może być pusta."
            return res.redirect(url.format({
                pathname: "/addSchedule",
                query: {
                    "err": errorMsg
                }
            }))
        }

        for (let i = 0; i < name.length; i++) {
            const char = name.charAt(i)
            if (!allowedChars.includes(char)) {
                const errorMsg = "Nazwa zawiera niedozwolony znak: '" + char + "'"
                return res.redirect(url.format({
                    pathname: "/addSchedule",
                    query: {
                        "err": errorMsg
                    }
                }))
            }
        }

        let uri = ""
        let message = ""
        switch (fields.contentType) {
            case "remote":
            case "youtube":
                uri = fields.url
                break
            case "video":
            case "image":
                uri = handleFileUpload(files.file, name)
                break
            case "bar":
                message = fields.message
                break
            case "clock":
                break
        }

        if (files.file.size == 0) {
            fs.unlink(files.file.path, (err) => { })
        }

        let startTime = valueOrAsterisk(fields.startSeconds) + " " +
            valueOrAsterisk(fields.startMinutes) + " " +
            valueOrAsterisk(fields.startHours) + " " +
            valueOrAsterisk(fields.startDoM) + " "
        if (fields.startMonths) {
            if (Array.isArray(fields.startMonths))
                startTime += fields.startMonths.join() + " "
            else
                startTime += fields.startMonths + " "
        }
        else
            startTime += "* "
        if (fields.startDoW) {
            if (Array.isArray(fields.startDoW))
                startTime += fields.startDoW.join()
            else
                startTime += fields.startDoW
        }
        else
            startTime += "*"

        let stopTime = valueOrAsterisk(fields.stopSeconds) + " " +
            valueOrAsterisk(fields.stopMinutes) + " " +
            valueOrAsterisk(fields.stopHours) + " " +
            valueOrAsterisk(fields.stopDoM) + " "
        if (fields.stopMonths) {
            if (Array.isArray(fields.stopMonths))
                stopTime += fields.stopMonths.join() + " "
            else
                stopTime += fields.stopMonths + " "
        }
        else
            stopTime += "* "
        if (fields.stopDoW) {
            if (Array.isArray(fields.stopDoW))
                stopTime += fields.stopDoW.join()
            else
                stopTime += fields.stopDoW
        }
        else
            stopTime += "*"

        schedule.addToSchedule({
            "name": name,
            "start": startTime,
            "stop": stopTime,
            "type": fields.contentType,
            "uri": uri,
            "message": message,
            "priority": fields.priority,
            "bcolor": fields.bcolor,
            "color": fields.color
        })

        res.redirect('/')
    })
})

app.listen(6325, function () {
    console.log("Server started")
})

function handleFileUpload(file, name) {
    if (file.name == "")
        return ""
    const filename = name + "." + file.name.split('.').slice(-1)[0]
    var filepath = path.join(__dirname, '/uploads', filename)
    filepath = filepath.replace(/\\/g, '/');
    fs.renameSync(file.path, filepath)
    return filepath
}

function valueOrAsterisk(value) {
    const xd = value.replace(/\s/g, '')
    if (xd)
        return xd
    else
        return "*"
}

let electronCallbacks

module.exports = function (callbacks) {
    electronCallbacks = callbacks
    schedule.setElectronCallbacks(callbacks)
}