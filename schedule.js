var fs = require('fs')

//defaults:
var schedule = {
    elements: []
}

function add(event)
{
    schedule.elements.push(event)
    save()
}

function save() {
    var toSave = Object.assign({}, schedule)

    var json = JSON.stringify(schedule)
    fs.writeFileSync('schedule.json', json, { encoding: 'utf8' })
}

function load() {
    if (!fs.existsSync('schedule.json')) {
        save()
    }
    var contents = fs.readFileSync('schedule.json', 'utf8')
    Object.assign(schedule, JSON.parse(contents))
}

module.exports = {
    addToSchedule: add,
    load: load,
    save: save
}