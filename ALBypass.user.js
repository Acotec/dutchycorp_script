    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href)
    } //to prevent resubmit on refresh and back button
    GM_addValueChangeListener('shortner_name', function(name, old_value, new_value, remote) {
        GM_setValue('shortner_name', new_value)
        GM_setValue('previous_shortner_name', old_value)
    })
    //---------------------------------------------------------//
    var messageError, linkCantBypass,
        //var location = window.location
        listOfAcceptDomains = GM_getValue('domains', ''),
        retry = 3,
        green_icon = GM_getValue('green_icon', ''),
        green_icon1 = GM_getValue('green_icon1', ''),
        grey_icon = GM_getValue('grey_icon', ''),
        red_icon = GM_getValue('red_icon', ''),
        dutchy = 'autofaucet.dutchycorp.space',
        gist_id = '493dc66ecebd58a75b730a77ef676632'

    String.prototype.insert = function(index, string) {
        if (index > 0) {
            return this.substring(0, index) + string + this.substr(index);
        }

        return string + this;
    };

    function getIcons() {
        fetch("https://gist.githubusercontent.com/Harfho/63966e7f7145a5607e710a4cdcb31906/raw/ALBypass_icons.json")
            .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).then((result) => {
            //console.log(result);
            let green_icon = result.green_icon
            let green_icon1 = result.green_icon1
            let grey_icon = result.grey_icon
            let red_icon = result.red_icon
            GM_setValue('green_icon', green_icon)
            GM_setValue('green_icon1', green_icon1)
            GM_setValue('grey_icon', grey_icon)
            GM_setValue('red_icon', red_icon)
        }).catch((error) => {
            //alert(error)
            //console.error(error);
            console.log("can't get Icons because of ", error)
            window.location.reload(true)
        });
    }
    0 != green_icon && 0 != green_icon1 && 0 != grey_icon && 0 != red_icon || getIcons();

    function favicon(icon_base64) {
        GM_addElement(document.getElementsByTagName('head')[0], 'link', {
            href: icon_base64,
            rel: "icon",
            type: "image/png"
        });
    }

    function waitForKeyElements(t, o, e, i, n) {
        void 0 === e && (e = !0), void 0 === i && (i = 300), void 0 === n && (n = -1);
        var r = "function" == typeof t ? t() : document.querySelectorAll(t),
            u = r && 0 < r.length;
        u && r.forEach(function(t) {
            var e = "data-userscript-alreadyFound";
            t.getAttribute(e) || !1 || (o(t) ? u = !1 : t.setAttribute(e, !0))
        }), 0 === n || u && e || (--n, setTimeout(function() {
            waitForKeyElements(t, o, e, i, n)
        }, i))
    }

    function OnPhone() {
        0 == GM_getValue("OnPhone", !1) ? GM_setValue("OnPhone", !0) : GM_setValue("OnPhone", !1);
        window.location.reload()
    };

    function AllowToSendEmail() {
        0 == GM_getValue("AllowToSendEmail", !1) ? GM_setValue("AllowToSendEmail", !0) : GM_setValue("AllowToSendEmail", !1);
        window.location.reload()
    };

    function Bypass() {
        0 == GM_getValue("Bypass", !1) ? GM_setValue("Bypass", !0) : GM_setValue("Bypass", !1);
        GM_setValue("already_sent", !1);
        window.location.reload()
    }

    function getSimilarWord(word, knownWords, _threshold = 0.3) {
        const threshold = _threshold

        function getBigram(word) {
            let result = [];
            for (let i = 0; i < word.length - 1; i++) {
                result.push(word[i] + word[i + 1]);
            }
            return result;
        }

        function getSimilarity(word1, word2) {
            word1 = word1.toLowerCase();
            word2 = word2.toLowerCase();
            const bigram1 = getBigram(word1),
                  bigram2 = getBigram(word2);
            let similar = [];

            for (let i = 0; i < bigram1.length; i++) {
                if (bigram2.indexOf(bigram1[i]) > -1) {
                    similar.push(bigram1[i]);
                }
            }
            return similar.length / Math.max(bigram1.length, bigram2.length);
        }

        function autoCorrect(word, knownWords, similarityThreshold = threshold) {
            let maxSimilarity = 0;
            let mostSimilar = word;
            for (let i = 0; i < knownWords.length; i++) {
                let similarity = getSimilarity(knownWords[i], word);
                if (similarity > maxSimilarity) {
                    maxSimilarity = similarity;
                    mostSimilar = knownWords[i];
                }
            }
            return maxSimilarity > similarityThreshold ? mostSimilar : word;
        }
        return autoCorrect(word, knownWords)
    }

    function updateAcceptDomain() {
        fetch("https://api.yuumari.com/alpha-bypass/domains/accept")
            .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        }).then((result) => {
            //console.log(result);
            var elements = []
            for (let keys in result) {
                elements.push(...result[keys])
            }
            //console.log(elements);
            GM_setValue('domains', JSON.stringify(elements))
        }).catch((error) => {
            //alert(error)
            //console.error(error);
            console.log("can't updateAcceptDomain because of ", error)
            window.location.reload(true)
        });
    }

    function sendEmail(toname, temp_id, msg) {
        const username = "Harfho",
              from_name = "Harfho",
              to_name = toname,
              message = msg,
              accessToken = atob("NDFjYWY3YmU4MWMwMmRiODIwOWQwNGE2Njg4YWVhZWE="),
              myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "user_id": "user_oF6Z1O2ypLkxsb5eCKwxN",
            "service_id": "gmail",
            "accessToken": accessToken,
            "template_id": temp_id,
            "template_params": {
                "username": username,
                "from_name": from_name,
                "to_name": to_name,
                "message": message
            }
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://api.emailjs.com/api/v1.0/email/send", requestOptions)
            .then(response => response.text())
            .then((result) => {
            console.log(result);
        })
            .catch(error => console.log('error', error));
    }

    function update_DontOpen(linkName) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://gist.github.com/Harfho/" + gist_id + "/raw/_DontOpen.txt?timestamp=' + (+new Date())",
            revalidate: false,
            nocache: true,
            onload: getDontOpen
        })

        function getDontOpen(response) {
            let getDontOpen = response.responseText.replace(/'|"|\[|\]/ig, '').split(',').filter(e => e);
            var _DontOpen = getDontOpen.map(item => item.replace(/'/ig, '"').toLowerCase())
            console.log(_DontOpen, linkName)
            var access_token = atob('Z2hwXzFVMGhPMTFodTZ6eWxaZ0hMWW5qWFdMTjE1d3V5NjBZN0l6Rw==') //github access gist-Token
            access_token = "Bearer " + access_token
            //console.log(access_token)
            const myHeaders = new Headers({
                "accept": "application/vnd.github.v3+json",
                'Authorization': access_token,
                "Content-Type": "application/json"
            })
            if (linkName && !(new RegExp(linkName, 'ig').test(_DontOpen))) { //if the shortlink is not among _DontOpen before
                _DontOpen.push(linkName.toLowerCase())
                var raw = JSON.stringify({
                    "files": {
                        "_DontOpen.txt": {
                            "content": JSON.stringify(_DontOpen)
                        }
                    }
                }),
                    requestOptions = {
                        method: 'PATCH',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };
                fetch("https://api.github.com/gists/" + gist_id, requestOptions)
                    .then(response => response.text())
                    .then((result) => {
                    console.log('Done', _DontOpen);
                }) //console.log(result)
                    .catch((error) => {
                    console.log('error', error);
                });

                let toname = "Yuumari.com",
                    temp_id = "shortlinks_vicissitude",
                    pattern = linkCantBypass.replace(/http.*:\/\/|\./ig, ' '),
                    yuumari_pattern = pattern.insert(pattern.indexOf("/"), " "),
                    msg = "Cant Bypass " + linkCantBypass + " because api return with " + messageError + "\nYummari pattern=" + yuumari_pattern
                sendEmail(toname, temp_id, msg);
                msg = linkName + " " + messageError + " and was added to _DontOpen list on gist";
                GM_notification({
                    title: '!Bypass-- ' + linkCantBypass,
                    text: msg,
                    timeout: 10000,
                    ondone: () => {},
                });
                setTimeout(() => {
                    window.close()
                }, 5000)
            } else {
                let msg = linkName + " is Already added to _DontOpen because api return with " + messageError;
                GM_notification({
                    title: '!Bypass-- ' + linkCantBypass,
                    text: msg,
                    timeout: 10000,
                    ondone: () => {},
                });
                //console.log('Already added to _DontOpen')console.log('Updating shortlinks Lists')
                updateAcceptDomain()
                setTimeout(() => {
                    window.close()
                }, 5000)
            }
        }
    }

    function getDomainOrPathNameAndUpdate(link, toupdate) { //toupdate=(dontopen,delaypage,unsupported url)
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://gist.github.com/Harfho/" + gist_id + "/raw/shortlinks_name.txt?timestamp=' + (+new Date())",
            revalidate: false,
            nocache: true,
            onload: get_Shortlinks
        }, )

        function get_Shortlinks(response) {
            let pathname, ref, ex_link;
            let get_shortlinks_name = response.responseText.replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
            let shortlinks_name = get_shortlinks_name.map(item => item.replace(/'/ig, '"').toLowerCase()).sort();
            let url = window.location.href.toLowerCase(),
                page_title = document.title.toLowerCase().trim(),
                hostname = new URL(link).host, //get hostname
                urlsplice = url.split('/').splice(2, 2),
                shortner_name = GM_getValue('shortner_name').replace(/\s/g, ''),
                previous_shortner_name = GM_getValue('previous_shortner_name'),
                similardomain = getSimilarWord(urlsplice[0], shortlinks_name);
            if (document.referrer && !(/.*auto.*/ig.test(document.referrer))) {
                ref = new URL(document.referrer).host
            }
            if (ref) {
                ex_link = [ref, urlsplice[0], urlsplice[1], page_title, hostname, shortner_name, similardomain, similardomain, previous_shortner_name, ]
            } else {
                ex_link = [urlsplice[0], urlsplice[1], page_title, hostname, , shortner_name, similardomain, previous_shortner_name, ]
            }
            //console.log(shortlinks_name)
            //console.log(ex_link)
            let found = ex_link.filter((r) => {
                let sr = getSimilarWord(r.toLowerCase(), shortlinks_name)
                console.log(r)
                return shortlinks_name.includes(sr)
            })
            found = [...new Set(found)]
            console.log(found)
            var getfound = null
            found.find((i) => {
                let f = getSimilarWord(i.toLowerCase(), shortlinks_name)
                getfound = f
                console.log(f)
                return shortlinks_name.includes(f)
            })
            if (getfound) {
                pathname = getfound
                if (/.*dontopen.*/ig.test(toupdate)) {
                    pathname = getSimilarWord(pathname, shortlinks_name)
                    update_DontOpen(pathname)
                } else if (/.*unsupported url.*/ig.test(toupdate) && shortlinks_name.includes(pathname)) {
                    messageError = toupdate + "\nor\nshortlink url was changed";
                    linkCantBypass = link
                    update_DontOpen(pathname)
                }
            } else {
                hostname = hostname.toLowerCase()
                if (/dontopen/ig.test(toupdate)) {
                    hostname = getSimilarWord(hostname, shortlinks_name, 0.4)
                    update_DontOpen(hostname)
                } else if (/.*unsupported url.*/ig.test(toupdate) && shortlinks_name.includes(hostname)) {
                    messageError = toupdate + "\nor\nshortlink url was changed";
                    linkCantBypass = link
                    update_DontOpen(hostname)
                }
            }
        }
    }

    function update_Accesskey() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://gist.githubusercontent.com/Harfho/d4805d8a56793fa59d47e464c6eec243/raw/keyEncode.txt",
            revalidate: false,
            nocache: true,
            onload: (r) => {
                let accesskey = r.responseText
                GM_setValue('accesskey', JSON.stringify(accesskey));
                console.log(atob(GM_getValue('accesskey').match(/\w*/gi).filter(e => "" != e)[0]))
            },
            onerror: (r) => {}
        })
    }
    if (GM_getValue('accesskey', false) == false) {
        update_Accesskey()
    }

    //bypass the link
    function bypass(link) {
        favicon(green_icon)
        let urlhost = new URL(link).host
        document.title = urlhost
        GM_setValue('previousHost', urlhost)
        const key = atob(GM_getValue('accesskey').match(/\w*/gi).filter(e => "" != e)[0]),
              baseUrl = 'https://api.yuumari.com/alpha-bypass/',
              u = key, //Access Key;
              l = link;
        fetch(baseUrl, {
            method: 'POST',
            body: new URLSearchParams({
                u,
                l
            })
        }).then(response => {
            console.log(response.status)
            if (!response.ok) {
                console.log("Network response was not OK - HTTP status " + response.status);
                throw new Error("Network response was not OK - HTTP status " + response.status);
            }
            return response.json()
        }).then((data) => {
            let message = data.message
            if (!message) { //if api return with a result
                sessionStorage.removeItem('tryagain')
                window.location.href = data.result;
            } else { //api return with a message
                favicon(green_icon1)
                let tryagain;
                tryagain = sessionStorage.getItem('tryagain')
                if (sessionStorage.getItem('tryagain') == null) {
                    sessionStorage.setItem('tryagain', 1);
                    tryagain = sessionStorage.getItem('tryagain')
                }
                if (parseInt(tryagain) <= retry) {
                    sessionStorage.setItem('tryagain', parseInt(tryagain) + 1);
                    setTimeout(() => {
                        window.location.reload(true)
                    }, 2000)
                } else { //can't bypass the link after retrying
                    let urlhost = new URL(l).host
                    sessionStorage.removeItem('tryagain')
                    console.log(data.message)
                    let check = "pattern changed|unsupported domain|not found|invalid path|invalid domain|failed to get document"
                    if (new RegExp(check, 'ig').test(message)) {
                        messageError = message;
                        linkCantBypass = link
                        getDomainOrPathNameAndUpdate(link, 'dontopen') //getDomain Or PathName And Update _DontoOpen with it
                    } else if (/ticket.*expired/ig.test(message)) { // if api key is expired
                        if (GM_getValue('AllowToSendEmail', false)) {
                            let toname = "Harfho",
                                temp_id = "api_issue",
                                msg = message + "==Get New API key previous api key as expired";
                            update_Accesskey()
                            sendEmail(toname, temp_id, msg)
                        } else {
                            update_Accesskey()
                            setTimeout(() => {
                                window.close()
                            }, 5000)
                        }
                    } else if (/ticket.*locked/ig.test(message)) {
                        let after24h = new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleString()
                        GM_setValue('after24h', after24h)
                        GM_setValue('Bypass', false)
                        //alert(message + "You have use more than 2 IPs to access Yuumari.com,Wait for 24Hour for API key to continue working")
                        if (GM_getValue('AllowToSendEmail', false)) {
                            let toname = "Harfho",
                                temp_id = "api_issue",
                                msg = message + "You have use more than 2 IPs to access Yuumari.com,Wait for 24Hour '(" + after24h + ")' for API key to continue working";
                            if (GM_getValue('already_sent', false) == false) {
                                sendEmail(toname, temp_id, msg);
                                GM_setValue('already_sent', true)
                            };
                        } else {
                            GM_setValue('already_sent', false)
                            console.log(message + "You have use more than 2 IPs to access Yuumari.com,Wait for 24Hour '(" + after24h + ")' for API key to continue working")
                            window.close()
                        }
                    } else if (/leeched max count/ig.test(message)) {
                        let msg = message + "The limit on the number of requests has exceeded 2 queries per 1sec."
                        console.log(msg)
                        setTimeout(() => {
                            window.location.reload(true)
                        }, 1000)
                    } else {
                        let msg = message + "--" + link
                        GM_notification({
                            title: '!Bypass-- ' + urlhost,
                            text: msg,
                            timeout: 10 * 1000,
                            ondone: () => {
                                window.close()
                            },
                        });
                        GM_setClipboard(link, {
                            type: 'text/plain'
                        })
                        window.close()
                    }
                }
            }
        }).catch((error) => {
            favicon(red_icon)
            console.error(error);
            let urlhost = new URL(link).host
            console.log("can't bypass " + urlhost + " because of", error)
            //alert(error)
            let recheck;
            recheck = sessionStorage.getItem('recheck')
            if (sessionStorage.getItem('recheck') == null) {
                sessionStorage.setItem('recheck', 1);
                recheck = sessionStorage.getItem('recheck')
            }
            if (parseInt(recheck) <= retry) {
                sessionStorage.setItem('recheck', parseInt(recheck) + 1);
                setTimeout(window.location.reload(true), 5000)
            } else {
                favicon(red_icon)
                document.title = error + ":" + new URL(link).host
                sessionStorage.removeItem('recheck')
                window.location.close()

            }
        });
    }

    //autofaucet.dutcycorp.space
    function shortenerDown(element) {
        let shortner_down = /.*This shortener is down right now.*/ig.test(element.textContent.toLowerCase())
        //alert(shortner_down)
        if (shortner_down) {
            messageError = 'This shortener is down right now'
            if (document.referrer) {
                update_DontOpen(document.referrer)
            } else {
                update_DontOpen(GM_getValue("shortner_name"))
            }
        } else {
            window.close();
        }
    }

    function quick_bypass(link){
        let title = new URL(link).host
        let timer = (x) => {
            if (x == 0){
                window.location.href=link;
                return
            };
            document.title = x +'--'+ title;
            return setTimeout(() => {
                timer(--x)
            }, 1000)
        }
        let randInt=(min,max)=>{return Math.floor(Math.random() * (max - min + 1) ) + min;}
        let duration= randInt(0)
        timer(duration)
    }
    //main
    GM_registerMenuCommand("OnPhone-" + GM_getValue('OnPhone', false), OnPhone, "OnPhone");
    GM_registerMenuCommand("AllowToSendEmail-" + GM_getValue('AllowToSendEmail', false), AllowToSendEmail, "AllowToSendEmail");
    GM_registerMenuCommand("Bypass-" + GM_getValue('Bypass', true), Bypass, "Bypass");
    //alert(GM_getValue("after24h"))
    let t = new Date(Date.parse((new Date).toLocaleString())),
        to_day = parseInt([t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds()].join("")),
        pr = new Date(Date.parse(GM_getValue("after24h"))),
        pre_day = parseInt([pr.getMonth(), pr.getDate(), pr.getHours(), pr.getMinutes(), pr.getSeconds()].join("")),
        to_greaterthan_pre = to_day >= pre_day;
    //alert(to_day+'>='+pre_day+" "+to_greaterthan_pre)
    GM_getValue("after24h") != (new Date).toLocaleString() && !to_greaterthan_pre || (GM_setValue("after24h", ""), GM_setValue("Bypass", !0), GM_setValue("already_sent", !1));
    if (0 == GM_getValue("Bypass", !0)) throw new Error("!! Stop JS, You have use more than 2 IPs to access Yuumari.com !!");
    GM_setValue("Bypass", !0)
    if (!listOfAcceptDomains) {
        updateAcceptDomain()
    } else if (listOfAcceptDomains.includes(window.location.host) && !(/\/===$/.test(window.location.href))) {
        //alert(window.location.host)
        let link = window.location.href
        document.title = new URL(link).host
        bypass(link)
    } else if (/\/===$/.test(window.location.href)) {
        if(/megaurl.in\/delay=/.test(window.location.href)){
            let link = window.location.pathname.replace(/.*delay=/, '').replace(/\/===/ig, ''); //get the exact link to quick_bypass
            quick_bypass(link)
        }
        else if (/megaurl.in\/bypass=/.test(window.location.href)) {
            let link = window.location.pathname.replace(/.*bypass=/, '').replace(/\/===/ig, ''); //get the exact link to pass to bypasser
            document.title = new URL(link).host;
            bypass(link)
        } else {
            let link = window.location.href.replace(/\/===/ig, '');
            bypass(link)
        }
    } //autofaucet.dutcycorp.space
    else if (new RegExp(dutchy + '/dashboard.php.*', 'ig').test(window.location.href)) {
        localStorage.removeItem("close");
        localStorage.clear();
    } else if (new RegExp('.*shortlinks-wall.php\\?antibot_failed.*', 'ig').test(window.location.href)) {
        window.close();
        window.close()
    } else if (new RegExp('.*shortlinks-wall.php\\?down=.*', 'ig').test(window.location.href)) {
        waitForKeyElements("#toast-container", (element) => {
            shortenerDown(element)
        });
    } else if (new RegExp(dutchy + '/shortlinks-wall.php', 'ig').test(window.location.href)) {
        GM_addValueChangeListener('shortner_name', function(name, old_value, new_value, remote) {
            GM_setValue('shortner_name', new_value)
            GM_setValue('previous_shortner_name', old_value)
        });
        document.onclick = function(event) {
            if (event === undefined) event = window.event;
            var target = 'target' in event ? event.target : event.srcElement;
            if (/claim/ig.test(target.textContent)) {
                let linkName = target.parentElement.parentElement.innerText.replace(/\n.*/g, "").trim()
                GM_setValue('shortner_name', linkName);
                console.log(linkName);
            }
            true == localStorage.getItem("close") && window.close()
            //if (GM_getValue('OnPhone', false)){window.close()}
        }; //get shortlink name when click
    } else if (new RegExp(dutchy, 'ig').test(window.location.href)) {
        if(/Attention Required'/ig.test(document.title)){
            window.location.reload()
        }
        console.log("Bypass Can't Run on this Page")
    } else {
        favicon(grey_icon)
        let link = window.location.href
        getDomainOrPathNameAndUpdate(link, 'unsupported url');
        updateAcceptDomain()
    }
