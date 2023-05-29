let addedtitle=" (Page Loaded)"
let remove=()=>{
    /dutchycorp/.test(window.location.href)&&
        window.addEventListener('keydown', function check(event) {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') {
            document.title = document.title.replace(addedtitle,'');
            this.removeEventListener('keydown',check,false);
        }
    });
};
function show() {
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
            remove()
            timer(500)
        } else {
            remove();           

        }
    }, 1500)
};
if(/.*dutchycorp.space\/defi.*/ig.test(window.location.href)){window.close()}
//window.addEventListener('load', show, false);
window.onload = () => {show()};
