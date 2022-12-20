// ==UserScript==
// @name         ALBypass_DDD
// @namespace    https://github.com/Acotec/autofcb
// @version      0.2.3
// @description  Bypass URL links
// @author       Acotec
// @updateURL    https://github.com/Acotec/autofcb_meta/raw/master/ALBypass.user.js
// @downloadURL  https://github.com/Acotec/autofcb_meta/raw/master/ALBypass.user.js
// @match        *://*/*
// @include      *
// @icon64       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAiCAMAAAA9FerRAAAAk1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6eSN1AAAAMHRSTlMA+AXo17f1r6iQfTkqGBMJ/OzlYDMN3MSfW0DhonlpSBzRjIp0bk4iEfC/mIVWyGRxeTntAAABfklEQVQ4y5WU15KDMAxF6S10AoEAIb1nV///dSubTfOIdh8YxvJBvjKSNFrm+vWquNIEOdmT9DbgTABTo5y3+RYA5ZSUOsjOKVCkGlBTwC1wRSE+1OHtXnM3t/sCy1HBW/EAdTrqr61V9gHmfal2mgxdWnRicx36VHVg5wr6taK5WTzAyQrJuSoM6Uzai2FQPsHl4TBnEfauMEK1iPk2jNJD4I4GjFPyhS2vMFJy8ImZw4BYG+/hWCqMl+7+FzLk6a1dOIYy9OP7lMkhmQX7b07ND8uTIlT5p24U8SIsXNcMZqD53dpJO5hS5uDZXJG9JH7PDQZyDcPF5/KefS1rj7jyqN9TxQ2+KfaLH+HKjGe8BxLFXQD0QIrFzt4xry4vJN1+ETpD0zXo3ldCZvlwwUfpU1yCcZsXSzjODRGTX3BDde2ChUkDaC6LO2caq+RNoUZ+iRGHX+mZBqOCNK7xoQSMligFCTl41jJH0g1WOpUmyAtb66ldSNNky1kv8gc+oY9OF7+D2wAAAABJRU5ErkJggg==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        window.close
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addElement
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @run-at       document-start
// @connect      api.yuumari.com
// @connect      yuumari.com
// @connect      github.com
// @connect      gist.github.com
// @connect      gist.githubusercontent.com
// @noframes
// @nocompat    Chrome
//// @require   https://github.com/Acotec/autofcb_script/raw/master/ALBypass.user.js
// ==/UserScript==
(function () {
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href)
    } //to prevent resubmit on refresh and back button
    GM_addValueChangeListener('shortner_name', function (name, old_value, new_value, remote) {
        GM_setValue('shortner_name', new_value)
        GM_setValue('previous_shortner_name', old_value)
    });
    //---------------------------------------------------------//
    var messageError, linkCantBypass,
        //var location = window.location
        listOfAcceptDomains = GM_getValue('domains', ''),
        retry = 3,
        green_icon = GM_getValue('green_icon', ''),
        green_icon1 = GM_getValue('green_icon1', ''),
        grey_icon = GM_getValue('grey_icon', ''),
        red_icon = GM_getValue('red_icon', ''),
        autoFCB = 'auto(faucet|claim|bitco).(in|org)',
        gist_id = '8f5a3bd519f0ebf94708ad624ffd76d2',
        delayOn = GM_getValue("delayOn", "[]"),
        update_delayOn = GM_getValue('update_delayOn', true);
    delayOn = JSON.parse(delayOn);

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
        u && r.forEach(function (t) {
            var e = "data-userscript-alreadyFound";
            t.getAttribute(e) || !1 || (o(t) ? u = !1 : t.setAttribute(e, !0))
        }), 0 === n || u && e || (--n, setTimeout(function () {
            waitForKeyElements(t, o, e, i, n)
        }, i))
    }

    String.prototype.insert = function(index, string) {
        if (index > 0) {
            return this.substring(0, index) + string + this.substr(index);
        }

        return string + this;
    };
    function getdelayPages() {
        //alert('getting delay page')
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://gist.github.com/Harfho/" + gist_id + "/raw/delaypage.txt?timestamp="+ (+new Date()),
            revalidate: false,
            nocache: true,
            onload: (r) => {
                let getdelaypages = r.responseText.replace(/[^\w\d.,-]/ig, '').split(',').filter(e => e),
                    delaypages = getdelaypages.map(item => item.replace(/'/ig, '"').toLowerCase());
                GM_setValue('delayOn', JSON.stringify(delaypages));
            },
            onerror: (r) => {}
        })
    }
    if (delayOn == false || update_delayOn == true) {
        GM_setValue('update_delayOn', false)
        getdelayPages()
    }

    function delayHost(link_host) {
        link_host = new URL(link_host).host
        if (delayOn.includes(link_host)) {
            return true
        }
    }

    function update_delaypage(linkhost = null) {
        var delaypage = GM_getValue('delayOn'); //getdelaypage.map(item => item.replace(/'/ig, '"').toLowerCase())
        delaypage = JSON.parse(delaypage)
        //console..log(delaypage,linkhost)
        var access_token = atob('Z2hwXzFVMGhPMTFodTZ6eWxaZ0hMWW5qWFdMTjE1d3V5NjBZN0l6Rw==') //github access gist-Token
        access_token = "Bearer " + access_token
        //console.log(access_token)
        const myHeaders = new Headers({
            "accept": "application/vnd.github.v3+json",
            'Authorization': access_token,
            "Content-Type": "application/json"
        })
        var raw = JSON.stringify({
            "files": {
                "delaypage.txt": {
                    "content": JSON.stringify(delaypage)
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
            console.log('Done', delaypage);
            //GM_setValue('update_delayOn',true);
            window.close()
        }) //console.log(result)
            .catch((error) => {
            console.log('error', error);
        });
        let msg = "push " + linkhost + " to delaypage list on github"
        GM_notification({
            title: '!Bypass-- ' + linkhost,
            text: msg,
            timeout: 10000,
            ondone: () => {},
        });
    }

    function addDelayorClose(element) {
        try {
            var referrer,
                error1052 = /.*action is marked as suspicious.*/ig.test(element.innerText.toLowerCase()),
                alreadyVisit = /.*already visited this link.*/ig.test(element.innerText.toLowerCase());
            referrer = new URL(document.referrer).host
        } catch (e) {
            referrer = ''
        }
        if (error1052) {
            //alert(error1052)
            delayOn = GM_getValue('delayOn');
            delayOn = JSON.parse(delayOn)
            let previousHost = GM_getValue('previousHost', '')
            if (referrer && delayOn.includes(referrer) == false) {
                delayOn.push(referrer)
                GM_setValue('delayOn', JSON.stringify(delayOn))
                update_delaypage(referrer)
            } else if (previousHost && delayOn.includes(previousHost) == false) {
                delayOn.push(previousHost)
                GM_setValue('delayOn', JSON.stringify(delayOn))
                update_delaypage(previousHost)
            }
        } else {
            window.close();
        }
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
            setTimeout(() => {
                window.close()
            }, 2000)
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
            GM_notification({
                title: '!Bypass-- ' + linkCantBypass,
                text: msg,
                timeout: 10000,
                ondone: () => {},
            });
            setTimeout(() => {
                window.close()
            }, 1000)
        })
            .catch(error => console.log('error', error));
    }
    function update_DontOpen(linkName) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://gist.github.com/Harfho/" + gist_id + "/raw/_DontOpen.txt?timestamp="+ (+new Date()),
            revalidate: false,
            nocache: true,
            onload: getDontOpen
        })

        function getDontOpen(response) {
            let getDontOpen = response.responseText.replace(/'|"|\[|\]/ig, '').split(',').filter(e => e);
            var _DontOpen = getDontOpen.map(item => item.replace(/'/ig, '"').toLowerCase())
            //console.log(_DontOpen,linkName)
            var access_token = atob('Z2hwXzFVMGhPMTFodTZ6eWxaZ0hMWW5qWFdMTjE1d3V5NjBZN0l6Rw==') //github access gist-Token
            access_token = "Bearer " + access_token
            //console.log(access_token)
            const myHeaders = new Headers({
                "accept": "application/vnd.github.v3+json",
                'Authorization': access_token,
                "Content-Type": "application/json"
            })
            if (linkName && !(_DontOpen.includes(linkName))) { //if the shortlink is not among _DontOpen before
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
                    let toname = "Yuumari.com",
                        temp_id = "shortlinks_vicissitude",
                        pattern = linkCantBypass.replace(/http.*:\/\/|\./ig,' '),
                        yuumari_pattern=pattern.insert(pattern.indexOf("/")," "),
                        msg = "Cant Bypass \nURL-"+linkCantBypass+"\nSNAME-"+linkName+ "\nbecause api return with " + messageError+"\nYummari pattern="+yuumari_pattern;
                    sendEmail(toname, temp_id, msg);
                }) //console.log(result)
                    .catch((error) => {
                    console.log('error', error);
                });
            } else {
                let msg = "SNAME-"+linkName+"\nURL-"+linkCantBypass+"\nis Already added to _DontOpen because api return with " + messageError;
                GM_notification({
                    title: '!Bypass-- ' + linkCantBypass,
                    text: msg,
                    timeout: 10000,
                    ondone: () => {},
                });
                //console.log('Already added to _DontOpen')console.log('Updating shortlinks Lists')
                updateAcceptDomain()
            }
        }
    }

    function getDomainOrPathNameAndUpdate(link, toupdate) { //toupdate=(dontopen,delaypage,unsupported url)
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://gist.github.com/Harfho/" + gist_id + "/raw/shortlinks_name.txt?timestamp="+ (+new Date()),
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
                shortner_name = GM_getValue('shortner_name'),
                previous_shortner_name = GM_getValue('previous_shortner_name'),
                similardomain = getSimilarWord(urlsplice[0], shortlinks_name);
            if (document.referrer&&!RegExp(autoFCB,'ig').test(document.referrer)) {
                ref = new URL(document.referrer).host
                ex_link = [ref, urlsplice[0], urlsplice[1], page_title, hostname, shortner_name, similardomain, similardomain, previous_shortner_name, ]
            }
            else {
                ex_link = [urlsplice[0], urlsplice[1], page_title, hostname, , shortner_name, similardomain, previous_shortner_name, ]
            }
            //console.log(shortlinks_name)
            console.log(ex_link)
            let found = ex_link.filter((r) => {
                let sr = getSimilarWord(r.toLowerCase(), shortlinks_name)
                console.log(r)
                return shortlinks_name.includes(sr)
            })
            found = [...new Set(found)]
            console.log(found)
            var getfound = null
            found.find((i) => {
                Array.prototype.sample = function(){return this[Math.floor(Math.random()*this.length)];}
                let f = getSimilarWord(i.toLowerCase(),shortlinks_name,[0.3,0.4].sample())
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
        link=link.replace(/.+:/,'https:');
        alert(link)
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
                let title = document.title
                let timer = (x) => {
                    if (x == 0){
                        window.location.href=new URL(data.result)
                        return
                    };
                    document.title = x + '-' + title;
                    return setTimeout(() => {
                        timer(--x)
                    }, 1000)
                }
                if (delayHost(link)){
                    let randInt=(min,max)=>{return Math.floor(Math.random() * (max - min + 1) ) + min;}
                    let duration= randInt(25,26)
                    timer(duration)
                } else {
                    timer(0)
                };
            } else { //api return with a message
                favicon(green_icon1)
                jgkugu
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

            }
        });
    }

    function quick_bypass(link){
        let title = new URL(link).host
        let timer = (x) => {
            if (x == 0){
                window.location.href=new URL(link);
                return
            };
            document.title = x +'--'+ title;
            return setTimeout(() => {
                timer(--x)
            }, 1000)
        }
        let randInt=(min,max)=>{return Math.floor(Math.random() * (max - min + 1) ) + min;}
        let duration= randInt(20,25)
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
            let link = window.location.href.replace(/.*delay=/, '').replace(/\/===/ig, ''); //get the exact link to quick_bypass
            quick_bypass(link)
        }
        else if (/megaurl.in\/bypass=/.test(window.location.href)) {
            let link = window.location.href.replace(/.*bypass=/, '').replace(/\/===/ig, ''); //get the exact link to pass to bypasser
            document.title = new URL(link).host;
            bypass(link)
        }
        else {
            let link = window.location.href.replace(/\/===/ig, '');
            bypass(link)
        }
    }
    else if (new RegExp(autoFCB + '/dashboard$', 'ig').test(window.location.href)) {
        localStorage.removeItem("close");
        localStorage.clear();
    } else if (new RegExp(autoFCB + '/dashboard/shortlinks$', 'ig').test(window.location.href)) {
        GM_addValueChangeListener('shortner_name', function (name, old_value, new_value, remote) {
            GM_setValue('shortner_name', new_value)
            GM_setValue('previous_shortner_name', old_value)
        });
        waitForKeyElements("div.alert-danger", (element) => {
            addDelayorClose(element)

        });
        "true" == localStorage.getItem("close") && (window.close());
        if (GM_getValue('OnPhone', false)) {
            window.close();
        };
        document.onclick = function (event) {
            if (event === undefined) event = window.event;
            var target = 'target' in event ? event.target : event.srcElement;
            if (new RegExp(target.innerText, 'ig').test('VISIT')) {
                let exLinkInfo = target.parentNode.parentNode.getElementsByClassName("name")[0].innerHTML.trim(),
                    linkName = exLinkInfo.replace(/(<|\s).*/, '') //exLinkInfo.replace(exLinkInfo.match(/\s*\d* .*/), "");
                GM_setValue('shortner_name', linkName);
                console.log(linkName);
            }
        }; //get shortlink name when click
    } else if (new RegExp(autoFCB, 'ig').test(window.location.host)) {
        try {
            var error = document.querySelector("#cf-error-details"),
                error1 = document.querySelector("center:nth-child(1)"),
                time = 60 * 1000;
            if ((error || error1) && (/Error 5../ig.test(error.innerText) || /503 Service Temporarily/ig.test(error1.innerText))) {
                document.title = 'R-' + document.title
                window.setTimeout(window.location.reload(true), time)
            }
        } catch (e) {}
    } else {
        favicon(grey_icon)
        let link = window.location.href
        if(/app.joinsurf.com.+login.+email/ig.test(link)){
            null
        }
        else if (GM_getValue('updateAcceptDomain', true) == true) {
            updateAcceptDomain();
            GM_setValue('updateAcceptDomain', false);
        }
        else if (GM_getValue('updateAcceptDomain') == false) {
            getDomainOrPathNameAndUpdate(link, 'unsupported url');
            GM_setValue('updateAcceptDomain', true)
        }
    }
})();
