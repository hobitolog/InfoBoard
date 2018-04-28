window.onload = function () {

    updateList()

    var errorAlert = document.getElementById('errorAlert')

    document.getElementById('addButton').addEventListener("click", function () {
        var addForm = document.getElementById('addForm')
        var data = JSON.stringify(getFormData(addForm))
        send('POST', '/addSchedule', data, function (response) {
            if (response.error) {
                errorAlert.innerText = response.error
                errorAlert.hidden = false
            }
            else {
                updateList()
            }
        })
    })

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

function getFormData(form) {
    var inputs = form.getElementsByTagName('input')

    var formData = {}
    for (var i = 0; i < inputs.length; i++) {
        formData[inputs[i].name] = inputs[i].value
    }
    return formData
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