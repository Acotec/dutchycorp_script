(function() {
    var solveantibot=false//

    if(solveantibot){
        var antibotid;
        function waitForKeyElements(t, o, e, i, n) {
            void 0 === e && (e = !0), void 0 === i && (i = 300), void 0 === n && (n = -1);
            var r = "function" == typeof t ? t() : document.querySelectorAll(t),
                u = r && 0 < r.length;
            u && r.forEach(function (t) {
                var e = "data-userscript-alreadyFound";
                t.getAttribute(e) || !1 || (o(t) ? u = !1 : t.setAttribute(e, !0))
            }), 0 === n || u && e || (--n, setTimeout(function () {
                waitForKeyElements(t, o, e, i, n)
            }, i))
        }
        var evt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: 20,
            /* whatever properties you want to give it */
        })
        function clickOnEle(el){
            var simulateMouseEvent = function(element, eventName, coordX, coordY) {
                element.dispatchEvent(new MouseEvent(eventName, {
                    //view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: coordX,
                    clientY: coordY,
                    button: 0
                }));
            };
            var theButton = el;
            var box = theButton.getBoundingClientRect(),
                coordX = box.left + (box.right - box.left) / 2,
                coordY = box.top + (box.bottom - box.top) / 2;
            simulateMouseEvent (theButton, "mousedown", coordX, coordY);
            simulateMouseEvent (theButton, "mouseup", coordX, coordY);
            simulateMouseEvent (theButton, "click", coordX, coordY);
        }
        //var antibot= setInterval(isantibotvisible,2000)
        function isantibotvisible(){
            try{
                let visible =document.getElementsByClassName("modal open")[0].style.display == "block"
                let antibotid=document.getElementsByClassName("modal open")[0].id
                console.log('waiting for antibotFrame')
                if(visible){
                    clearInterval(antibot)
                    //alert('anti')
                    setTimeout(()=>{
                        let icon=Array.from(document.querySelector("#"+antibotid).getElementsByClassName("gradient-btn btn btn-secondary"))
                        icon.forEach(img=>{
                            let select =document.querySelector("#"+antibotid).innerText.replace(/[\W]/g,"").replace(/.*Select|Gosend/ig,'').trim();
                            let icselect = img.getElementsByTagName('input')[0].value.replace(/[\W]/ig,"").trim();
                            console.log(icselect,select)
                            if(select == icselect){
                                console.log("Antibot to select is - ",select)
                                //waitForKeyElements(".waves-ripple", (element) =>{alert("OPEN")});
                                console.log(img.getElementsByTagName('input')[0],"clicked");
                                setTimeout(()=>{clickOnEle(img.getElementsByTagName('input')[0])},1000)
                                setTimeout(()=>{clickOnEle(document.querySelector("#"+antibotid).querySelector('button'))},1000)
                                setTimeout(()=>{window.location.reload()},2000)
                            }
                        })
                    },1000)
                };
            }catch(e){}
        }
    }
    else{
        let shortlinkBtn = document.querySelectorAll("a.gradient-btn.btn");
        let username = document.querySelector("ul li .user_avatar + b").innerText.trim()
        function checkLinks() {
            Array.from(shortlinkBtn).forEach((btn, i) => {
                try{
                    const onclick = btn.getAttribute('onclick');
                    const match = onclick.match(/ad_display\('square',\s*(\d+)\)/);
                    if (match) {
                        const id = match[1];
                        btn.setAttribute('target', '_blank');
                        btn.setAttribute('href', `/extend_claim_count_wall_nu_link_per_click_version.php?username=${username}&id=${id}`);
                        btn.removeAttribute('onclick');
                        btn.removeAttribute('onmousedown');
                        //console.log(btn);
                    }
                }catch(err){
                    console.error(err)
                    console.info(err)
                }
            });
        }
        checkLinks();
    }

})();
