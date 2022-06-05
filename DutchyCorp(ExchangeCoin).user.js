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
    selectFromDropDown(tocoin)
    fill_in_and_exchange()
});
waitForKeyElements('#toast-container', (element) => {
    let WithButton = document.getElementById('all_submit')
    let addButton = document.createElement("p")
    addButton.setAttribute('class', 'title')
    addButton.innerText = element.innerText
    WithButton.parentNode.insertBefore(addButton, WithButton.nextSibling);
}, false)

function selectFromDropDown(coin = 'usdt', exc = null) {
    var selectFrom, SelectCoin;
    if (exc) {
        console.log("Exchanging", exc)
        exc = exc
        selectFrom = document.querySelectorAll(".select-wrapper")[0]
        SelectCoin = Array.from(selectFrom.querySelector('.dropdown-content').querySelectorAll('li'))
        SelectCoin.filter((list) => {
            if (new RegExp(exc, 'ig').test(list.textContent)) {
                list.click()
            };
            list.dispatchEvent(new Event('change'));
        })
    }
    if (coin) {
        console.log("To ", coin)
        coin = coin
        selectFrom = document.querySelectorAll(".select-wrapper")[1]
        SelectCoin = Array.from(selectFrom.querySelector('.dropdown-content').querySelectorAll('li'))
        SelectCoin.filter((list) => {
            if (new RegExp(coin, 'ig').test(list.textContent)) {
                list.click()
            };
            list.dispatchEvent(new Event('change'));
        })
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
