var labels

window.onload = function () {

    var err = getQueryParameter("err")
    if (err) {
        var errorAlert = document.getElementById('errorAlert')
        errorAlert.innerText = response.error
        errorAlert.hidden = false
    }

    var name = getQueryParameter("name")
    send('POST', '/getEvent', { "name": name }, function (response) {
        console.log(response)

        document.getElementById('name').value = name
        document.getElementById('priority').value = response.priority

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