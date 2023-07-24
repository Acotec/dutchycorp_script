(function(){
    'use strict';
    function waitForKeyElements(t, o, e, i, n) {
        void 0 === e && (e = !0), void 0 === i && (i = 300), void 0 === n && (n = -1);
        var r = "function" == typeof t ? t() : document.querySelectorAll(t),
            u = r && 0 < r.length;
        u && r.forEach(function(t) {
            var e = "data-userscript-alreadyFound";
            t.getAttribute(e) || !1 || (o(t) ? u = !1 : t.setAttribute(e, !0))
        }), 0 === n || u && e || (--n, setTimeout(function() {
            waitForKeyElements(t, o, e, i, n)
        }, i))
    }
    let coin_code = 'USDT'
    var i=0
    var limit=10
    // waitForKeyElements("#toast-container > div", (element) => {
    //     let addButton = document.createElement("p")
    //     let WithButton=document.getElementById('withdraw-btn2-'+coin_code)
    //     addButton.setAttribute('class', 'title')
    //     addButton.innerText =element.innerText
    //     WithButton.parentNode.insertBefore(addButton, WithButton.nextSibling);
    // },false);
    waitForKeyElements("#toast-container > div", (element) => {
        let addpar=document.querySelector(".addedtoast")
        let WithButton=document.getElementById('withdraw-btn2-'+coin_code)
        if(addpar){
            console.log('replace addedtoast')
        }else{
            addpar = document.createElement("p");
            addpar.setAttribute('class', 'addedtoast');
        }
        addpar.innerText = element.innerText.trim()
        WithButton.parentNode.insertBefore(addpar, WithButton.nextSibling);
    }, false)
    var check = setInterval(()=>{
        i++
        var element
        console.log("waiting for",coin_code,"withdraw button to be available within",limit-i,"seconds")
        try{
            element =document.querySelector('#status_text_'+coin_code)
            if(element){
                element.scrollIntoView();
                //element.click()
            }
        }catch(e){element=null}
        if(i>=limit){
            console.log("waiting for",coin_code,"withdraw button Timeout")
            clearInterval(check)
        }
    },1000)
    })();
