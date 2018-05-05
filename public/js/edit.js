var labels

window.onload = function () {

    var err = getQueryParameter("err")
    if (err) {
        var errorAlert = document.getElementById('errorAlert')
        errorAlert.innerText = decodeURIComponent(err)
        errorAlert.hidden = false
    }

    var name = getQueryParameter("name")
    document.getElementById("previous").value = name
    document.getElementById("deleteEvent").href = '/deleteEvent?name=' + name

    send('POST', '/getEvent', { "name": name }, function (response) {
        document.getElementById('name').value = name
        document.getElementById('priority').value = response.priority

        var startTimes = response.start.split(" ")
        document.getElementById('startHours').value = startTimes[0] == '*' ? "" : startTimes[0]
        document.getElementById('startMinutes').value = startTimes[1] == '*' ? "" : startTimes[1]
        document.getElementById('startSeconds').value = startTimes[2] == '*' ? "" : startTimes[2]
        document.getElementById('startDoM').value = startTimes[3] == '*' ? "" : startTimes[3]
        document.getElementById('startMonths').value = startTimes[4] == '*' ? "" : startTimes[4]
        document.getElementById('startDoW').value = startTimes[5] == '*' ? "" : startTimes[5]

        var stopTimes = response.stop.split(" ")
        document.getElementById('stopHours').value = stopTimes[0] == '*' ? "" : stopTimes[0]
        document.getElementById('stopMinutes').value = stopTimes[1] == '*' ? "" : stopTimes[1]
        document.getElementById('stopSeconds').value = stopTimes[2] == '*' ? "" : stopTimes[2]
        document.getElementById('stopDoM').value = stopTimes[3] == '*' ? "" : stopTimes[3]
        document.getElementById('stopMonths').value = stopTimes[4] == '*' ? "" : stopTimes[4]
        document.getElementById('stopDoW').value = stopTimes[5] == '*' ? "" : stopTimes[5]

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
    })

    labels = document.getElementById('radios').getElementsByTagName('label')
    for (var i = 0; i < labels.length; i++) {
        labels[i].addEventListener("click", onContentChanged)
    }

    console.log("Init completed")
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