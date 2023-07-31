if(/.*dutchycorp.space\/defi.*|anchoreth/ig.test(window.location.href)){window.close()}
//Press P on the keybboard to remove the added title
let addedtitle=" (Page Loaded)"
const title = ()=>{
    if(new RegExp('faucetpay.io','ig').test(window.location.href)){remove();document.title=document.title.replace(/\|.*/,addedtitle)}
    else if(new RegExp('autofaucet.dutchycorp','ig').test(window.location.href)){remove();document.title=document.title+addedtitle}
    else{
        clearInterval(checkPageLoadInterval);
    }
}
let remove=()=>{
    window.addEventListener('keydown', function check(event) {
        if (event.key.toLowerCase() === 'p') {
            clearInterval(checkPageLoadInterval);
            document.title = document.title.replace(addedtitle,'');
            this.removeEventListener('keydown',check,false);
        }
    });
};
//window.addEventListener('load', show, false);
var checkPageLoadInterval;
function checkPageLoad() {
    // Check if the text has already been added to the title
    if (document.title.endsWith(" (Page Loaded)")) {
        //clearInterval(checkPageLoadInterval);
        return;
    }

    // Check if the page has finished loading
    if (document.readyState === 'complete') {
        // Add text to page title
        title();

        // Stop checking for page load
        clearInterval(checkPageLoadInterval);
    }
}

// Wait for the page to fully load
window.onload =()=>{
    // Check if the text has already been added to the title
    if (!(new RegExp(addedtitle,'ig').test(document.title))) {
        // Add text to page title
        title();
    }

    // Check for page load every 500 milliseconds
    checkPageLoadInterval = setInterval(checkPageLoad, 500);

    // Listen for URL changes
    window.addEventListener('urlchange', function() {
        // Reset the interval check
        clearInterval(checkPageLoadInterval);

        // Check if the text has already been added to the title
        if (!(new RegExp(addedtitle,'ig').test(document.title))){
            // Add text to page title
            title();
        }

        // Check for page load every 500 milliseconds
        checkPageLoadInterval = setInterval(checkPageLoad, 500);
    });
};
