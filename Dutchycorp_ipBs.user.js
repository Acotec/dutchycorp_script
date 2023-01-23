if(/compromised_device.php/ig.test(window.location.href)){window.close()}
if(/.*ptc.*&_.*/ig.test(window.location.href)){ window.location=window.location.pathname.replace(/.*(undefined|index).*/,'')}
const scriptTag =`<script defer async>const adBlockDetected_2=()=>{}</script>`;
const scriptTagappend = document.createRange().createContextualFragment(scriptTag);
document.querySelector("html").prepend(scriptTagappend);
window.onload = function(){
    let text = `.*is Linked to your IP.*|
    .*what can i do to prevent this in the future.*|
    .*Sorry, you have been blocked.*|
    .*checking if the site connection is secure.*`
    if (document.body && new RegExp(text,'ig').test(document.body.textContent)) {
        window.location=window.location.href}
}
