var path = require('path')

var schedule = require('./schedule')
schedule.load()

var bodyParser = require('body-parser')
var express = require('express')
var morgan = require('morgan')
var app = express()

app.use(express.static(path.join(__dirname + '/public')))
app.use(morgan('dev'))
app.use(bodyParser())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/html", "index.html"))
})

app.get('/schedule', (req, res) => {
     res.json(schedule.getNameList())
})

app.post('/addSchedule', (req, res) => {

    schedule.addToSchedule({
        "name": req.body.name,
        "start": req.body.start,
        "stop": req.body.stop,
        "uri": req.body.uri,
        "priority": req.body.priority
    })

    res.redirect('/')
})

app.listen(80, function () {
    console.log("Server started")
})