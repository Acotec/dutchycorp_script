(function() {
    'use strict'
    let progress = setInterval(()=>{
        console.log('waiting')
        let i=0
        let style = document.querySelector("div.progress").getAttribute('style')
        if(/display: none/ig.test(style)){
            clearInterval(progress)
            document.querySelector("#ptc-submit-btn").click()
        }
        if(i>61){
            clearInterval(progress)
        }
    },1000)
    //document.querySelector("div.progress").getAttribute('style')
    //waitForKeyElements('#ptc-submit-btn',(e)=>{e.click()})
    //document.querySelector("#ptc-submit-btn").click()
})();
