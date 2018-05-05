var labels

window.onload = function () {

    var err = getQueryParameter("err")
    if (err) {
        var errorAlert = document.getElementById('errorAlert')
        errorAlert.innerText = decodeURIComponent(err)
        errorAlert.hidden = false
    }

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
            document.getElementById('inputURL').hidden = false
            break
        case "video":
        case "image":
            document.getElementById('inputFile').hidden = false
            break
        case "bar":
            document.getElementById('inputMessage').hidden = false
            break
    }
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