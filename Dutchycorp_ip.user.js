(function() {
    'use strict';
    try{document.querySelector("#dropdown1 > li:nth-child(10) > a").remove()}catch(err){}//remove logout button
    if(/.*is Linked to your IP.*|what can i do to prevent this in the future|.*Sorry, you have been blocked.*/ig.test(document.body.textContent)){
        window.location.reload(true)
    }
})();
