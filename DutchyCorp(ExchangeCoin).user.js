var exc, coin;
var tocoin = "usdt"
var DEBUG = false
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

function replace_par(element){
    let addpar=document.querySelector(".addedtoast")
    let WithButton = document.getElementById('all_submit')
    if(addpar){
        DEBUG&&console.log('replace addedtoast')
    }else{
        addpar = document.createElement("p");
        addpar.setAttribute('class', 'addedtoast');
    }
    addpar.innerHTML = element.innerText.trim()
    WithButton.parentNode.insertBefore(addpar, WithButton.nextSibling);   
}

waitForKeyElements('.select-wrapper', (element) => {
    select(tocoin)
    fill_in_and_exchange()
});

waitForKeyElements('#user_exchange b',replace_par, false)
waitForKeyElements("#toast-container",replace_par, false)

function selectFromDropDown(elem,choose=null){
    if(choose&&elem){
        let SelectCoin = Array.from(elem.querySelector('.dropdown-content').querySelectorAll('li'))
        SelectCoin.filter((coin) => {
            if (new RegExp(choose, 'ig').test(coin.textContent)) {
                DEBUG&&console.log(`pick ${coin.textContent.toUpperCase()}`)
                coin.click()
            };
            elem.dispatchEvent(new Event('change'));
        })
    }
    else{
        let say = `Element to choose from:${elem} and what to pick: ${choose}`
        DEBUG&&console.log(say)
    }
}
function select(coin = 'usdt', exc =null) {
    if (exc) {
        //DEBUG&&console.log("Exchanging", exc)
        exc = exc
        let elem= document.querySelectorAll(".select-wrapper")[0]
        selectFromDropDown(elem,exc)
    }
    if (coin) {
        //DEBUG&&console.log("To ", coin)
        coin = coin
        let elem = document.querySelectorAll(".select-wrapper")[1]
        selectFromDropDown(elem,coin)
    } else {
        DEBUG&&console.log('No currency claim yet ')
    }
    exc = exc || "DUTCHY"
    DEBUG&&console.log("Exchanging:", exc.toUpperCase(), "To:", coin.toUpperCase())
}

function fill_in_and_exchange() {
    let balance = document.querySelector("#balance_to_exchange").textContent.replace(/\D/ig, '')
    let amount_value = document.querySelector("#amount_to_exchange")
    amount_value.value = balance
    amount_value.dispatchEvent(new Event('input', {
        bubbles: true,
        cancelable: true
    }))
    //document.querySelector("#all_submit").click()
}
