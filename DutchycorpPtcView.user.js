var i = 0,
    watched;
let progress = setInterval(() => {
    i++;
    console.log('waiting', i)
    var style;
    try {
        style = document.querySelector("div.progress").getAttribute('style')
    } catch (e) {
        style = null
    }
    if (/display: none/ig.test(style)) {
        clearInterval(progress)
        try {
            document.querySelector("#ptc-submit-btn").click()
        } catch (e) {
            document.getElementsByTagName('button')[0].click()
        }
    };
    try {
        watched = document.querySelector("body div.column div.col center:nth-child(1) h4")
    } catch (e) {}
    if (/All Available Ads Watched/ig.test(watched.textContent)) {
        clearInterval(progress)
    } else if (i > 70) {
        clearInterval(progress);
        window.location.reload()
    }
}, 1000)
