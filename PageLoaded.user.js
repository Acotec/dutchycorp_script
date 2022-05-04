function tempAlert(msg, duration) {
    var el = document.createElement("div");
    el.setAttribute("style", "position:absolute;top:100%;left:20%;background-color:white;");
    el.innerHTML = msg;
    setTimeout(function() {
        el.parentNode.removeChild(el);
    }, duration);
    document.body.appendChild(el);
}
function show() {
    document.title = document.title + " (Page Loaded)";
    tempAlert('Page Loaded', 5000)
}
window.addEventListener('load', show, false);
