(function() {
    'use strict'
    var i=0
    let progress = setInterval(()=>{
        i++;
        console.log('waiting',i)
        var style;
        try{style = document.querySelector("div.progress").getAttribute('style')}catch(e){style=null}
        if(/display: none/ig.test(style)){
            clearInterval(progress)
            try{document.querySelector("#ptc-submit-btn").click()}catch(e){document.getElementsByTagName('button')[0].click()}
        }
        if(i>=61){clearInterval(progress)}

    },1000)
    //document.querySelector("div.progress").getAttribute('style')
    //waitForKeyElements('#ptc-submit-btn',(e)=>{e.click()})
    //document.querySelector("#ptc-submit-btn").click()
    })();
