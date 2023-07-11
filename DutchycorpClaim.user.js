const DEBUG = false;
$('#DUTCHY-price-informations,#coupon').remove();
window.addEventListener('keydown', function check(event) {
    function copy(text) {
        var input = document.createElement('textarea');
        input.innerHTML = text;
        document.body.appendChild(input);
        input.select();
        var result = document.execCommand('copy');
        document.body.removeChild(input);
        return result;
    }
    if (event.key.toLowerCase() === 'c') {
        copy(document.querySelector(".user_avatar+b").innerText)
        //this.removeEventListener('keydown',check,false);
    }
});
document.querySelector("#mobile-demo").innerHTML = document.querySelector(".user_avatar+b").innerText
var _DontOpen = GM_getResourceText("_DontOpen").replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e),
    shortlinks_name = GM_getResourceText("shortlinks_name").replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e),
    _open_link_fast = [].map(e => e.toLowerCase()),
    _alreadyRun = GM_getValue("_alreadyRun"),
    _views_ToVisit = Array.from(document.getElementsByClassName("col s12 m6 l4")),
    _available_link = parseInt(document.getElementsByClassName("accent-text")[0].textContent.replace(/.*\(/ig, '').replace(/[\W].*/, '')),
    button = document.createElement("button"),
    body = document.getElementsByClassName('col s12 m12 l4 center-align')[0], // card col s8 m4
    gist_id = "493dc66ecebd58a75b730a77ef676632"
var linknames = [],
    totalReward = 0,
    totalReward1 = 0;
_views_ToVisit.forEach(e => {
    let n = e.getElementsByTagName("a")[1].parentElement.parentElement.innerText.replace(/\n.*/g, "").trim();
    let d = e.querySelector("#methods div div")
    let views = parseInt(d.innerText.replace(/Views:.*\/|Reward:.*|\s/ig,''))
    let rewards = parseInt(d.innerText.replace(/Views:.*|Reward*:|\s/ig,''));
    totalReward += views*rewards
    // n = n.replace(/\s|\d$/ig, "").toLowerCase()
    0 == linknames.includes(n) && linknames.push(n)
});
try {
    document.querySelector("#properties p:nth-child(2) i").scrollIntoView()
} catch (err) {
    document.querySelector("#properties p:nth-child(2) i").scrollIntoView()
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
                                               charactersLength));
    }
    return result;
}

var reloadedid = makeid(5)

function caldutchbal(bal) {
    let dutchbalb = document.querySelectorAll("#methods")[1]
    let dutchbalp = document.createElement("p")
    let dutchbal;
    if(bal){ dutchbal=bal}else{dutchbal=dutchbalb.querySelector('p').innerText.replace(/.*\n|\s|,/ig,'')}
    let dutch_usdt_rate = parseFloat(0.000002845)
    let calusdt = dutch_usdt_rate * dutchbal
    let calperc = ((5 / 100) * calusdt).toFixed(8)
    dutchbal = calusdt - calperc
    if(bal){
        return calusdt.toFixed(8)
    }else{
        dutchbalp.setAttribute('class', 'title');
        dutchbalp.innerText = `Your DUTCHYBalance(USDT)
                                     ${calusdt.toFixed(8)}
                               DUTCHYBalance(USDT)-5%(${calperc})
                                     ${dutchbal.toFixed(8)}`;
        dutchbalb.append(dutchbalp);
        //return 0
    }
}
caldutchbal()

function OnPhone() {
    0 == GM_getValue("OnPhone", !1) ? GM_setValue("OnPhone", !0) : GM_setValue("OnPhone", !1);
    window.location.reload()
};
GM_registerMenuCommand("OnPhone-" + GM_getValue('OnPhone', false), OnPhone, "OnPhone");

function AutoUpdateDontOpen() {
    GM_setValue("AutoUpdate", true)
    var AutoUpdateB = document.createElement("button"),
        AutoUpdate = document.getElementsByClassName('col s12 center-align')[1]
    AutoUpdate.appendChild(AutoUpdateB);
    try {
        if (GM_getValue("AutoUpdate", true)) {
            AutoUpdateB.innerHTML = 'AutoUpdate_ON';
            AutoUpdateB.style = "background-color:Violet;color:white"
        } else {
            GM_setValue("AutoUpdate", false)
            AutoUpdateB.innerHTML = 'AutoUpdate_OFF';
            AutoUpdateB.style = "background-color:black;color:white"
        }
        AutoUpdateB.addEventListener('click', function(e) {
            if (GM_getValue("AutoUpdate", true)) {
                GM_setValue("AutoUpdate", false);
                AutoUpdateB.innerHTML = 'AutoUpdate_OFF';
                AutoUpdateB.style = "background-color:black;color:white"
            } else {
                GM_setValue("AutoUpdate", true);
                AutoUpdateB.innerHTML = 'AutoUpdate_ON'
                AutoUpdateB.style = "background-color:Violet;color:white"
            }
        });
    } catch (err) {}
}

function checkButton() {
    if (GM_getValue("_alreadyRun") == true) {
        GM_setValue("_alreadyRun", false);
        button.innerHTML = "Script Run";
        location.reload()
        DEBUG&&console.log("GM_value set to-" + GM_getValue("_alreadyRun"))
    } else {
        GM_setValue("_alreadyRun", true);
        button.innerHTML = "Script Stop";
        location.reload()
    }
}

function static_speed() {
    let staticB = document.createElement("button"),
        static = document.getElementsByClassName('col s12 center-align')[1]
    static.appendChild(staticB);
    try {
        if (GM_getValue("static", true)) {
            staticB.innerHTML = 'Static_ON';
            staticB.style = "background-color:Violet;color:white"
        } else {
            GM_setValue("static", false)
            staticB.innerHTML = 'Static_OFF';
            staticB.style = "background-color:black;color:white"
        }
        staticB.addEventListener('click', function(e) {
            if (GM_getValue("static", true)) {
                GM_setValue("static", false);
                staticB.innerHTML = 'Static_OFF';
                staticB.style = "background-color:black;color:white"
            } else {
                GM_setValue("static", true);
                staticB.innerHTML = 'Static_ON'
                staticB.style = "background-color:Violet;color:white"
            }
        });
    } catch (err) {}
}

GM_getValue('speed', null) || GM_setValue('speed', 0)

function SpeedCtr() {
    var speed = GM_getValue('speed', null); //the duration speed
    var body1 = document.getElementsByClassName('col s12 m12 l4 center-align')[0],
        dis = document.createElement("p"),
        speed_add = document.createElement("button"),
        speed_sub = document.createElement("button");
    dis.classList.add('speed');
    body1.appendChild(speed_add);
    speed_add.innerHTML = 'speed +'
    body1.appendChild(speed_sub);
    speed_sub.innerHTML = 'speed -'
    body1.appendChild(dis);
    dis.innerHTML = 'DS - ' + speed + ' Seconds' //DS=default Speed
    speed_add.addEventListener("click", function() {
        if (GM_getValue('speed') < 10) {
            speed += 1
            GM_setValue("speed", speed);
        }
        dis.innerHTML = 'CS - ' + GM_getValue('speed') + ' Seconds' // CS = current setSpeed
    })
    speed_sub.addEventListener("click", function() {
        if (GM_getValue('speed') >= 1) {
            speed -= 1
            GM_setValue("speed", speed);
        }
        dis.innerHTML = 'CS - ' + GM_getValue('speed') + ' Seconds'
    });
    static_speed()
}

AutoUpdateDontOpen() //run
//function to get the shortlinks that should not be open
if (GM_getValue("_alreadyRun") != true) {
    GM_setValue("_alreadyRun", true);
    if (GM_getValue("AutoUpdate")) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://gist.github.com/Harfho/' + gist_id + '/raw/shortlinks_name.txt?timestamp=' + (+new Date()),
            fetch: false,
            nocache: false,
            onload: get_Shortlinks_and_DontOpen,
            onerror: window.location.reload
        })

        function get_Shortlinks_and_DontOpen(response) {
            let get_shortlinks_name = response.responseText.replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
            shortlinks_name = get_shortlinks_name.map(item => item.replace(/'/ig, '"').toLowerCase());
            DEBUG&&console.log(shortlinks_name)
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://gist.github.com/Harfho/' + gist_id + '/raw/_DontOpen.txt?timestamp=' + (+new Date()),
                fetch: false,
                nocache: false,
                onload: Runcode,
                onerror: window.location.reload
            });
        }
    } else {
        Runcode()
    }
} else {
    SpeedCtr()
    var second_parag = document.createElement("p");
    second_parag.setAttribute('class', 'title')
    second_parag.innerText = 'Available Shortlinks:' + linknames.length;
    body.append(second_parag);
    body.appendChild(button);
    button.innerHTML = "Script Not Running -- SHORTLINKS=" + linknames.length + ' [' + caldutchbal(totalReward) + ']'
    button.addEventListener("click", function() {
        checkButton()
    });
}

function Runcode(response = null) {
    /* variable for appearFunction */
    var i = 0, //index (for looping purpose)
        interval, //for setInterval
        timerId,
        duration; //for setInterval duration
    if (GM_getValue('AutoUpdate')) {
        let getDontOpen = response.responseText.replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
        _DontOpen = getDontOpen.map(item => item.replace(/'/ig, '"').toLowerCase())
    } else {
        _DontOpen = _DontOpen.map(item => item.replace(/'/ig, '"').toLowerCase());
        shortlinks_name = shortlinks_name.map(item => item.replace(/'/ig, '"').toLowerCase());
    }
    if (linknames.length >= _DontOpen.length) {
        var _totalLink = linknames.length - _DontOpen.length;
    } else if (_DontOpen.length >= linknames.length) {
        _totalLink = 'NO'
    } else {
        _totalLink = linknames.length;
    }

    DEBUG&&console.log(_DontOpen)
    DEBUG&&console.log(shortlinks_name)
    //throw new Error("!! Stop JS")
    if (/404|400/ig.test(_DontOpen + shortlinks_name)) {
        window.location.reload();
        throw new Error("!! Stop JS")
    } else {
        DEBUG&&console.log(_DontOpen)
        DEBUG&&console.log(shortlinks_name)
    }
    //function to check when the page is reloaded
    function pageR() {
        //reload
        var reloading = sessionStorage.getItem(reloadedid);
        if (reloading) {
            sessionStorage.removeItem(reloadedid);
            if (_alreadyRun == false) {
                button.innerHTML = "Script Run(Click to Run Again)";
            } else {
                button.innerHTML = "Script Not Running -- SHORTLINKS=" + linknames.length;
            }
        }
    }

    //function to reload the page
    function reloadP() {
        sessionStorage.setItem(reloadedid, makeid(5));
    }

    //function to re-run the script
    function Re_run() {
        let reRun = Number(GM_getValue("Re_run", 0)) //
        let time = 2
        if (reRun < time) {
            GM_setValue("_alreadyRun", false);
            GM_setValue("Re_run", reRun + 1);
            window.location.reload()
        } else {
            GM_setValue("Re_run", 0); //
            GM_setValue("_alreadyRun", true);
            //window.close()
        }
    }

    function DontOpen_LinkByName(linkName) {
        let check = _DontOpen.some((link) => {
            //return new RegExp('^' + link.replace(/\s|\d$/ig, '') + '$', "ig").test(linkName.replace(/\s|\d$/ig, ''))
            return new RegExp('^' + link.replace(/\s/, '') + '$', "ig").test(linkName.replace(/\s/, ''))
        }) //check if linkName is among _DontOpen
        if (check) {
            //alert('Dontopen '+linkName)
            return true
        } else {
            return false
        }
    }

    function update_DontOpen(linkName) {
        _DontOpen.push(linkName.toLowerCase())
        shortlinks_name.push(linkName)
        var access_token = atob('Z2hwXzFVMGhPMTFodTZ6eWxaZ0hMWW5qWFdMTjE1d3V5NjBZN0l6Rw=='), //get access_token and de_encrpt it btoa to atob
            discription = window.location.host + " added " + linkName + " to _DontOpen and shortlinks_name"
        access_token = "Bearer " + access_token
        DEBUG&&console.log(access_token)
        const myHeaders = new Headers({
            "accept": "application/vnd.github.v3+json",
            'Authorization': access_token,
            "Content-Type": "application/json"
        })
        var raw = JSON.stringify({
            "description": discription,
            "files": {
                "shortlinks_name.txt": {
                    "content": JSON.stringify(shortlinks_name)
                },
                "_DontOpen.txt": {
                    "content": JSON.stringify(_DontOpen)
                }
            }
        });
        var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://api.github.com/gists/" + gist_id, requestOptions)
            .then(response => response.text())
            .then(result => DEBUG&&console.log(discription))//console.log(result);
            .catch(error => DEBUG&&console.log('error', error));
    }

    function clickOnEle(el) {
        var simulateMouseEvent = function(element, eventName, coordX, coordY) {
            element.dispatchEvent(new MouseEvent(eventName, {
                //view: window,
                bubbles: true,
                cancelable: true,
                clientX: coordX,
                clientY: coordY,
                button: 0
            }));
        };
        var theButton = el;
        var box = theButton.getBoundingClientRect(),
            coordX = box.left + (box.right - box.left) / 2,
            coordY = box.top + (box.bottom - box.top) / 2;
        simulateMouseEvent(theButton, "mousedown", coordX, coordY);
        simulateMouseEvent(theButton, "mouseup", coordX, coordY);
        simulateMouseEvent(theButton, "click", coordX, coordY);
    }

    // var check = 0
    // var antibot = setInterval(isantibotvisible, 1000)
    // function isantibotvisible() {
    //     try {
    //         let visible = document.getElementsByClassName("modal open")[0].style.display == "block"
    //         let antibotid = document.getElementsByClassName("modal open")[0].id
    //         DEBUG&&console.log('antibotFrame is now visible')
    //         if (visible) {
    //             clearInterval(interval)
    //             clearInterval(antibot)
    //             clearTimeout(timerId)
    //             //alert('anti')
    //             setTimeout(() => {
    //                 let icon = Array.from(document.querySelector("#" + antibotid).getElementsByClassName("gradient-btn btn btn-secondary"))
    //                 icon.forEach(img => {
    //                     let select = document.querySelector("#" + antibotid).innerText.replace(/[\W]/g, "").replace(/.*Select|Gosend/ig, '').trim();
    //                     let icselect = img.getElementsByTagName('input')[0].value.replace(/[\W]/ig, "").trim();
    //                     DEBUG&&console.log(icselect, select)
    //                     if (select == icselect) {
    //                         DEBUG&&console.log("Antibot to select is - ", select)
    //                         let sec = 1000
    //                         //waitForKeyElements(".waves-ripple", (element) =>{alert("OPEN")});
    //                         DEBUG&&console.log(img.getElementsByTagName('input')[0], "clicked");
    //                         setTimeout(() => {
    //                             clickOnEle(img.getElementsByTagName('input')[0])
    //                         }, )
    //                         setTimeout(() => {
    //                             clickOnEle(document.querySelector("#" + antibotid).querySelector('button'))
    //                         }, 1 * sec)
    //                         GM_setValue("_alreadyRun", false);
    //                         setTimeout(() => {
    //                             if (GM_getValue('OnPhone', false)) {
    //                                 window.close()
    //                             } else {
    //                                 window.location.reload(false)
    //                             }
    //                         }, 2 * sec)
    //                     }
    //                 })
    //             }, 2000)
    //         };
    //     } catch (e) {
    //         if (check > 3 + GM_getValue('speed')) {
    //             clearInterval(antibot)
    //             DEBUG&&console.log('There is no antibotFrame')
    //         } else {
    //             DEBUG&&console.log('waiting for antibotFrame', check)
    //             check++
    //         }
    //     }
    // }

    function getduration(i,phone=false) {
        if (GM_getValue("static", null)) {
            var ds = GM_getValue('speed')
            var time = new Date();
            time = time.toLocaleString('en-US', {
                hour: 'numeric',
                hour12: true
            }).replace(/\s+/ig, '')
            if (/(12|0[0-8]|[1-8])am/ig.test(time)) {
                DEBUG&&console.log("time is around 12am-8am")
                duration = 1 * 1000
            } //time is around 12am-8am
            else if (/(9|1[0-1])am/ig.test(time)) {
                DEBUG&&console.log("time is around 9pm-11am")
                duration = (1 + ds) * 1000
            } //time is around 9am-11am
            else if (/(12|(0|1[0-9]|[1-9]))pm/ig.test(time)) {
                DEBUG&&console.log("time is around 12pm-11pm")
                duration = (2 + ds) * 1000
            } //time is around 12pm-11pm
            else {
                duration = (3 + ds) * 1000
            }
        }
        else {
            if(phone){
                duration = i * 1000}
            else if (GM_getValue('speed')) {
                duration = GM_getValue('speed') * 1000
            } else {
                duration = i + 1000
            }
        }
        var speedclass = document.querySelector("p.speed")
        speedclass.innerText=`${speedclass.innerText.replace(/\(duration.*/,'')} (duration=${duration/1000} seconds)`
        return duration
    }
    var LinkToVisitOnPage = []
    _views_ToVisit.forEach((c) => {
        LinkToVisitOnPage.push(c.getElementsByTagName("a")[1])
    })

    function appear() { //define a function
        let limit = LinkToVisitOnPage.length
        interval = setInterval(() => {
            try {
                let _getlink = LinkToVisitOnPage.splice(0, 1)[0]
                let open_link = _getlink //.parentNode.parentNode.parentNode.querySelector("button");
                let linkName = _getlink.parentElement.parentElement.innerText.replace(/\n.*/g, "").trim()
                DEBUG&&console.log(linkName,_available_link)
                if (_available_link <= 1000) {
                    if (DontOpen_LinkByName(linkName)) {
                        duration = 1
                        //limit++
                        DEBUG&&console.log('wont open', linkName, limit, i)
                    } else {
                        let views = _getlink.parentElement.querySelector("#methods div div"),
                            exFirstNum = parseInt(views.innerText.replace(/Views:|Reward:.*|\s|\/.*/ig,'')),
                            views_left = parseInt(views.innerText.replace(/Views:.*\/|Reward:.*|\s/ig,'')),
                            reward = parseInt(views.innerText.replace(/Views:.*|Reward*:|\s/ig,''));
                        totalReward1 += reward * views_left
                        DEBUG&&console.log(exFirstNum+"/"+views_left)
                        DEBUG&&console.log(linkName,shortlinks_name.includes(linkName.replace(/\s/ig,'').toLowerCase()));
                        if (shortlinks_name.includes(linkName.replace(/\s/ig, '').toLowerCase())) {
                            i++; //increment the index
                            duration = getduration(i)
                            var addtoduration;
                            if (GM_getValue('OnPhone', false)) {
                                addtoduration = 0 < GM_getValue("speed") ? getduration(1,GM_getValue('OnPhone',true)) : 0;
                            } else {
                                addtoduration = 0
                            }
                            timerId = setTimeout(function call() {
                                var speedclass = document.querySelector("p.speed");
                                speedclass.innerText=`${speedclass.innerText.replace(/\(duration.*/,'')} (duration=${duration/1000} seconds)`
                                exFirstNum--
                                if (exFirstNum >= 0) {
                                    clearInterval(interval)
                                    DEBUG&&console.log('linkName=' + linkName, "\nviews_left=" + exFirstNum + "/" + views_left, '\nduration using is', (duration / 1000) + ' seconds', "\nlimit=" + limit, "\ni=" + i, "\nTotalreward=" + totalReward1)
                                    clickOnEle(open_link)
                                    duration += addtoduration
                                    timerId = setTimeout(call, duration);
                                } else {
                                    DEBUG&&console.log('linkName=' + linkName, "no view left", '\nduration using is', (duration / 1000) + ' seconds')
                                    clearInterval(interval)
                                    clearTimeout(timerId)
                                    duration = getduration(i)
                                    appear()
                                }

                            }, duration);
                        } else {
                            DEBUG&&console.log(linkName.toLowerCase(), 'Is not among shortlinks to open', limit)
                            update_DontOpen(linkName.toLowerCase())
                        }

                    }
                } //end
                //if Available link is greater than 1000
                else {
                    duration = i * GM_getValue('speed')
                    if (DontOpen_LinkByName(open_link)) {
                        DEBUG&&console.log('Shortlink Among Dont Open')
                        limit++
                    } else {
                        clickOnEle(open_link)
                        DEBUG&&console.log('b', linkName)
                    }
                } //end
                clearInterval(interval); //clear
            } catch (err) {
                null
            }
            DEBUG&&console.log(limit);
            DEBUG&&console.log('duration using is', (duration / 1000))
            if (limit != 0) {
                clearInterval(interval);
                DEBUG&&console.log('recalling appear and duration using is', (duration / 1000))
                appear(); //re-run
            } else {
                clearInterval(interval);
                i = 0; //reset
                DEBUG&&console.log('Done opening')
                console.log( caldutchbal(totalReward1))
                button.innerHTML = "Done opening-Click to Run Again=[" + caldutchbal(totalReward1) + '] out of ' + caldutchbal(totalReward)
                clearInterval(interval)
                //clearInterval(inter)
                //Re_run()
                //window.close();//window.close()
            }
        }, duration);
    }

    SpeedCtr()

    function main() {
        GM_setValue("_alreadyRun", true);
        appear();
    }
    body.appendChild(button);
    // Add event handler
    button.addEventListener("click", function() {
        checkButton()
    });
    //////////////////
    pageR()
    reloadP()
    if (!_alreadyRun) {
        button.innerHTML = "Script Run [" + _totalLink + "] Links will Open";
        main()
    }
}
