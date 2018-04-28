const path = require('path')

const schedule = require('./schedule')
schedule.load()

const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static(path.join(__dirname, '/public')))
app.use(morgan('dev'))
app.use(bodyParser())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/html", "index.html"))
})

app.get('/schedule', (req, res) => {
    res.json(schedule.getNameList())
})

app.post('/addSchedule', (req, res) => {

    const startTime = valueOrAsterisk(req.body.startSeconds) + " " +
        valueOrAsterisk(req.body.startMinutes) + " " +
        valueOrAsterisk(req.body.startHours) + " " +
        valueOrAsterisk(req.body.startDoM) + " " +
        valueOrAsterisk(req.body.startMonths) + " " +
        valueOrAsterisk(req.body.startDoW)

    const stopTime = valueOrAsterisk(req.body.stopSeconds) + " " +
        valueOrAsterisk(req.body.stopMinutes) + " " +
        valueOrAsterisk(req.body.stopHours) + " " +
        valueOrAsterisk(req.body.stopDoM) + " " +
        valueOrAsterisk(req.body.stopMonths) + " " +
        valueOrAsterisk(req.body.stopDoW)

    schedule.addToSchedule({
        "name": req.body.name,
        "start": startTime,
        "stop": stopTime,
        "uri": req.body.uri,
        "priority": req.body.priority
    })

    res.redirect('/')
})

app.listen(80, function () {
    console.log("Server started")
})

function valueOrAsterisk(value) {
    if (value)
        return value
    else
        return "*"
}

let electronCallbacks

module.exports = function (callbacks) {
    electronCallbacks = callbacks
}