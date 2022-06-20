'use strict'
// var i=0
// var watched;
// var progress = setInterval(()=>{
//     i++;
//     console.log('waiting',i)
//     var style;
//     try{style = document.querySelector("div.progress").getAttribute('style')}catch(e){style=null}
//     if(/display: none/ig.test(style)){
//         clearInterval(progress)
//         try{document.querySelector("#ptc-submit-btn").click()}catch(e){document.getElementsByTagName('button')[0].click()}
//     };
//     try{watched = document.querySelector("body div.column div.col center:nth-child(1) h4")}catch(e){};
//     if(watched&&/.*All.+Ads.+Watched.*/ig.test(watched.textContent)){clearInterval(progress)};
//     if(i>70){clearInterval(progress);window.location.reload()};
// },1000)

let count = 0
let view = setInterval(() => {
    var watched
    try {
        watched = document.querySelector("body div.column div.col center:nth-child(1) h4")
    } catch (e) {}
    if (watched && /.*All.+Ads.+Watched.*/ig.test(watched.textContent)) {
        clearInterval(view)
    } else {
        count++
        let value = $('.g-recaptcha')[0].name.replace(/.*btn-/ig, '');
        $('#submit_captcha').show();
        $('#submit-btn')[0].innerHTML = `<input required type="hidden" name="hash" value="${value}" />'`;
        $('.progress').hide();
        $('#sec').hide();
        $('.g-recaptcha').click()
        if ($('#rc-imageselect') || $('.rc-audiochallenge-tabloop-begin')) {
            clearInterval(view)
        } else if (count >= 10) {
            clearInterval(view)
            window.location.reload(true)
        }
        //clearInterval(view)
    }
}, 1000)
