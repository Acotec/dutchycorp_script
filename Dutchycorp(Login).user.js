(function() {
    'use strict';
    var check = setInterval(() => {
        if (window.grecaptcha) {
            clearInterval(check);
            console.log('reload');
            grecaptcha.reset();
            clearInterval(check)
        }
    }, 1000)
    document.addEventListener('DOMContentLoaded', function() {
        console.log(document.readyState, 'document was not ready, place code here');
        let form = Array.from(document.querySelectorAll(".form-group"))
        let ps = "",
            d = [];

        function capitalizeFirstLetter(string) {
            return string[0].toUpperCase() + string.slice(1).toLowerCase();
        };
        const crypt = (salt, text) => {
            const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
            const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
            const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

            return text
                .split("")
                .map(textToChars)
                .map(applySaltToChar)
                .map(byteHex)
                .join("");
        };
        const decrypt = (salt, encoded) => {
            const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
            const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
            return encoded
                .match(/.{1,2}/g)
                .map((hex) => parseInt(hex, 16))
                .map(applySaltToChar)
                .map((charCode) => String.fromCharCode(charCode))
                .join("");
        };

        function generatepass(df_ps) {
            let ps = df_ps.toLowerCase()
            let key = window.location.host
            let crypt_ps = crypt(key, ps)
            let decrypt_ps = decrypt(key, crypt_ps)
            let gen = capitalizeFirstLetter(crypt_ps)
            if (gen.length < 8) {
                gen = capitalizeFirstLetter(gen + 81186815)
            }
            console.log(ps, crypt_ps, decrypt_ps, gen)
            return gen
        }

        function pass(un) {
            try {
                form.filter(a => {
                    if (a.querySelector('input').name == 'password') {
                        d.push(a.querySelector('input'))
                    }
                })
            } catch (err) {}
            ps = generatepass(un)
            console.log(ps)
            d.forEach(p => {
                p.value = ps
            })
        }
        form.filter(u => {
            if (u.querySelector('input').type == 'text') {
                u.addEventListener('focusout', (event) => {
                    let us = u.querySelector('input').value //username
                    //console.log(us)
                    pass(us)
                });
            }
        })
    });
})();
