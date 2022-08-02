 function OnPhone() {
        0 == GM_getValue("OnPhone", !1) ? GM_setValue("OnPhone", !0) : GM_setValue("OnPhone", !1);
        window.location.reload()
    };
    GM_registerMenuCommand("OnPhone-" + GM_getValue('OnPhone', false), OnPhone, "OnPhone");
    if("true"==localStorage.getItem("close")&&!/down=/gi.test(window.location)){
        window.close();window.close();window.close();window.close()
    }else{
        if (GM_getValue('OnPhone', false)) {
            window.close();window.close();window.close();window.close()
        }
    }
