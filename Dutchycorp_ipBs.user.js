'use strict';
const scriptTag= `<script async>const adBlockDetected_2=()=>{}</script><script defer>const adBlockDetected_2=()=>{}</script>`;
const scriptTagappend = document.createRange().createContextualFragment(scriptTag);
document.querySelector("html").prepend(scriptTagappend);
document.addEventListener("DOMContentLoaded", function(event) {
    if (/.*is Linked to your IP.*|what can i do to prevent this in the future|.*Sorry, you have been blocked.*/ig.test(document.body.textContent)) {
        window.location.reload(true)
    }
});
