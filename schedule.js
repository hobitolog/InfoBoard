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
    removeWithoutFile(name)
    add(event)
    editCronJob(name, event)
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
    save()
    createCronJob(event)
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
                if(actualJob.main.priority < element.priority) {
                    el.showWebsite(element.uri)
                    actualJob.main.priority = element.priority
                    actualJob.main.name = element.name
                }
            }
            break
        case "youtube":
            tempStart = function () {
                if(actualJob.main.priority < element.priority) {
                    el.showYoutube(element.uri)
                    actualJob.main.priority = element.priority
                    actualJob.main.name = element.name
                }
            }
            break
        case "video":
            tempStart = function () {
                if(actualJob.main.priority < element.priority) {
                    el.showVideo(element.uri)
                    actualJob.main.priority = element.priority
                    actualJob.main.name = element.name
                }
            }
            break
        case "image":
            tempStart = function () {
                if(actualJob.main.priority < element.priority) {
                    el.showImage(element.uri)
                    actualJob.main.priority = element.priority
                    actualJob.main.name = element.name
                }
            }
            break
        case "bar":
            tempStart = function () {
                if(actualJob.bar.priority < element.priority) {
                    el.showMessageBar(element.message, element.bcolor, element.color)
                    actualJob.bar.priority = element.priority
                    actualJob.bar.name = element.name
                }
            }
            break
    }

    if(element.type == 'bar') {
        tempStop = function () {
            if(actualJob.bar.name == element.name) {
                el.hideMessageBar()
                actualJob.bar.priority = 0
                actualJob.bar.name = ""
            }
        }
    } else {
        tempStop = function() {
            if(actualJob.main.name == element.name) 
                showBasicImage()
        }
    }

    var startJob = new CronJob(element.start, tempStart, tempStop, true, 'Europe/Warsaw')
    startJob.name = element.name
    startJob.time = element.start
    startJob.uri = element.uri
    startCronJobs.job.push(startJob)
    
    var stopJob = new CronJob(element.stop, tempStop, tempStop, true, 'Europe/Warsaw')
    stopJob.name = element.name
    stopJob.time = element.stop
    stopJob.uri = element.uri
    stopCronJobs.job.push(stopJob)
}

function stopCronJob(name) {
    var startIndex = startCronJobs.job.findIndex(element => {
        return element.name == name
    })
    var stopIndex = stopCronJobs.job.findIndex(element => {
        return element.name == name
    })

    startCronJobs.job[startIndex].stop()
    stopCronJobs.job[stopIndex].stop()

    startCronJobs.job.splice(startIndex, 1)
    stopCronJobs.job.splice(stopIndex, 1)
}

function editCronJob(name, event) {
    startIndex = startCronJobs.job.indexOf(name)
    stopIndex = stopCronJobs.job.indexOf(name)
    if(startIndex == -1 || stopIndex == -1)
        return

    if(startCronJobs.job[startIndex].time != event.start 
        || stopCronJobs.job[stopIndex].time != event.stop
        || startCronJobs.job[startIndex].uri != event.uri) {
            startCronJobs.job[startIndex].stop()
            startCronJobs.job.splice(startIndex, 1)
            stopCronJobs.job[startIndex].stop()
            stopCronJobs.job[stopIndex].splice(stopIndex, 1)
    } else if(name != event.name) {
        startCronJobs.job[startIndex].name = event.name
        stopCronJobs.job[stopIndex].name = event.name
    }
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
