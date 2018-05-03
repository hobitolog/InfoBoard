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
    if (document.getElementById('image')) {
        document.getElementById('image').remove();
    }
    if (document.getElementById('playerYT')) {
        document.getElementById('playerYT').remove();
    }
    if (document.getElementById('videoPlayer')) {
        document.getElementById('videoPlayer').remove();
    }




}

function showContent(type, path) {

    switch (type) {
        case "img":
            var img = document.createElement('img');
            img.setAttribute("id", "image");
            img.style.width = "100%"
            img.style.visibility = "visible";
            img.style.paddingTop = "50px"
            img.style.top = "0px"
            img.style.left = "0px"
            img.style.position = "absolute";
            img.setAttribute("src", path);
            document.getElementById("content").appendChild(img)
            break;
        case "yt":
            var iframe = document.createElement('iframe');
            iframe.setAttribute("id", "playerYT");
            iframe.setAttribute("type", "text/html")
            iframe.setAttribute("frameborder", "0")
            iframe.style.width = "100%"
            iframe.style.height = "100%"
            iframe.style.visibility = "visible";
            iframe.style.paddingTop = "50px"
            iframe.style.top = "0px"
            iframe.style.left = "0px"
            iframe.style.position = "absolute";
            iframe.setAttribute("src", "https://www.youtube.com/embed/" + path + "?autohide=1&autoplay=1");
            document.getElementById("content").appendChild(iframe)
            break;
        case "video":
            var video = document.createElement('video');
            video.setAttribute("id", "videoPlayer");
            video.setAttribute("type", "video/mp4")
            video.autoplay = true
            video.style.width = "100%"
            video.style.top = "0px"
            video.style.left = "0px"
            video.style.visibility = "visible";
            video.style.position = "absolute";
            video.style.paddingTop = "50px"
            video.setAttribute("src", path);
            document.getElementById("content").appendChild(video)
            break;

    }

}
function showBar(message, bcolor, color) {
    var bar = document.createElement("marquee")
    bar.setAttribute("id", "messageBar")
    bar.style.lineHeight = "50px"
    bar.style.verticalAlign = "middle"
    bar.style.position = "absolute"
    bar.style.width = "100%"
    bar.style.top = "0px"
    bar.style.left = "0px"
    bar.style.borderRadius = "2px"
    bar.style.boxShadow = "0px 0px 8px" + bcolor
    bar.style.fontSize = "35px"
    bar.style.fontFamily = "Comic Sans MS, cursive, sans-serif"
    bar.style.background = bcolor
    bar.style.color = color
    bar.innerText = message
    document.getElementById("addons").appendChild(bar)
}
function showTime() {
    if (document.getElementById("time")) {
        document.getElementById("time").remove();
    }
    var time = document.createElement("span")
    time.setAttribute('id', 'time')
    time.style.position = "absolute"
    time.style.top = "50px"
    time.style.left = "0px"
    time.style.fontSize = "35px"
    time.style.fontFamily = "Comic Sans MS, cursive, sans-serif"
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