(function() {
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href)
    } //to prevent resubmit on refresh and back button
    //---------------------------------------------------------//
    GM_addValueChangeListener('shortner_name', function(name, old_value, new_value, remote) {
        GM_setValue('shortner_name', new_value);
        GM_setValue('previous_shortner_name', old_value);
    })
    var messageError, linkCantBypass,invalid,
        //var location = window.location
        listOfAcceptDomains = GM_getValue('domains', ''),
        retry1 = 3,
        retry2 = 5,
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
            window.location=window.location.href
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
        window.location=window.location.href
    };

    function AllowToSendEmail() {
        0 == GM_getValue("AllowToSendEmail", !1) ? GM_setValue("AllowToSendEmail", !0) : GM_setValue("AllowToSendEmail", !1);
        window.location=window.location.href
    };

    function Bypass() {
        0 == GM_getValue("Bypass", !1) ? GM_setValue("Bypass", !0) : GM_setValue("Bypass", !1);
        GM_setValue("already_sent", !1);
        window.location=window.location.href
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
            if(invalid){
                updateAcceptDomain()
            }
            else{setTimeout(() => {
                window.close()
            }, 1000)}
        })
            .catch(error => console.log('error', error));
    }

    function update_DontOpen(linkName) {
        if (/autofaucet.dutchycorp.space/ig.test(linkName)) {
            console.log("can't add link to dontopen")
            window.close()
        }
        else {
            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://gist.github.com/Harfho/" + gist_id + "/raw/_DontOpen.txt?timestamp=" + (+new Date()),
                revalidate: false,
                nocache: true,
                onload: getDontOpen
            })
            function getDontOpen(response) {
                let getDontOpen = response.responseText.replace(/'|"|\[|\]/ig, '').split(',').filter(e => e);
                var _DontOpen = getDontOpen.map(item => item.replace(/'/ig, '"').toLowerCase())
                //console.log(_DontOpen, linkName)
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
                        console.log('Done', _DontOpen)
                        let toname = "Yuumari.com",
                            temp_id = "shortlinks_vicissitude",
                            pattern = linkCantBypass.replace(/http.*:\/\/|\./ig, ' '),
                            yuumari_pattern = pattern.insert(pattern.indexOf("/"), " "),
                            msg = `Cant Bypass URL ${linkCantBypass}
                                  SNAME- ${linkName}
                                  because api return with ${messageError}
                                  Yummari pattern="${yuumari_pattern}`
                        sendEmail(toname, temp_id, msg);
                    }) //console.log(result)
                        .catch((error) => {
                        console.log('error', error);
                        window.close()
                    });
                }
                else {
                    let msg = "SNAME-" + linkName + "\n URL-" + linkCantBypass + "\n is Already added to _DontOpen";
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
    }

    function getDomainOrPathNameAndUpdate(link =sessionStorage.getItem('shortner_name'), toupdate = 'unsupported url') { //toupdate=(dontopen,delaypage,unsupported url)
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://gist.github.com/Harfho/" + gist_id + "/raw/shortlinks_name.txt?timestamp=" + (+new Date()),
            revalidate: false,
            nocache: true,
            onload: get_Shortlinks,
            onerror:(r)=>{messageError = `${messageError}-(${toupdate})  \nor\nshortlink url was changed;`;
                          update_DontOpen(link)
                         }
        }, )

        function get_Shortlinks(response) {
            let pathname, ref, ex_link, hostname;
            let get_shortlinks_name = response.responseText.replace(/'|"|\[|\]|\s/ig, '').split(',').filter(e => e);
            let shortlinks_name = get_shortlinks_name.map(item => item.replace(/'/ig, '"').toLowerCase()).sort();
            try {
                hostname = new URL(link).host
            } catch (e) {
                hostname = document.title.toLowerCase().replace(/\d{1,}.|\(page.*|\s/ig, '').trim()
            }; //get hostname
            let url = window.location.href.toLowerCase(),
                page_title = document.title.toLowerCase().replace(/\d{1,}.|\(page.*|\s/ig, '').trim(),
                urlsplice = url.split('/').splice(2, 2),
                shortner_name = GM_getValue('shortner_name').replace(/\s/g, ''),
                previous_shortner_name = GM_getValue('previous_shortner_name'),
                similardomain = getSimilarWord(urlsplice[0], shortlinks_name);
            if (document.referrer && /.*dutchycorp.*/ig.test(document.referrer) == false) {
                ref = new URL(document.referrer).host
                ex_link = [sessionStorage.getItem('shortner_name'), page_title, urlsplice[0], urlsplice[1], hostname, shortner_name, similardomain, previous_shortner_name,ref]
            } else {
                ex_link = [sessionStorage.getItem('shortner_name'),page_title, urlsplice[0], urlsplice[1], hostname, shortner_name, similardomain, previous_shortner_name, ]
            }
            //console.log(shortlinks_name)
            //console.log(ex_link)
            let found = ex_link.filter((r) => {
                try {
                    let sr = getSimilarWord(r.toLowerCase(), shortlinks_name)
                    //console.log(r,sr)
                    return shortlinks_name.includes(sr)
                } catch (err) {
                    null
                }
            })
            found = [...new Set(found)]
            console.log(found)
            var getfound = null
            found.find((i) => {
                Array.prototype.sample = function() {
                    return this[Math.floor(Math.random() * this.length)];
                }
                i=i.replace(/\./ig,'').toLowerCase();
                let f = getSimilarWord(i.toLowerCase(), shortlinks_name, [.3, .4].sample())
                getfound = f
                console.log('final = ' + f)
                return shortlinks_name.includes(f)
            })
            if (getfound) {
                pathname = getfound
                if (/.*dontopen.*|.*down.*/ig.test(toupdate)) {
                    pathname = getSimilarWord(pathname, shortlinks_name);
                    messageError = `${messageError}-(${toupdate})`;
                    update_DontOpen(pathname);
                } else if (/.*unsupported url.*/ig.test(toupdate) && shortlinks_name.includes(pathname)) {
                    messageError = `${messageError}-(${toupdate})  \nor\nshortlink url was changed;`;
                    linkCantBypass = link;
                    update_DontOpen(pathname);
                }
            } else {
                hostname = hostname.toLowerCase()
                if (/dontopen|.*down.*/ig.test(toupdate)) {
                    hostname = getSimilarWord(hostname, shortlinks_name, 0.4);
                    messageError = `${messageError}-(${toupdate})`;
                    update_DontOpen(hostname);
                } else if (/.*unsupported url.*/ig.test(toupdate) && shortlinks_name.includes(hostname)) {
                    messageError = `${messageError}-(${toupdate})  \nor\nshortlink url was changed;`;
                    linkCantBypass = link;
                    update_DontOpen(hostname);
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

    function title(link=window.location.href){
        if (window.performance) {
            console.info("window.performance works fine on this browser");
        }
        console.info(performance.navigation.type);
        if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
            console.info( "This page is reloaded" );
            console.log(sessionStorage.getItem('shortner_name'))
        }
        else {
            console.info( "This page is not reloaded");
            sessionStorage.setItem('shortner_name',GM_getValue('shortner_name'))
        }
        let host = new URL(link).host;
        let links=[String(sessionStorage.getItem('shortner_name')).toLowerCase(),
                   GM_getValue('shortner_name').toLowerCase(),
                   GM_getValue('previous_shortner_name').toLowerCase()];
        let closestlink = getSimilarWord(host, links,0.3);
        if(host===closestlink ){
            let uselink = sessionStorage.getItem('shortner_name')||GM_getValue('shortner_name');
            document.title = uselink
            return uselink
        }else{
            document.title =closestlink
            return closestlink
        }
    }

    //bypass the link
    function bypass(link) {
        link=link.replace(/.+:/,'https:');
        favicon(green_icon)
        let urlhost = new URL(link).host
        title(link)
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
        })
            .then((data) => {
            let message = data.message
            if (!message) { //if api return with a result
                sessionStorage.removeItem('tryagain')
                window.location.href = new URL(data.result)
                return
            } else { //api return with a message
                let tryagain;
                let check;
                tryagain = sessionStorage.getItem('tryagain')
                check = "pattern changed|unsupported domain|invalid domain"
                if (new RegExp(check, 'ig').test(message)) {
                    messageError = message;
                    linkCantBypass = link
                    getDomainOrPathNameAndUpdate(link,) //getDomain Or PathName And Update _DontoOpen with it
                }
                if (/ticket.*expired/ig.test(message)) { // if api key is expired
                    if (GM_getValue('AllowToSendEmail', false)) {
                        let toname = "Harfho",
                            temp_id = "api_issue",
                            msg = `${message}==Get New API key,previous api key(${key}) as expired`;
                        update_Accesskey()
                        sendEmail(toname, temp_id, msg)
                    }
                    else {
                        update_Accesskey()
                        setTimeout(() => {
                            window.close()
                        }, 5000)
                    }
                }
                else if (/ticket.*locked/ig.test(message)) {
                    let after24h = GM_getValue('after24h',false)||new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toLocaleString();
                    GM_setValue('after24h', after24h);
                    GM_setValue('Bypass', false);
                    if (GM_getValue('AllowToSendEmail', false)) {
                        let toname = "Harfho",
                            temp_id = "api_issue",
                            msg = message + `You have use more than 2 IPs to access Yuumari.com,Wait for 24Hour ${after24h } for API key to continue working`;
                        if (GM_getValue('already_sent', false) == false) {
                            GM_setValue('already_sent', true)
                            sendEmail(toname, temp_id, msg);
                        }
                        else {
                            let msgs = message + `You have use more than 2 IPs to access Yuumari.com,Wait for 24Hour ${after24h } for API key to continue working`;
                            console.log(msgs)
                            GM_notification({
                                title: '!Bypass-- ' + linkCantBypass,
                                text: msgs,
                                timeout: 5000,
                                ondone: () => {window.close()
                                              },
                            });
                        }
                    }
                    else {
                        GM_setValue('already_sent', false)
                        let msgs = message + `You have use more than 2 IPs to access Yuumari.com,Wait for 24Hour ${after24h } for API key to continue working`;
                        console.log(msgs)
                        GM_notification({
                            title: '!Bypass-- ' + linkCantBypass,
                            text: msgs,
                            timeout: 5000,
                            ondone: () => {window.close()},
                        });
                        window.close()
                    }
                }
                else if (/exceeded/ig.test(message)) {
                    let msg = message + "The limit on the number of requests has exceeded 2 queries per 1sec."
                    console.log(msg)
                    setTimeout(() => {
                        window.location.reload(true)
                    }, 3000)
                }
                else {
                    let urlhost = new URL(l).host
                    if (sessionStorage.getItem('tryagain') == null) {
                        sessionStorage.setItem('tryagain', 1);
                        tryagain = sessionStorage.getItem('tryagain')
                    }
                    if (parseInt(tryagain) <= retry1) {
                        sessionStorage.setItem('tryagain', parseInt(tryagain) + 1);
                        setTimeout(() => {
                            window.location.reload(true)
                        }, 3000)
                    }
                    //can't bypass the link after retrying
                    check = "not found|failed to get document|invalid path"
                    if (new RegExp(check, 'ig').test(message)) {
                        messageError = message;
                        linkCantBypass = link
                        console.log(messageError)
                        //getDomainOrPathNameAndUpdate(link, 'dontopen') //getDomain Or PathName And Update _DontoOpen with it
                        //window.close()
                    }
                    else{sessionStorage.removeItem('tryagain')
                         console.log(data.message)
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
                         console.log(message)
                         window.close()
                        }
                }
            }
        })
            .catch((error) => {
            if(/Failed to fetch/ig.test(error)){
                favicon(red_icon)
                console.error(error);
                let urlhost = new URL(link).host
                console.log("can't bypass " + urlhost + " because of", error)
                let recheck;
                recheck = sessionStorage.getItem('recheck')
                if (sessionStorage.getItem('recheck') == null) {
                    sessionStorage.setItem('recheck', 1);
                    recheck = sessionStorage.getItem('recheck')
                }
                if (parseInt(recheck) <= retry2) {
                    favicon(red_icon)
                    sessionStorage.setItem('recheck', parseInt(recheck) + 1);
                    setTimeout(window.location.reload(true), 5000)
                }
                else {
                    favicon(red_icon)
                    document.title = error + ":" +title(link)
                    sessionStorage.removeItem('recheck')
                    window.location.reload(true)
                    //window.close()

                }
            }
            else{console.log(error)}
        });
    }

    function quick_bypass(link) {
        title(link)
        let title = title(link)
        let timer = (x) => {
            if (x == 0) {
                window.location.href = new URL(link);
                return
            };
            document.title = x + '--' + title;
            return setTimeout(() => {
                timer(--x)
            }, 1000)
        }
        timer(0)
    }
    //main
    GM_registerMenuCommand("OnPhone-" + GM_getValue('OnPhone', false), OnPhone, "OnPhone");
    GM_registerMenuCommand("AllowToSendEmail-" + GM_getValue('AllowToSendEmail', false), AllowToSendEmail, "AllowToSendEmail");
    GM_registerMenuCommand("Bypass-" + GM_getValue('Bypass', true), Bypass, "Bypass");
    //autofaucet.dutcycorp.space
    if (/.+shortlinks-wall.php(?:\?r=s)?$/ig.test(window.location.href)) {
        // GM_addValueChangeListener('shortner_name', function(name, old_value, new_value, remote) {
        //     GM_setValue('shortner_name', new_value)
        //     GM_setValue('previous_shortner_name', old_value)
        // });
        document.onclick = function(event) {
            if (event === undefined) event = window.event;
            var target = 'target' in event ? event.target : event.srcElement;
            if (/claim/ig.test(target.textContent)) {
                let linkName = target.parentElement.parentElement.innerText.replace(/\n.*/g, "").trim()
                GM_setValue('shortner_name', linkName);
                console.log(linkName);
            }
            //if (GM_getValue('OnPhone', false)){window.close()}
        }; //get shortlink name when click
    }
    let t = new Date(Date.parse((new Date).toLocaleString())),
        to_day = parseInt([t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds()].join("")),
        pr = new Date(Date.parse(GM_getValue("after24h"))),
        pre_day = parseInt([pr.getMonth(), pr.getDate(), pr.getHours(), pr.getMinutes(), pr.getSeconds()].join("")),
        to_greaterthan_pre = to_day >= pre_day;
    //alert(to_day+'>='+pre_day+" "+to_greaterthan_pre)
    GM_getValue("after24h") != (new Date).toLocaleString() && !to_greaterthan_pre || (GM_setValue("after24h", ""), GM_setValue("Bypass", !0), GM_setValue("already_sent", !1));
    if (0 == GM_getValue("Bypass", !0)){
        title(window.location.href);
        throw new Error("!! Stop JS, You have use more than 2 IPs to access Yuumari.com !!");}
    GM_setValue("Bypass", !0)
    if (!listOfAcceptDomains) {
        updateAcceptDomain()
    }
    else if (listOfAcceptDomains.includes(window.location.host) && !(/\/===$/.test(window.location.href))) {
        //alert(window.location.host)
        let link = window.location.href
        bypass(link)
    }
    else if (/\/===$/.test(window.location.href)) {
        if (/megaurl.in\/delay=/.test(window.location.href)) {
            let link = window.location.pathname.replace(/.*delay=|\/===/ig, ''); //get the exact link to quick_bypass
            quick_bypass(link)
        } else if (/megaurl.in\/bypass=/.test(window.location.href)) {
            let link = window.location.pathname.replace(/.*bypass=|\/===/ig, ''); //get the exact link to pass to bypasser
            bypass(link)
        } else {
            let link = window.location.href.replace(/\/===/ig, '');
            bypass(link)
        }
    }
    //autofaucet.dutcycorp.space
    else if (new RegExp(dutchy, 'ig').test(window.location.href)) {
        if (/Attention Required|A timeout occurred/ig.test(document.title)) {
            window.location.reload(true)
        }
        else if (new RegExp('.*shortlinks-wall.php\\?antibot_failed.*', 'ig').test(window.location.href)) {
            window.close();
            window.close()
        }
        else if (new RegExp('.*shortlinks-wall.php\\?down=.*', 'ig').test(window.location.href)) {
            messageError = 'Shortner Down'
            sessionStorage.setItem('shortner_name',GM_getValue('shortner_name'));
            getDomainOrPathNameAndUpdate( sessionStorage.getItem('shortner_name'), 'shortenerdown');
        }
        else {
            console.log("Bypass Can't Run on this Page")
        }
    }
    else {
        invalid=true
        favicon(grey_icon)
        let link = window.location.href
        title(link)
        getDomainOrPathNameAndUpdate(title(link), 'unsupported url');
    }
})();
