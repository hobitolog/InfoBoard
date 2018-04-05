window.onload = function () {

    updateList()

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

    var req = new XMLHttpRequest()
    req.open('GET', '/schedule', true)
    req.responseType = 'json'
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.response)

            var ul = document.getElementById('eventList')
            ul.innerHTML = ''

            if (req.response.length == 0) {
                loading.innerText = "Schedule is empty"
                return
            }

            for (var i = 0; i < req.response.length; i++) {
                var li = createListElement(req.response[i])
                ul.appendChild(li)
            }
            loading.innerText = ""
        }
    }
    req.send()
}