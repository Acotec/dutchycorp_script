function show() {
    let title = document.title + " (Page Loaded)"
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
            document.title = title
        }
    }, 1500)
};
if(/.*dutchycorp.space\/defi.*/ig.test(window.location.href)){window.close()}
window.addEventListener('load', show, false);
