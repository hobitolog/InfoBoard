window.onload = function () {

    updateList()

    var err = getQueryParameter("err")
    if (err) {
        var errorAlert = document.getElementById('errorAlert')
        errorAlert.innerText = response.error
        errorAlert.hidden = false
    }

    console.log("Init completed")
}

function createListElement(name) {
    var li = document.createElement('li')
    li.classList.add('list-group-item')
    li.innerText = name

    return li
}

function updateList() {
    var loading = document.getElementById('loading')

    loading.innerText = "Loading..."

    send('GET', '/schedule', null, function (response) {
        console.log("got current schedule", response)

        var ul = document.getElementById('eventList')
        ul.innerHTML = ''

        if (response.length == 0) {
            loading.innerText = "Schedule is empty"
            return
        }

        for (var i = 0; i < response.length; i++) {
            var li = createListElement(response[i])
            ul.appendChild(li)
        }
        loading.innerText = ""
    })
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
    req.send(data)
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