(function() {
    'use strict';    
    if(/.*is Linked to your IP.*|what can i do to prevent this in the future|.*Sorry, you have been blocked.*/ig.test(document.body.textContent)){
        window.location.reload(true)
    }
})();
