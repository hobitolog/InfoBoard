const fs = require('fs')
const CronJob = require('cron').CronJob;
const webpageUtil = require('./webpage.util')
const path = require('path')

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

var mainView = {
    viewName: '',
    priority: 0,
    view: []
}

var messageBar = {
    barName: '',
    priority: 0,
    bar: []
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
        fs.unlink(event.uri, (err) => { })
    }
    else if (event.type == "remote") {
        webpageUtil.removeEventData(event)
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

    if(event.type == "remote")
        webpageUtil.backupWebsite(event)

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

function getHighestPriorityIndex(eventsTable) {
    var highestPriorityIndex = -1
    var highestPriority = -1
    eventsTable.forEach((element, index) => {
        if (element.priority > highestPriority) {
            highestPriority = element.priority
            highestPriorityIndex = index
        }
    })
    return highestPriorityIndex
}

function setBasicView() {
    el.showImage('../uploads/Basic.jpg')
    mainView.name = 'Basic'
    mainView.priority = 0
}

function setView(event) {
    switch (event.type) {
        case "remote":
            showRemote(event)
            break
        case "youtube":
            el.showYoutube(event.uri)
            break
        case "video":
            el.showVideo(event.uri)
            break
        case "image":
            el.showImage(event.uri)
            break
    }
    mainView.name = event.name
    mainView.priority = event.priority
}

function showRemote(event) {
    webpageUtil.getWebsitePath(event, function(fpath) {
        const filepath = path.join('../', fpath)
        el.showWebsite(filepath)
    })
}

function setBar(event) {
    el.hideMessageBar()
    el.showMessageBar(event.message, event.bcolor, event.color)
    messageBar.name = event.name
    messageBar.priority = event.priority
}

function createCronJob(event) {
    var tempStart
    var tempStop

    if (event.type == 'bar') {
        tempStart = function () {
            if (parseInt(messageBar.priority) < parseInt(event.priority)) {
                setBar(event)
                messageBar.priority = event.priority
                messageBar.name = event.name
            }
            if (!messageBar.bar.includes(event))
                messageBar.bar.push(event)
        }
        tempStop = function () {
            var index = messageBar.bar.findIndex(bar => {
                return bar.name == event.name
            })
            if (index != -1)
                messageBar.bar.splice(index, 1)
            index = getHighestPriorityIndex(messageBar.bar)
            if (index < 0) {
                el.hideMessageBar()
                messageBar.priority = 0
                messageBar.name = ''
            } else if (messageBar.bar[index].name != messageBar.name) {
                setBar(messageBar.bar[index])
            }
        }
    } else {
        tempStart = function () {
            if (parseInt(mainView.priority) < parseInt(event.priority)) {
                setView(event)
                mainView.priority = event.priority
                mainView.name = event.name
            }
            if (!mainView.view.includes(event))
                mainView.view.push(event)
        }
        tempStop = function () {
            var index = mainView.view.findIndex(view => {
                return view.name == event.name
            })
            if (index != -1)
                mainView.view.splice(index, 1)
            index = getHighestPriorityIndex(mainView.view)
            if (index < 0) {
                setBasicView()
            } else if (mainView.view[index].name != event.name) {
                setView(mainView.view[index])
            }
        }
    }

    var startJob = new CronJob(event.start == '* * * * * *' ? '0 * * * * *' : event.start, tempStart, tempStop, true, 'Europe/Warsaw')
    startJob.event = event
    startCronJobs.job.push(startJob)

    if (event.start != '* * * * * *' && event.stop != '* * * * * *') {
        var stopJob = new CronJob(event.stop, tempStop, undefined, true, 'Europe/Warsaw')
        stopJob.event = event
        stopCronJobs.job.push(stopJob)
    }
}

function stopCronJob(name) {
    var startIndex = startCronJobs.job.findIndex(element => {
        return element.event.name == name
    })
    var stopIndex = stopCronJobs.job.findIndex(element => {
        return element.event.name == name
    })

    if (startIndex != -1) {
        startCronJobs.job[startIndex].stop()
        startCronJobs.job.splice(startIndex, 1)
    }
    if (stopIndex != -1) {
        stopCronJobs.job[stopIndex].stop()
        stopCronJobs.job.splice(stopIndex, 1)
    }
}

function editCronJob(name, event) {
    var startIndex = startCronJobs.job.indexOf(name)
    var stopIndex = stopCronJobs.job.indexOf(name)
    var modified = false
    if (startIndex != -1) {
        if (startCronJobs.job[startIndex].event != event)
            modified = true
    }

    if (stopIndex != -1) {
        if (stopCronJobs.job[stopIndex].event != event)
            modified = true
    }

    if (modified) {
        stopCronJob(name)
        createCronJob(event)
    }
}

//TODO przerobić to ready-to-show
setTimeout(function () {
    el.showClock()
    setBasicView()

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
    setElectronCallbacks: setElectronCallbacks
}
