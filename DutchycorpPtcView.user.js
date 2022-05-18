(function() {
    'use strict'
    var i = 0
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
        }
        if (/All Available Ads Watched/ig.test(document.querySelector("body > div.column.middle > div.row > div.col.s12.m12.l10 > center:nth-child(1) > h4").textContent)) {
            clearInterval(progress)
        }
        if (i > 70) {
            clearInterval(progress);
            window.location.reload()
        }
    }, 1000)

    //document.querySelector("div.progress").getAttribute('style')
    //waitForKeyElements('#ptc-submit-btn',(e)=>{e.click()})
    //document.querySelector("#ptc-submit-btn").click()

})();
