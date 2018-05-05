window.onload = function () {

    updateList()
    document.getElementById('CurrentScreen').src = "/currentScreen"
    console.log("Init completed")
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

function createListElement(element) {
    var li = document.createElement('li')
    li.classList.add('list-group-item', 'event-element', 'justify-content-between', 'align-items-center', 'd-flex', "list-group-item-action")
    li.innerText = element.name
    var time = document.createElement('span')
    time.innerText = element.time
    time.classList.add('d-none', 'd-lg-block', 'd-xl-block')
    li.appendChild(time)
    li.appendChild(createBadge(element.type))
    li.addEventListener('click', function () {
        window.location.href = '/editSchedule?name=' + element.name
    })
    return li
}

function createBadge(type) {
    var span = document.createElement('span')
    span.classList.add("badge", "badge-pill")
    switch (type) {
        case "remote":
            span.classList.add("badge-info")
            span.innerText = "Remote URL"
            break
        case "youtube":
            span.classList.add("badge-danger")
            span.innerText = "Youtube"
            break
        case "video":
            span.classList.add("badge-success")
            span.innerText = "Video"
            break
        case "image":
            span.classList.add("badge-success")
            span.innerText = "Image"
            break
        case "bar":
            span.classList.add("badge-primary")
            span.innerText = "Message Bar"
            break
        case "clock":
            span.classList.add("badge-primary")
            span.innerText = "Clock"
            break
    }
    return span
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