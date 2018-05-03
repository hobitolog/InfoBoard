var fs = require('fs')
var CronJob = require('cron').CronJob;

let el

//defaults:
var schedule = {
    elements: []
}

var startCronJobs = {
    job: []
}

var stopCronJobs = {
    job: []
}

var actualJob = {
    'bar': {
        'name': '',
        'priority': 0
    },
    'main': {
        'name': '',
        'priority': 0
    }
}

function update(name, event) {
    //TODO update cronJob
    removeWithoutFile(name)
    add(event)
}

function removeWithoutFile(name) {
    const index = schedule.elements.findIndex(element => {
        return element.name == name
    })
    schedule.elements.splice(index, 1)
}

function removeWithFile(name) {
    const index = schedule.elements.findIndex(element => {
        return element.name == name
    })
    const event = schedule.elements[index]
    if (event.type == "video" || event.type == "image") {
        fs.unlink(event.uri)
    }
    schedule.elements.splice(index, 1)
}

function remove(name) {
    removeWithFile(name)
    stopCronJob(name)
}

function get(name) {
    return schedule.elements.find(element => {
        return element.name == name
    })
}

function getNameList() {
    const list = []
    schedule.elements.forEach((element, index) => {
        list.push({
            "name": element.name,
            "time": element.start + " | " + element.stop,
            "type": element.type
        })
    })
    return list
}

function add(event) {
    schedule.elements.push(event)
    createCronJob(event)
    save()
}

function save() {
    const json = JSON.stringify(schedule)
    fs.writeFileSync('schedule.json', json, { encoding: 'utf8' })
}

function load() {
    if (!fs.existsSync('schedule.json')) {
        save()
    }
    const contents = fs.readFileSync('schedule.json', 'utf8')
    Object.assign(schedule, JSON.parse(contents))
}

function setElectronCallbacks(callbacks) {
    el = callbacks
}

function showBasicImage() {
    el.showImage('../uploads/Basic.jpg')
    actualJob.name = 'Basic'
    actualJob.priority = 0
}

function createCronJob(element) {
    var tempStart
    var tempStop
    switch(element.type) {
        case "remote":
            tempStart = function () {
                if(actualJob.main.priority < element.priority)
                    el.showWebsite(element.uri)
            }
            break
        case "youtube":
            tempStart = function () {
                if(actualJob.main.priority < element.priority)
                    el.showYoutube(element.uri)
            }
            break
        case "video":
            tempStart = function () {
                if(actualJob.main.priority < element.priority)
                    el.showVideo(element.uri)
            }
            break
        case "image":
            tempStart = function () {
                if(actualJob.main.priority < element.priority)
                    el.showImage(element.uri)
            }
            break
        case "bar":
            tempStart = function () {
                if(actualJob.bar.priority < element.priority)
                    el.showMessageBar(element.message, element.bcolor, element.color)
            }
            break
    }

    if(element.type == 'bar') {
        tempStop = function () {
            if(actualJob.bar.name == element.name)
                el.hideMessageBar()
        }
    } else {
        tempStop = function() {
            if(actualJob.main.name == element.name)
                showBasicImage()
        }
    }

    var startJob = new CronJob(element.start, tempStart, undefined, true, 'Europe/Warsaw')
    startJob.name = element.name
    startCronJobs.job.push(startJob)
    
    var stopJob = new CronJob(element.stop, tempStop, undefined, true, 'Europe/Warsaw')
    stopJob.name = element.name
    stopCronJobs.job.push(stopJob)
}

function stopCronJob(name) {
    startCronJobs.forEach((element, index) => {
        if(element.name == name)
            element.stop()
    })
    stopCronJobs.forEach((element, index) => {
        if(element.name == name)
            element.stop()
    })
}

setTimeout(function () {
    el.showClock()
    showBasicImage()

    for (let i = 0; i < schedule.elements.length; i++) {
        createCronJob(schedule.elements[i])
    }
}, 5000)

module.exports = {
    addToSchedule: add,
    getNameList: getNameList,
    getEventByName: get,
    updateEvent: update,
    removeEvent: remove,
    load: load,
    save: save,
    setElectronCallbacks : setElectronCallbacks
}
