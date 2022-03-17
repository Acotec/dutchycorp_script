let coin_code = 'USDT'
    var i=0
    var limit=10
    var check = setInterval(()=>{
        i++
        var element
        console.log("waiting for",coin_code,"withdraw button to be available within",limit-i,"seconds")
        try{
            element =document.querySelector('#status_text_USDT'+coin_code)
            if(element){
                element.scrollIntoView();
                //element.click()
            }
        }catch(e){element=null}
        if(i>=limit){
            console.log("waiting for",coin_code,"withdraw button Timeout")
            clearInterval(check)
        }
    },1000)
