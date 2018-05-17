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