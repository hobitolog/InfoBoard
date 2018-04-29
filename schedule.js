var fs = require('fs')

//defaults:
var schedule = {
    elements: []
}

function getNameList()
{
    var list = []
    schedule.elements.forEach((element, index) => {
        list.push({
            "name": element.name,
            "time": element.start + " | " + element.stop,
            "type": element.type
        })
    })
    return list
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
    getNameList: getNameList,
    load: load,
    save: save
}