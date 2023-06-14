if(/compromised_device.php|524/ig.test(`${window.location.href}-${document.title}`)){window.close()}
if(/.*ptc.*&_.*/ig.test(window.location.href)){ window.location=window.location.pathname.replace(/.*(undefined|index).*/,'')}
const scriptTag =`<script defer async>
const blocker =()=>{};
const adBlockDetected_2=()=>{};
const video_display=()=>{}
</script>`;
const scriptTagappend = document.createRange().createContextualFragment(scriptTag);
document.querySelector("html").append(scriptTagappend);
document.querySelector("html").prepend(scriptTagappend);
window.onload = function(){
    let text = `.*what can i do to prevent this in the future.*|
    .*Sorry, you have been blocked.*|
    .*checking if the site connection is secure.*`
    if (document.body && new RegExp(text,'ig').test(document.body.textContent)) {
        window.location=window.location.href
    }
}
