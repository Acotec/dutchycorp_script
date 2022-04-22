var element;
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
waitForKeyElements('[class*="toast green darken-4"]', (element) => {
    window.close()
});
try {
    element = document.querySelector('[class*="toast green darken-4"]')
} catch (e) {
    element = null
}
if (element) {
    window.close()
} else {
    var button = document.createElement("button"),
        _ptc_ToVisit = Array.from(document.getElementsByClassName("btn-small waves-effect")),
        _ptc_ToClaim = _ptc_ToVisit.filter((e) => {
            if (e.name) {
                return e
            }
        }),
        rewards = Array.from(document.querySelectorAll("b:nth-child(5)")),
        sum = 0,
        body = document.querySelector("center:nth-child(7) > p");
    rewards.forEach((reward) => {
        sum += parseInt(reward.textContent)
    })
    var second_parag = document.createElement("p");
    second_parag.setAttribute('class', 'title')
    second_parag.innerText = 'Total Rewards ' + sum
    body.append(second_parag);
    body.appendChild(button);
    button.innerHTML = "Script Not Running"

    button.addEventListener("click", function() {
        button.innerHTML = "Script Run"
        console.log("Script Run")
        visitPtc()
    });
    attachHandler([].slice.call(document.getElementsByTagName('a')));

    setMutationHandler(document, 'a', function(nodes) {
        attachHandler(nodes);
        return true;
    });

    function attachHandler(nodes) {
        nodes.forEach(function(node) {
            if (node.target != '_blank') {
                node.onclick = clickHandler;
                node.addEventListener('click', clickHandler);
            }
        });
    }

    function clickHandler(e) {
        if (e.button > 1)
            return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        // GM_openInTab(this.href, e.button || e.ctrlKey);
        GM_openInTab(this.href, true);
    }

    function clickOnEle(el) {
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
        simulateMouseEvent(theButton, "mousedown", coordX, coordY);
        simulateMouseEvent(theButton, "mouseup", coordX, coordY);
        simulateMouseEvent(theButton, "click", coordX, coordY);
    }

    function visitPtc() {
        let delay = 0;
        let timerId = setTimeout(function request() {
            let visit = _ptc_ToClaim.splice(0, 1)[0];
            if (visit) {
                console.log(visit.parentElement.parentElement.parentElement.getElementsByTagName('p')[0].textContent)
                clickOnEle(visit)
                if (delay >= 20000) {
                    delay -= 1000
                } else {
                    delay += 2000
                }
            } else {
                clearTimeout(timerId)
                clearTimeout(timerId1)
                button.innerHTML = "Done Running Script"
                console.log("Done Running Script")
            }
            console.log(delay)
            var timerId1 = setTimeout(request, delay);

        }, delay);
    }
}
