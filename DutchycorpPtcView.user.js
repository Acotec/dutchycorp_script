'use strict'
var i = 0
var watched;
var count = 0
var value;

function skip_waiting_time() {
    $(".g-recaptcha") && (value = $(".g-recaptcha")[0].name.replace(/.*btn-/ig, ""));
    $("#submit_captcha") && $("#submit_captcha").show();
    $("#submit-btn") && ($("#submit-btn")[0].innerHTML = `<input required type="hidden" name="hash" value="${value}" />`);
    $('.progress') && $('.progress').hide();
    $('#sec') && $('#sec').hide();
    $('.g-recaptcha') && $('.g-recaptcha').click()
}

function manual() {
    var progress = setInterval(() => {
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
            watched = document.querySelector("body div.column h4")
        } catch (e) {};
        if (watched && /.*All.+Ads.*/ig.test(watched.textContent)) {
            clearInterval(progress)
        };
        if (i > 70) {
            clearInterval(progress);
            window.location.reload()
        };
    }, 1000)
}

function autotimer(seconds = 3) {
    let view = setInterval(() => {
        try {
            watched = document.querySelector("body div.column h4")
        } catch (e) {}
        if (watched && /.*All.+Ads.*/ig.test(watched.textContent)) {
            clearInterval(view);
            window.close()
        } else {
            count++
            if (count >= 10) {
                clearInterval(view);
                window.location.reload(true)
            } else {
                skip_waiting_time()
                $('.g-recaptcha') && $('.g-recaptcha').click()
                if ($('#rc-imageselect') || $('.rc-audiochallenge-tabloop-begin')) {
                    clearInterval(view);
                    //throw new Error("!! Stop JS")
                    //clearInterval(view)
                }
            }
        }
    }, seconds * 1000)
}

function auto(seconds = 2, timing = 10) {
    var title = document.title
    let timer = (x) => {
        if (x < 0) {
            clearInterval(timer);
            window.location.reload(true);
            //window.close()
        };
        document.title = x + '--' + title;
        try {
            watched = document.querySelector("body div.column h4")
        } catch (e) {}
        if (watched && /.*All.+Ads.*/ig.test(watched.textContent)) {
            clearInterval(timer);
            window.close()
        } else {
            skip_waiting_time()
            if ($('#rc-imageselect') || $('.rc-audiochallenge-tabloop-begin')) {
                console.log('recaptcha need to be solve');
                clearInterval(timer);
                throw new Error("!!Stop JS")
            }
            //else if (count >= 10) {clearInterval(timer);window.location.reload(true)}
            //clearInterval(timer)
        }
        return setTimeout(() => {
            timer(--x)
        }, seconds * 1000)
    }
    timer(timing)
}

//manual()
autotimer(3)
//auto(3, 10)
