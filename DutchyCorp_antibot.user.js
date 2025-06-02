(function() {
    var solveantibot=true//

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
        var antibot= setInterval(isantibotvisible,2000)
        async function isantibotvisible(){
            try {
                // Find visible modal by checking multiple indices
                const modals = document.getElementsByClassName("modal open");
                const modal = [0, 1, 2].reduce((found, index) => {
                    if (found) return found;
                    return modals[index]?.style?.display === "block" ? modals[index] : null;
                }, null);

                if (!modal) return;

                const modalId = modal.id;
                if (!modalId) return;

                // Get all icon buttons
                const icons = Array.from(
                    document.querySelector("#" + modalId)
                    .getElementsByClassName("gradient-btn btn btn-secondary")
                );

                // Get the text we need to match
                const targetText = document
                .querySelector("#" + modalId)
                .innerText
                .replace(/[\W]/g, "")
                .replace(/.*Select|Gosend/ig, "")
                .trim();

                // Find and click matching icon
                for (const icon of icons) {
                    const input = icon.getElementsByTagName('input')[0];
                    const iconText = input.value.replace(/[\W]/g, "").trim();

                    if (targetText === iconText) {
                        // Click the icon
                        input.click();

                        // Click confirm button after a short delay
                        await setTimeout(() => {
                            const confirmBtn = document
                            .querySelector("#" + modalId)
                            .querySelector('button');
                            if (confirmBtn) confirmBtn.click();
                        }, 1000);

                        // Clean up modal
                        modal.style.display = "none";
                        const overlay = document.querySelector(".modal-overlay");
                        if (overlay) overlay.click();
                        break;
                    }
                }
            } catch (error) {
                console.error("Anti-bot handler error:", error);
            }
        }

    }
    else{
        let shortlinkBtn = document.querySelectorAll("a.gradient-btn.btn");
        let username = document.querySelector("ul li .user_avatar + b").innerText.trim()
        function checkLinks() {
            Array.from(shortlinkBtn).forEach((btn, i) => {
                try{
                    //btn.addEventListener("click", function(cancel){cancel.preventDefault()});
                    //btn.click()
                    const onclick = btn.getAttribute('onclick');
                    const match = onclick.match(/ad_display\('square',\s*(\d+)\)/);
                    if (match) {
                        const id = match[1];
                        btn.removeAttribute('onclick');
                        btn.removeAttribute('onmousedown');
                        btn.removeAttribute('href');
                        //btn.setAttribute('target', '_blank');
                        btn.setAttribute('href', `/extend_claim_count_wall_nu_link_per_click_version.php?username=${username}&id=${id}`);
                        btn.setAttribute('data-tooltip',"Visit Shortlink")
                        //btn.setAttribute('onmousedown',`$(this).attr('href', '/extend_claim_count_wall_nu_link_per_click_version.php?username=${username}&id=${id}`)
                        //btn.setAttribute('onclick',`$(this).attr('href', '/extend_claim_count_wall_nu_link_per_click_version.php?username=${username}&id=${id}`)
                        //btn.removeAttribute('onmousedown');
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
