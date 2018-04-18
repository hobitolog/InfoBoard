var path = require('path')
var exec = require('child_process').exec

var dir = path.join(__dirname, "/electro.js")
exec('electron "' + dir + '"')

var ipc = require('node-ipc')
ipc.config.id = 'InfoBoardServer'
ipc.config.retry = 1500

ipc.serve(function () {
    ipc.server.on('message', function (data, socket) {
        console.log(data)
        ipc.server.emit(socket, 'message', 'https://github.com');
    })
})
ipc.server.start();

var schedule = require('./schedule')
schedule.load()

var bodyParser = require('body-parser')
var express = require('express')
var morgan = require('morgan')
var app = express()

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

    var startTime = valueOrAsterisk(req.body.startSeconds) + " " +
        valueOrAsterisk(req.body.startMinutes) + " " +
        valueOrAsterisk(req.body.startHours) + " " +
        valueOrAsterisk(req.body.startDoM) + " " +
        valueOrAsterisk(req.body.startMonths) + " " +
        valueOrAsterisk(req.body.startDoW)

    var stopTime = valueOrAsterisk(req.body.stopSeconds) + " " +
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