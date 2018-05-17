var labels
var validated = {
    name: false,
    priority: false
}

window.onload = function () {

    var err = getQueryParameter("err")
    if (err) {
        var errorAlert = document.getElementById('errorAlert')
        errorAlert.innerText = decodeURIComponent(err)
        errorAlert.hidden = false
    }

    var eventName = getQueryParameter("name")
    document.getElementById("previous").value = eventName
    document.getElementById("deleteEvent").href = '/deleteEvent?name=' + eventName

    send('POST', '/getEvent', { "name": eventName }, function (response) {
        document.getElementById('name').value = eventName
        document.getElementById('priority').value = response.priority

        var startTimes = response.start.split(" ")
        document.getElementById('startHours').value = startTimes[2] == '*' ? "" : startTimes[2]
        document.getElementById('startMinutes').value = startTimes[1] == '*' ? "" : startTimes[1]
        document.getElementById('startSeconds').value = startTimes[0] == '*' ? "" : startTimes[0]
        document.getElementById('startDoM').value = startTimes[3] == '*' ? "" : startTimes[3]

        var startMs = startTimes[4].split(",")
        var startMonths = document.getElementById('startMonths').options
        for (var i = 0; i < startMonths.length; i++) {
            if (startMs.includes(startMonths[i].value))
                startMonths[i].selected = true
            else
                startMonths[i].selected = false
        }
        var startDs = startTimes[5].split(",")
        var startDays = document.getElementById('startDoW').options
        for (var i = 0; i < startDays.length; i++) {
            if (startDs.includes(startDays[i].value))
                startDays[i].selected = true
            else
                startDays[i].selected = false
        }

        var stopTimes = response.stop.split(" ")
        document.getElementById('stopHours').value = stopTimes[2] == '*' ? "" : stopTimes[2]
        document.getElementById('stopMinutes').value = stopTimes[1] == '*' ? "" : stopTimes[1]
        document.getElementById('stopSeconds').value = stopTimes[0] == '*' ? "" : stopTimes[0]
        document.getElementById('stopDoM').value = stopTimes[3] == '*' ? "" : stopTimes[3]

        var stopMs = stopTimes[4].split(",")
        var stopMonths = document.getElementById('stopMonths').options
        for (var i = 0; i < stopMonths.length; i++) {
            if (stopMs.includes(stopMonths[i].value))
                stopMonths[i].selected = true
            else
                stopMonths[i].selected = false
        }
        var stopDs = stopTimes[5].split(",")
        var stopDays = document.getElementById('stopDoW').options
        for (var i = 0; i < stopDays.length; i++) {
            if (stopDs.includes(stopDays[i].value))
                stopDays[i].selected = true
            else
                stopDays[i].selected = false
        }

        switch (response.type) {
            case "remote":
                document.getElementById('remote').click()
                document.getElementById('inputURL').value = response.uri
                break
            case "youtube":
                document.getElementById('youtube').click()
                document.getElementById('inputURL').value = response.uri
                break
            case "video":
                document.getElementById('video').click()
                document.getElementById('inputFile').placeholder = "Replace with new file"
                break
            case "image":
                document.getElementById('image').click()
                document.getElementById('inputFile').placeholder = "Replace with new file"
                break
            case "bar":
                document.getElementById('bar').click()
                document.getElementById('inputMessage').value = response.message
                document.getElementById('color').value = response.color
                document.getElementById('bcolor').value = response.bcolor
                break
            case "clock":
                document.getElementById('clock').click()
                break
        }
        validateName()
        validatePriority()
    })

    labels = document.getElementById('radios').getElementsByTagName('label')
    for (var i = 0; i < labels.length; i++) {
        labels[i].addEventListener("click", onContentChanged)
    }

    document.getElementById('name').addEventListener('keyup', validateName)
    document.getElementById('priority').addEventListener('keyup', validatePriority)
    validateName()
    validatePriority()
    console.log("Init completed")
}

function validateName() {
    var allowedChars = "123456789abcdefghijklmnopqrstuvwxyz" +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ_-."
    var name = document.getElementById('name')
    var nameError = document.getElementById('nameError')

    if (!name.value) {
        nameError.hidden = false
        nameError.innerText = "Nazwa nie może być pusta"
        validated.name = false
        validate()
        return
    }

    for (var i = 0; i < name.value.length; i++) {
        var char = name.value.charAt(i)
        if (!allowedChars.includes(char)) {
            nameError.hidden = false
            nameError.innerText = "Nazwa zawiera niedozwolony znak: '" + char + "'"
            validated.name = false
            validate()
            return
        }
    }
    nameError.hidden = true
    validated.name = true
    validate()
}

function validatePriority() {
    var priority = document.getElementById('priority')
    var priorityError = document.getElementById('priorityError')
    if (!priority.value || isNaN(priority.value)) {
        priorityError.hidden = false
        validated.priority = false
        validate()
    }
    else {
        priorityError.hidden = true
        validated.priority = true
        validate()
    }
}

function validate() {
    if (validated.name && validated.priority)
        document.getElementById('submit').disabled = false
    else
        document.getElementById('submit').disabled = true
}

function onContentChanged() {

    if (this.active) return

    for (var i = 0; i < labels.length; i++) {
        labels[i].classList.remove("active")
        labels[i].getElementsByTagName('input').checked = false
    }
    this.classList.add("active")
    this.getElementsByTagName('input').checked = true

    var inputs = document.getElementById('inputs').children
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].hidden = true
    }

    switch (this.id) {
        case "remote":
        case "youtube":
            document.getElementById('divURL').hidden = false
            break
        case "video":
        case "image":
            document.getElementById('divFile').hidden = false
            break
        case "bar":
            document.getElementById('divMessage').hidden = false
            break
    }
}

function send(method, path, data, callback) {
    var req = new XMLHttpRequest()
    req.open(method, path, true)
    req.responseType = 'json'
    req.setRequestHeader("Content-Type", "application/json")
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            callback(req.response)
        }
    }
    req.send(JSON.stringify(data))
}

function getQueryParameter(name) {
    var query = window.location.search.substring(1)
    var vars = query.split("&")
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=")
        if (pair[0] == name) return pair[1]
    }
    return false
}