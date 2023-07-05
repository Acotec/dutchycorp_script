var exc, coin;
var tocoin = "usdt"

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
waitForKeyElements('.select-wrapper', (element) => {
    select(tocoin)
    fill_in_and_exchange()
});
waitForKeyElements('#user_exchange b', (element) => {
    let addpar=document.querySelector(".addedtoast")
    let WithButton = document.getElementById('all_submit')
    if(addpar){
        console.log('replace addedtoast')
    }else{
        addpar = document.createElement("p");
        addpar.setAttribute('class', 'addedtoast');
    }
    addpar.innerText = element.innerText.trim()
    WithButton.parentNode.insertBefore(addpar, WithButton.nextSibling);
}, false)

function selectFromDropDown(elem,choose=null){
    if(choose&&elem){
        let SelectCoin = Array.from(elem.querySelector('.dropdown-content').querySelectorAll('li'))
        SelectCoin.filter((coin) => {
            if (new RegExp(choose, 'ig').test(coin.textContent)) {
                console.log(`pick ${coin.textContent.toUpperCase()}`)
                coin.click()
            };
            elem.dispatchEvent(new Event('change'));
        })
    }
    else{
        let say = `Element to choose from:${elem} and what to pick: ${choose}`
        console.log(say)
    }
}
function select(coin = 'usdt', exc =null) {
    if (exc) {
        //console.log("Exchanging", exc)
        exc = exc
        let elem= document.querySelectorAll(".select-wrapper")[0]
        selectFromDropDown(elem,exc)
    }
    if (coin) {
        //console.log("To ", coin)
        coin = coin
        let elem = document.querySelectorAll(".select-wrapper")[1]
        selectFromDropDown(elem,coin)
    } else {
        console.log('No currency claim yet ')
    }
    exc = exc || "DUTCHY"
    console.log("Exchanging:", exc.toUpperCase(), "To:", coin.toUpperCase())
}

function fill_in_and_exchange() {
    let balance = document.querySelector("#balance_to_exchange").textContent.replace(/\D/ig, '')
    document.querySelector("#amount_to_exchange").value = balance
    document.querySelector("#amount_to_exchange").dispatchEvent(new Event('input', {
        bubbles: true,
        cancelable: true
    }))
    //document.querySelector("#all_submit").click()
}
