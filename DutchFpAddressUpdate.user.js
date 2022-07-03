if(/addresses_update.php/ig.test(window.location)){
    //alert('update')
    let i=0
    console.log(i)
    let check = setInterval(()=>{
        let email = document.querySelector("#addresses_form > div:nth-child(3)").querySelector('input').value
        if(email){
            GM_deleteValue('email')
            clearInterval(check)
        }else{
            if(!GM_getValue('email')){window.location.href="https://autofaucet.dutchycorp.space/account.php"}
            else{
                let email = GM_getValue('email','')
                if(email){
                    let elem = document.querySelector("#addresses_form > div:nth-child(3)").querySelector('input')
                    elem.click()
                    elem.value=email
                    document.querySelector("#addresses_form button").click()
                }}
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
    window.location.href="https://autofaucet.dutchycorp.space/addresses_update.php"
}
