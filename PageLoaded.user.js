function show() {
    let addedtitle=" (Page Loaded)"
    let title = document.title +addedtitle
    document.title = title
    let timer = (x) => {
        if (x == 0) {
            return
        };
        document.title = title
        return setTimeout(() => {
            timer(--x)
        },100)
    }
    setTimeout(() => {
        if (/.*:.*roll.*/ig.test(document.title)) {
            timer(500)
        } else {
            setTimeout(()=>{document.title = document.title.replace(addedtitle,'')},8500)
        }
    }, 1500)
};
if(/.*dutchycorp.space\/defi.*/ig.test(window.location.href)){window.close()}
//window.addEventListener('load', show, false);
window.onload = () => {show()};
