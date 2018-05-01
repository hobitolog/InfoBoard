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

function hideContent() {
if(    document.getElementById('image')){
    document.getElementById('image').remove();
}
if(    document.getElementById('playerYT')){
    document.getElementById('playerYT').remove();
}
if(    document.getElementById('videoPlayer')){
    document.getElementById('videoPlayer').remove();
}




}

function showContent(type, path) {

    switch (type) {
        case "img":
            var img = document.createElement('img');
            img.setAttribute("id", "image");
            img.setAttribute("width", "100%");
            img.style.visibility = "visible";
            img.style.position = "absolute";
            img.setAttribute("src", path);
            document.getElementById("content").appendChild(img)
            break;
        case "yt":
            var iframe = document.createElement('iframe');
            iframe.setAttribute("id", "playerYT");
            iframe.setAttribute("type", "text/html")
            iframe.setAttribute("frameborder", "0")
            iframe.setAttribute("width", "100%");
            iframe.style.visibility = "visible";
            iframe.style.position = "absolute";
            iframe.setAttribute("src", "https://www.youtube.com/embed/" + path + "?autohide=1&autoplay=1");
            document.getElementById("content").appendChild(iframe)
            break;
        case "video":
            var video = document.createElement('video');
            video.setAttribute("id", "videoPlayer");
            video.setAttribute("type", "video/mp4")
            video.autoplay = true
            video.setAttribute("width", "100%");
            video.style.visibility = "visible";
            video.style.position = "absolute";
            video.setAttribute("src", path);
            document.getElementById("content").appendChild(video)
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