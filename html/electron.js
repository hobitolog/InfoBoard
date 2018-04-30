function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML =
        h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };
    return i;
}

function abc() {
    alert("TEST")
}

function hideContent() {
    document.getElementById('image').style.visibility = "hidden";
    document.getElementById('playerYT').style.visibility = "hidden";
    document.getElementById('videoPlayer').style.visibility = "hidden";
}

function showContent(type, path) {
    switch (type) {
        case "img":
            document.getElementById('image').style.visibility = "visible";
            document.getElementById('image').src = path;
            //document.getElementById('image').src ="../uploads/img1.jpg";
            break;
        case "yt":
            document.getElementById('playerYT').style.visibility = "visible";
            document.getElementById('playerYT').src = "https://www.youtube.com/embed/x2y2V8LpbHk?autoplay=1";
            document.getElementById('playerYT').src = "https://www.youtube.com/embed/" + path + "?autohide=1&autoplay=1";

            //todo
            break;
        case "video":
            document.getElementById('videoPlayer').style.visibility = "visible";
            document.getElementById('videoPlayer').src = path;
            //todo
            break;

    }

}
function showBar(message, color) {
    var bar = document.createElement("marquee")
    bar.setAttribute("bgcolor", color)
    bar.setAttribute("id", "messageBar")
    bar.setAttribute("width", "100%")
    bar.innerText = message
    document.getElementById("addons").appendChild(bar)
}
function showTime() {
    if (document.getElementById("time")) {
        document.getElementById("time").remove();
    }
    var time = document.createElement("span")
    time.setAttribute('id', 'time')
    document.getElementById("addons").appendChild(time)


    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
    var t = setTimeout(showTime, 500);
}