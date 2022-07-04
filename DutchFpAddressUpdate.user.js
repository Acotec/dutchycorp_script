(function() {
    'use strict';    
    function getEmail(){
        window.location.href="https://autofaucet.dutchycorp.space/account.php"
    }
    function updateFpAddress(element){
        let email = GM_getValue('email','')
        if(email){
            element.querySelector('input').click()
            element.querySelector('input').value=email
            GM_deleteValue('email')
            GM_deleteValue('updateFpAddress')
            document.querySelector("#addresses_form button").click()
        }
        else{
            getEmail()
        }
    }
    if(/addresses_update.php/ig.test(window.location)){
        //alert('update')
        let i=0
        console.log(i)
        let check = setInterval(()=>{
            let email = document.querySelector("#addresses_form > div:nth-child(3)").querySelector('input').value
            if(email){
                GM_deleteValue('email')
                GM_deleteValue('updateFpAddress')
                console.log('FaucetPay Email already added')
                clearInterval(check)
            }else{
                GM_setValue('updateFpAddress',true)
                updateFpAddress( document.querySelector("#addresses_form > div:nth-child(3)"))
                clearInterval(check)
            }
            if(i>=30){
                clearInterval(check)
            }
            i++
        },1000)
        }
    if(/account.php.*/ig.test(window.location)){
        let email=document.querySelector("#methods > form > font > form:nth-child(10) > div:nth-child(1) > input").value
        GM_setValue('email',email)
        if(GM_getValue('updateFpAddress')){window.location.href="https://autofaucet.dutchycorp.space/addresses_update.php"}
        // else{
        //     var captcha='recaptcha'
        //     document.querySelector("#methods > form > font > center:nth-child(12) > h3").scrollIntoView(true)
        //     Array.from(document.getElementsByClassName('dropdown-content select-dropdown')[0].querySelectorAll("[id*='select-options']")).forEach((li)=>{
        //         if(GM_getValue('captcha_changed',false)==false&&new RegExp(captcha,'ig').test(li.textContent)){
        //             li.click()
        //             GM_setValue('captcha_used',captcha);
        //             document.getElementsByName('change-captcha')[0].click();
        //             GM_setValue('captcha_changed',true)
        //         }
        //     })
        // }
    }
})();
