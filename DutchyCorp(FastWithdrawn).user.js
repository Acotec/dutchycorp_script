(function() {
    'use strict';
    var DEBUG =false
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
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms || 3000));

    function notify(msg,length=5000,color='green'){
        M.toast({
            html:msg,
            displayLength :length,
            classes: color
        });
    }

    function replace_par(text){
        let addpar=document.querySelector(".addedtoast")
        let WithButton = document.getElementById('all_submit')
        if(addpar){
            DEBUG&&console.log('replace addedtoast')
        }else{
            addpar = document.createElement("p");
            addpar.setAttribute('class', 'addedtoast');
        }
        addpar.innerHTML = text.trim()
        WithButton.parentNode.insertBefore(addpar, WithButton.nextSibling);
        document.querySelector("#toast-container")&&document.querySelector("#toast-container").remove()
        document.querySelector("#user_exchange")&&document.querySelector("#user_exchange").remove()
    }
    async function addButton() {
        let container1,container2;
        container1 = document.querySelector('sup');
        container2 = document.querySelector("#all_submit")
        if (container1||container2) {
            container1.innerHTML += '<a href="#r" id="fastWithdrawal1"> Withdraw</a>';
            document.querySelector('#fastWithdrawal1').onclick = withdrawCoin;
            if(/exchange/ig.test(window.location.href)){
                let p_withdraw = document.createElement("p")
                container2.parentNode.appendChild(p_withdraw);
                p_withdraw.innerHTML += '<a href="#fastWithdrawal2" id="fastWithdrawal2"> Withdraw</a>';
                document.querySelector('#fastWithdrawal2').onclick = withdrawCoin;
            };
            return;
        } else {
            await wait(3000);
        }
    }

    async function recaptchaSolution() {
        async function recaptchaSolutionv2() {
            if (grecaptcha && grecaptcha.getResponse().length > 0) {
                replace_par('Processing Withdraw')
                return grecaptcha.getResponse();
            } else {
                DEBUG&&console.log('waiting for captcha');
                replace_par('waiting for captcha')
                await wait(1000);
                return recaptchaSolution();
            }
        };
        async function recaptchaSolutionv3() {
            // V3 token
            var token = await grecaptcha.execute('6LctglAdAAAAAJmNg2xib4UQDYI1eDK5wIUFTXY9', {
                action: 'submit'
            });
            // V3 Token ready!
            DEBUG&&console.log('V3 response:'+token);
            return token;}

        try{
            return await recaptchaSolutionv2()
        }catch(err){
            DEBUG&&console.log('reCAPTCHA_V2 Not exist',err)
            return await recaptchaSolutionv3()
        }
    }
    // async function hcaptchaSolution() {
    //     let captcha = new HCaptchaWidget();
    //     await captcha.isSolved();
    //     DEBUG&&console.log(captcha.element.getAttribute('data-hcaptcha-response'));
    //     return captcha.element.getAttribute('data-hcaptcha-response');
    // }

    async function withdrawCoin() {
        DEBUG&&console.log('@withdrawCoin');
        function get_coin_amount(element){
            let r = document.querySelector(element)&&document.querySelector(element).innerText.split('\n')[1].split(' ');
            let p=document.querySelector("#fastWithdrawal2")
            let coin=r[1]
            let amount =r[0]
            DEBUG&&console.log('coin '+coin,'amount '+amount)
            p.innerText=`${p.innerText.replace(/-.*/,'')}-(Coin=[${coin}]- Amount=[${amount}])`
            easyWithdrawal(coin,amount);
        }
        //waitForKeyElements('#balance_to_receive',get_coin_amount,true,500)
        get_coin_amount('#balance_to_receive')
    }

    async function easyWithdrawal(coin, amount) {
        DEBUG&&console.log('@easyWithdrawal', coin, amount);

        try{
            axios.post('withdraw.php',{
                coin: coin,
                withdrawal_amount: amount, // coin amount, need to convert in sat in some cases
                method: `faucetpay_w_${coin}`,
                token: await recaptchaSolution()
                // token: await hcaptchaSolution()
            })
                .then( function(response){
                DEBUG&&console.log(response.status);
                DEBUG&&console.log(response.data);
                DEBUG&&console.log(response.data.message);
                replace_par(response.data.message)
                //notify(response.data.message, response.data.displayLength,response.data.color);
                if (response.data.send_status == 200){
                    // do something like update bal ect
                    //var nu_balance = response.data.nu_balance;
                    replace_par(response.data.message)
                    //notify(response.data.message)
                    DEBUG&&console.log('DONE')
                }else{
                    let i_msg=response.data.i_message||response.data.message
                    //notify(i_msg)
                    replace_par(i_msg)
                    DEBUG&&console.log('fail')
                }
                setTimeout(()=>{//replace_par('recaptcha reset');
                    grecaptcha.reset();},2000)

            }).catch(function (error) {
                DEBUG&&console.log(error.message); // "failed with status code ..."
                let response=error.response||null
                if (response) {
                    DEBUG&&console.log(error.response.status);
                    DEBUG&&console.log(error.response.data);
                    //notify(response.data.message, response.data.displayLength,response.data.color)
                    replace_par(response.data.message)
                }else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    DEBUG&&console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    DEBUG&&console.log('Error', error.message);
                }
                replace_par(`The transaction process failed`)
                //notify(`The transaction process failed`)
                DEBUG&&console.log("The transaction process failed")

            })
        }catch(err){
            replace_par(`Error with Axios`)
            console.log('Error with Axios',err)
        };

    }

    setTimeout(() => {
        addButton();
    }, 2000);
})();
