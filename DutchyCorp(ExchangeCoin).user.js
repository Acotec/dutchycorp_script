var exc, coin;
var tocoin = "usdt"
var DEBUG = true
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
    document.querySelector("#toast-container")&&document.querySelector("#toast-container").remove()
}

waitForKeyElements('.select-wrapper',fill_in_and_exchange,false,1000);

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
    select(tocoin)
    //setTimeout(()=>{
    let balance = document.querySelector("#balance_to_exchange").textContent.replace(/\D/ig, '')
    let amount_input = document.querySelector("#amount_to_exchange")
    amount_input.value = balance;
    let check=0
    let interval = setInterval(()=>{
        let msg = document.querySelector("#user_exchange")||''
        if(msg.innerText==''){
            amount_input.dispatchEvent(new Event('change', {
                bubbles: true,
                cancelable:true
            }))
        }else{
            clearInterval(interval)}
    },1)
    }
