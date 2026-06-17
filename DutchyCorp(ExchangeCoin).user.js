// ─── SharedStorage helpers (bridge already loaded via @require) ───────────────
// window.SharedStorages, getSharedStorages, setSharedStorages, deleteSharedStorages
// are all provided by the @require script. We wrap them with JSON + error handling.
const SS = {
    async get(key) {
        try {
            const res = await window.SharedStorages.send("get", key);
            const raw = res?.value ?? null;
            if (raw === null) return null;
            try { return JSON.parse(raw); } catch { return raw; }
        } catch (e) { console.warn(`[SS.get] "${key}" failed:`, e); return null; }
    },
    async set(key, value) {
        try { await window.SharedStorages.send("set", key, JSON.stringify(value)); return true; }
        catch (e) { console.warn(`[SS.set] "${key}" failed:`, e); return false; }
    },
    async del(key) {
        try { await window.SharedStorages.send("delete", key); return true; }
        catch (e) { console.warn(`[SS.del] "${key}" failed:`, e); return false; }
    },
};

// ─── Key factory — mirrors FaucetAutoWithdraw.js exactly ─────────────────────
// Pattern: `${domain}__${username}_${keyName}`
// e.g.  "autofaucet.dutchycorp.space__mikeymoranda_myanmar9_clickTargetCoin"
// Both scripts use the same USERNAME (same container), so keys match.
function makeKeys(username) {
    const domain = window.location.hostname.replace(/^www\./, '');
    const ns     = `${domain}__${username}`;
    return {
        CLICK_TARGET_COIN: `${ns}_clickTargetCoin`,
        SWAP_COIN:         `${ns}_swapCoin`,
        BALANCE_CACHE:     `${ns}_faucetPayValidBalances`,
    };
}

const CLICK_TARGET_CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour — matches FaucetAutoWithdraw

setTimeout(async () => {
    let tocoin        = "usdt";
    let EXCHANGE_COIN = 'dutchy';
    const DEBUG       = true;

    function isCloudflareVerificationPage() {
        if (document.querySelector(".h2")?.innerText.toLowerCase().includes("verify") ||
            document.querySelector("h2")?.innerText.toLowerCase().includes("verify")) {
            console.log("Turnstile Detected");
            return true;
        }
        return false;
    }
    if (isCloudflareVerificationPage()) return;

    // ── Resolve USERNAME first (same logic as FaucetAutoWithdraw) ────────────
    // ── Resolve USERNAME from container bridge only — no localStorage ────────
    const profile = await getContainerProfile();
    const USERNAME = profile?.username ?? null;
    const EMAIL    = profile?.email    ?? null;

    // ── Build namespaced keys AFTER we have USERNAME ──────────────────────────
    const KEYS = makeKeys(USERNAME);
    console.log(`[DutchyExchange] Running as: ${USERNAME} | key prefix: ${window.location.hostname}__${USERNAME}`);

    // ─────────────────────────────────────────────────────────────────────────
    function waitForKeyElements(t, o, e, i, n) {
        void 0 === e && (e = !0);
        void 0 === i && (i = 300);
        void 0 === n && (n = -1);
        const r = typeof t === "function" ? t() : document.querySelectorAll(t);
        const u = r && r.length > 0;
        if (u) r.forEach(el => {
            const attr = "data-userscript-alreadyFound";
            if (!el.getAttribute(attr)) { if (o(el) !== false) el.setAttribute(attr, true); }
        });
        if (n !== 0 && !(u && e)) {
            --n;
            setTimeout(() => {
                if (isCloudflareVerificationPage()) return;
                waitForKeyElements(t, o, e, i, n);
            }, i);
        }
    }

    function replace_par(element) {
        let addpar    = document.querySelector(".addedtoast");
        const WithBtn = document.getElementById('all_submit');
        if (!addpar) { addpar = document.createElement("p"); addpar.setAttribute('class','addedtoast'); }
        addpar.innerHTML = element.innerText.trim();
        WithBtn?.parentNode?.insertBefore(addpar, WithBtn.nextSibling);
        document.querySelector("#toast-container")?.remove();
    }

    function selectFromDropDown(elem, choose = null) {
        if (!choose || !elem) return;
        const items = [...(elem.querySelector('.dropdown-content')?.querySelectorAll('li') || [])];
        items.forEach(item => {
            if (new RegExp(choose, 'ig').test(item.textContent)) {
                DEBUG && console.log(`Picking: ${item.textContent.toUpperCase()}`);
                item.click();
            }
            elem.dispatchEvent(new Event('change'));
        });
    }

    function select(coin = "USDT", exc = EXCHANGE_COIN) {
        const targetDrop   = document.querySelector('.select-wrapper select#coin_to_receive')?.closest('.select-wrapper');
        const exchangeDrop = document.querySelector('.select-wrapper select:not(#coin_to_receive)')?.closest('.select-wrapper');
        if (!targetDrop)          { DEBUG && console.error("Target coin dropdown not found");   return; }
        if (exc && !exchangeDrop) { DEBUG && console.error("Exchange coin dropdown not found"); return; }
        if (exc)  selectFromDropDown(exchangeDrop, exc);
        if (coin) selectFromDropDown(targetDrop,   coin);
        DEBUG && console.log(`Exchanging: ${(exc||EXCHANGE_COIN).toUpperCase()} → ${coin.toUpperCase()}`);
    }

    function selectCoinOption(parsed) {
        const coin = parsed?.coin?.trim();
        if (!coin || Math.random() < 0.5) { console.log('[Selection] Using: All your Coins'); return 'All your Coins'; }
        console.log(`[Selection] Using: ${coin}`);
        return coin;
    }

    async function fill_in_and_exchange() {
        // ── Read swapCoin from SS (namespaced — this container only) ─────────
        const swapCoinRaw = await SS.get(KEYS.SWAP_COIN);

        if (swapCoinRaw !== null) {
            // swapCoin is stored as JSON.stringify(coinString) via SS.set
            // so SS.get already parsed it — it could be a plain string "LTC"
            const coinValue = typeof swapCoinRaw === 'string' ? swapCoinRaw : swapCoinRaw?.coin ?? null;
            if (coinValue) {
                EXCHANGE_COIN = selectCoinOption({ coin: coinValue });
            }
            // Delete swapCoin and clear stale balance cache so next run is fresh
            await SS.del(KEYS.SWAP_COIN);
            await SS.del(KEYS.BALANCE_CACHE);
            DEBUG && console.log(`[SS] swapCoin consumed: ${coinValue} → EXCHANGE_COIN: ${EXCHANGE_COIN}`);
        }

        select(tocoin, EXCHANGE_COIN);

        const balance      = document.querySelector("#balance_to_exchange")?.textContent.replace(/\D/ig, '') || '';
        const amount_input = document.querySelector("#amount_to_exchange");
        if (amount_input) {
            amount_input.value = balance;
            const interval = setInterval(() => {
                if (isCloudflareVerificationPage()) return;
                const msg = document.querySelector("#user_exchange") || '';
                if (msg.innerText === '') {
                    amount_input.dispatchEvent(new Event('change', { bubbles:true, cancelable:true }));
                } else {
                    clearInterval(interval);
                }
            }, 1);
        }
    }

    // ── Read clickTargetCoin from SS (namespaced — same key FaucetAutoWithdraw writes)
    async function waitForClickTargetCoin(timeout = 30000, interval = 1000) {
        // --- ADDED: Let FaucetAutoWithdraw finish cleanup and state assignment ---
        console.log("[DutchyExchange] Pausing 1000ms to allow main script state to stabilize...");
        await new Promise(resolve => setTimeout(resolve, 5000));

        const start = Date.now();
        return new Promise((resolve, reject) => {
            const check = async () => {
                try {
                    // SS.get already JSON.parses, so data is { coin, timestamp } or null
                    const data = await SS.get(KEYS.CLICK_TARGET_COIN);
                    DEBUG && console.log(`[SS] clickTargetCoin read from "${KEYS.CLICK_TARGET_COIN}":`, data);

                    if (data?.coin) {
                        const age = Date.now() - (data.timestamp || 0);
                        if (age < CLICK_TARGET_CACHE_EXPIRY) {
                            resolve(data.coin.toLowerCase());
                            return;
                        } else {
                            console.warn('[SS] clickTargetCoin expired (age:', Math.round(age/1000),'s)');
                        }
                    }
                } catch (e) { console.warn('[SS] Read error:', e); }

                if (Date.now() - start > timeout) {
                    reject(new Error(`Timeout: clickTargetCoin not found in SS key "${KEYS.CLICK_TARGET_COIN}"`));
                } else {
                    setTimeout(check, interval);
                }
            };
            check();
        });
    }

    // ── Main flow ─────────────────────────────────────────────────────────────
    waitForClickTargetCoin()
        .then((keyword) => {
        tocoin = keyword;
        DEBUG && console.log("✅ Loaded coin from SharedStorage:", tocoin, `(key: ${KEYS.CLICK_TARGET_COIN})`);
        waitForKeyElements('.select-wrapper', fill_in_and_exchange, false, 1000);
        waitForKeyElements('#user_exchange b',  replace_par, false);
        waitForKeyElements("#toast-container",  replace_par, false);
    })
        .catch(err => {
        console.warn(err.message);
        DEBUG && console.log("⚠️ Using fallback coin:", tocoin);
        waitForKeyElements('.select-wrapper', fill_in_and_exchange, false, 1000);
        waitForKeyElements('#user_exchange b',  replace_par, false);
        waitForKeyElements("#toast-container",  replace_par, false);
    });

}, 0 * 1000);
