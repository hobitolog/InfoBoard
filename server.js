const path = require('path')
const url = require('url')
const fs = require('fs')

const schedule = require('./schedule')
schedule.load()

const formidable = require('formidable')
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.static(path.join(__dirname, '/public')))
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/html", "index.html"))
})

app.get('/schedule', (req, res) => {
    res.json(schedule.getNameList())
})

app.get('/addSchedule', (req, res) => {
    res.sendFile(path.join(__dirname, "/html", "add.html"))
})

app.get('/editSchedule', (req, res) => {
    res.sendFile(path.join(__dirname, "/html", "edit.html"))
})

app.post('/getEvent', (req, res) => {
    const form = new formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        return res.json(schedule.getEventByName(fields.name))
    })
})
app.get('/currentScreen', (req, res) => {

    electronCallbacks.generateScreenShot(function() {
        res.sendFile(path.join(__dirname, "/uploads", "currentScreen.png"))
    })
})

app.get('/deleteEvent', (req, res) => {
    schedule.removeEvent(req.query["name"])
    res.redirect('/')
})

app.post('/editSchedule', (req, res) => {

    const allowedChars = "123456789abcdefghijklmnopqrstuvwxyz" +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ_-."

    const form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '/uploads')

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
            fs.unlink(files.file.path)
        }

        const startTime = valueOrAsterisk(fields.startSeconds) + " " +
            valueOrAsterisk(fields.startMinutes) + " " +
            valueOrAsterisk(fields.startHours) + " " +
            valueOrAsterisk(fields.startDoM) + " " +
            valueOrAsterisk(fields.startMonths) + " " +
            valueOrAsterisk(fields.startDoW)

        const stopTime = valueOrAsterisk(fields.stopSeconds) + " " +
            valueOrAsterisk(fields.stopMinutes) + " " +
            valueOrAsterisk(fields.stopHours) + " " +
            valueOrAsterisk(fields.stopDoM) + " " +
            valueOrAsterisk(fields.stopMonths) + " " +
            valueOrAsterisk(fields.stopDoW)

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

app.post('/addSchedule', (req, res) => {

    const allowedChars = "123456789abcdefghijklmnopqrstuvwxyz" +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ_-."

    const form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '/uploads')

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
            fs.unlink(files.file.path)
        }

        const startTime = valueOrAsterisk(fields.startSeconds) + " " +
            valueOrAsterisk(fields.startMinutes) + " " +
            valueOrAsterisk(fields.startHours) + " " +
            valueOrAsterisk(fields.startDoM) + " " +
            valueOrAsterisk(fields.startMonths) + " " +
            valueOrAsterisk(fields.startDoW)

        const stopTime = valueOrAsterisk(fields.stopSeconds) + " " +
            valueOrAsterisk(fields.stopMinutes) + " " +
            valueOrAsterisk(fields.stopHours) + " " +
            valueOrAsterisk(fields.stopDoM) + " " +
            valueOrAsterisk(fields.stopMonths) + " " +
            valueOrAsterisk(fields.stopDoW)

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

app.listen(80, function () {
    console.log("Server started")
})

function handleFileUpload(file, name) {
    const filename = name + "." + file.name.split('.').slice(-1)[0]
    const filepath = path.join(__dirname, '/uploads', filename)
    fs.rename(file.path, filepath)
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
}