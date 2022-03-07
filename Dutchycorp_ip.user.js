(function() {
    'use strict';
    try{document.querySelector("#dropdown1 > li:nth-child(10) > a").remove()}catch(err){}//remove logout button
    if(/.*is Linked to your IP.*/ig.test(document.body.textContent)){
        window.location.reload(true)
    }
})();