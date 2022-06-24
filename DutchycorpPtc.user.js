if (/invalid_captcha/ig.test(window.location.href)) {
    window.close()
} else {
    try {
        document.querySelector("#methods > p").scrollIntoView()
    } catch (e) {
        document.querySelector("#methods > p").scrollIntoViewIfNeeded()
    }
    var element;
    const pageAccessedByReload = (
        (window.performance.navigation && window.performance.navigation.type === 1) ||
        window.performance
        .getEntriesByType('navigation')
        .map((nav) => nav.type)
        .includes('reload')
    );

    function ForceCloseTab() {
        0 == GM_getValue("ForceCloseTab", !1) ? GM_setValue("ForceCloseTab", !0) : GM_setValue("ForceCloseTab", !1);
        window.location.reload()
    };
    GM_registerMenuCommand("ForceCloseTab-" + GM_getValue('ForceCloseTab', false), ForceCloseTab, "ForceCloseTab");
    if (GM_getValue('ForceCloseTab', false)) {
        if (pageAccessedByReload) {
            console.log("This page is reloaded");
            GM_getValue("canclose", false)
        }
        if (GM_getValue("canclose")) {
            window.close()
        }
    }
    GM_getValue('speed', null) || GM_setValue('speed', 10)

    function SpeedCtr(pos) {
        var speed = GM_getValue('speed', null); //the duration speed
        var body1 = pos,
            dis = document.createElement("p"),
            speed_add = document.createElement("button"),
            speed_sub = document.createElement("button");
        body1.appendChild(speed_add);
        speed_add.innerHTML = 'speed +'
        body1.appendChild(speed_sub);
        speed_sub.innerHTML = 'speed -'
        body1.appendChild(dis);
        dis.innerHTML = 'DS - ' + speed + ' Seconds' //DS=default Speed
        speed_add.addEventListener("click", function() {
            if (GM_getValue('speed') < 20) {
                speed += 1
                GM_setValue("speed", speed);
            }
            dis.innerHTML = 'CS - ' + GM_getValue('speed') + ' Seconds' // CS = current setSpeed
        })
        speed_sub.addEventListener("click", function() {
            if (GM_getValue('speed') > 5) {
                speed -= 1
                GM_setValue("speed", speed);
            }
            dis.innerHTML = 'CS - ' + GM_getValue('speed') + ' Seconds'
        });
    }
    try {
        element = document.querySelector('[class*="toast green darken-4"]')
    } catch (e) {
        element = null
    }
    if (element) {
        window.close()
    }
    SpeedCtr(document.querySelector("center:nth-child(7) > p"))
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
        GM_setValue("canclose", true);
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
        var timerId1;
        let delay = 0;
        let timerId = setTimeout(function request() {
            let visit = _ptc_ToClaim.splice(0, 1)[0];
            if (visit) {
                console.log(visit.parentElement.parentElement.parentElement.getElementsByTagName('p')[0].textContent)
                clickOnEle(visit)
                delay = GM_getValue('speed', 5) * 1000
            } else {
                GM_setValue("canclose", false);
                clearTimeout(timerId)
                clearTimeout(timerId1)
                button.innerHTML = "Done Running Script"
                console.log("Done Running Script")
            }
            console.log(delay)
            timerId1 = setTimeout(request, delay);

        }, delay);
    }
}
