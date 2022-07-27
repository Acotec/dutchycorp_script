var _ptc_ToVisit = Array.from(document.getElementsByClassName("btn-small waves-effect")),
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
});
var button = document.createElement("button");
var second_parag = document.createElement("p");
second_parag.setAttribute('class', 'title')
second_parag.innerText = `Total Rewards ${sum} (${_ptc_ToVisit.length})`
body.append(second_parag);
body.appendChild(button);
button.innerHTML = "Script Not Running"
button.addEventListener("click", function() {
    GM_setValue("canclose", true);
    button.innerHTML = "Script Run"
    console.log("Script Run")
    visitPtc()
});

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
    let visit = _ptc_ToClaim.splice(0, 1)[0];
    if (visit) {
        console.log(visit.parentElement.parentElement.parentElement.getElementsByTagName('p')[0].textContent)
        clickOnEle(visit)
    } else {
        var check = setInterval(() => {
            let sidevar = document.querySelector("#mobile-demo")
            let dutch_pri_info = document.querySelector("#DUTCHY-price-informations")
            let coupon = document.querySelector("#coupon")
            if (sidevar && dutch_pri_info && coupon) {
                sidevar.remove();
                dutch_pri_info.remove();
                coupon.remove();
                clearInterval(check);
            } else(null)
        }, 1000);
        button.innerHTML = "Done Running Script All Available Ads Watched"
        console.log("Done Running Script")
    }
}
visitPtc()
