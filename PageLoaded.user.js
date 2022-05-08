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
        }, 200)
    }
    setTimeout(() => {
        if (/.*:.*roll.*/ig.test(document.title)) {
            timer(300)
        } else {
            document.title = title
        }
    }, 1500)
};
window.addEventListener('load', show, false);
