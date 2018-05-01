var fs = require('fs')

//defaults:
var schedule = {
    elements: []
}

function update(name, event) {
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

module.exports = {
    addToSchedule: add,
    getNameList: getNameList,
    getEventByName: get,
    updateEvent: update,
    removeEvent: remove,
    load: load,
    save: save
}