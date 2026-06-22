(function() {
    'use strict';
    var DEBUG = false;

    // ─── SHARED STORAGE WRAPPER ──────────────────────────────────────────────
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
    };

    // ─── USERNAME RESOLUTION ──────────────────────────────────────────────────
    async function resolveUsername() {
        let username = null;
        try {
            const profile = await getContainerProfile();
            if (profile?.username) username = profile.username;
        } catch (e) { /* ignore */ }
        if (!username) {
            const stored = await SS.get('faucetpay_username');
            if (stored) username = stored;
        }
        if (!username) {
            username = prompt('Enter your FaucetPay username:');
            if (username) await SS.set('faucetpay_username', username);
        }
        return username;
    }

    // ─── BUILD KEY FACTORY ────────────────────────────────────────────────────
    function makeKeys(username) {
        const domain = window.location.hostname.replace(/^www\./, '');
        const ns = `${domain}__${username}`;
        return {
            CLICK_TARGET_COIN: `${ns}_clickTargetCoin`,
        };
    }

    // ─── GET STORED COIN ──────────────────────────────────────────────────────
    async function getStoredCoin() {
        const username = await resolveUsername();
        if (!username) return null;
        const KEYS = makeKeys(username);
        const coinData = await SS.get(KEYS.CLICK_TARGET_COIN);
        if (coinData?.coin) return coinData.coin;
        const fallback = await SS.get('clickTargetCoin');
        if (fallback) return fallback;
        return null;
    }

    // ─── CLOUDFLARE GUARD ─────────────────────────────────────────────────────
    function isCloudflareVerificationPage() {
        const h2Text = document.querySelector("h2")?.innerText.toLowerCase();
        if (h2Text && h2Text.includes("verify")) {
            console.log('Detected Cloudflare verification page');
            return true;
        }
        return false;
    }
    if (isCloudflareVerificationPage()) return;

    // ─── HELPERS ──────────────────────────────────────────────────────────────
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms || 3000));

    function replace_par(text) {
        let addpar = document.querySelector(".addedtoast");
        let WithButton = document.getElementById('all_submit');
        if (!addpar) {
            addpar = document.createElement("p");
            addpar.setAttribute('class', 'addedtoast');
        }
        addpar.innerHTML = text.trim();
        WithButton.parentNode.insertBefore(addpar, WithButton.nextSibling);
        document.querySelector("#toast-container")?.remove();
        document.querySelector("#user_exchange")?.remove();
    }

    // ─── AMOUNT EXTRACTION (ROBUST) ──────────────────────────────────────────
    function extractAmountFromBalance(element) {
        if (!element) return null;
        // Get text content (including text inside child nodes)
        const text = element.textContent || element.innerText || '';
        // Look for a number with up to 8 decimals
        const match = text.match(/([\d,]+\.?\d*)/);
        if (match) {
            // Remove commas and parse
            const amount = parseFloat(match[1].replace(/,/g, ''));
            if (!isNaN(amount) && amount > 0) return amount;
        }
        return null;
    }

    // ─── CAPTCHA SOLVERS ──────────────────────────────────────────────────────
    async function recaptchaSolution() {
        if (isCloudflareVerificationPage()) return;
        async function recaptchaSolutionv2() {
            if (grecaptcha && grecaptcha.getResponse().length > 0) {
                replace_par('Processing Withdraw');
                return grecaptcha.getResponse();
            } else {
                console.log('waiting for captcha');
                replace_par('waiting for captcha');
                await wait(1000);
                return recaptchaSolutionv2();
            }
        }
        async function recaptchaSolutionv3() {
            var token = await grecaptcha.execute('6LctglAdAAAAAJmNg2xib4UQDYI1eDK5wIUFTXY9', { action: 'submit' });
            console.log('V3 response:', token);
            return token;
        }
        try { return await recaptchaSolutionv2(); }
        catch (err) { console.log('reCAPTCHA_V2 Not exist', err); return await recaptchaSolutionv3(); }
    }

    async function hcaptchaSolution() {
        if (isCloudflareVerificationPage()) return;
        let captcha = new HCaptchaWidget();
        await captcha.isSolved();
        console.log(captcha.element.getAttribute('data-hcaptcha-response'));
        return captcha.element.getAttribute('data-hcaptcha-response');
    }

    async function iconcaptchaSolution() {
        if (isCloudflareVerificationPage()) return;
        var ic_id = document.getElementsByName('ic-hf-id')[0]?.value;
        var ic_se = document.getElementsByName('ic-hf-se')[0]?.value;
        if (ic_id && ic_se) {
            replace_par('Processing Withdraw');
            return {
                "_iconcaptcha-token": document.getElementsByName('_iconcaptcha-token')[0]?.value,
                "ic-hf-se": ic_se,
                "ic-hf-id": ic_id,
                "ic-hf-hp": document.getElementsByName('ic-hf-hp')[0]?.value
            };
        } else {
            console.log('waiting for icon_captcha');
            replace_par('waiting for icon_captcha');
            await wait(1000);
            return iconcaptchaSolution();
        }
    }

    // ─── WITHDRAW LOGIC ──────────────────────────────────────────────────────
    async function withdrawCoin(coin = "", amount = "", method = "") {
        console.log('@withdrawCoin', coin, amount, method);

        // Find the balance element
        const balanceEl = document.querySelector('#balance_to_receive');
        if (!balanceEl) {
            replace_par('Balance element not found');
            console.error('Balance element #balance_to_receive not found');
            return;
        }

        // Extract amount
        let extractedAmount = extractAmountFromBalance(balanceEl);
        if (extractedAmount === null) {
            // If not found, retry after a short delay (page might still be loading)
            await wait(1000);
            extractedAmount = extractAmountFromBalance(balanceEl);
        }

        if (extractedAmount === null || extractedAmount <= 0) {
            replace_par('Could not determine balance amount');
            console.warn('Balance amount extraction failed');
            return;
        }

        // Use extracted amount if not provided
        if (!amount || amount === '') amount = extractedAmount.toString();

        // Use stored coin if not provided (already set from button data)
        // The coin is passed from the button's data-coin attribute.
        // If still empty, try to get from stored coin.
        if (!coin) {
            const stored = await getStoredCoin();
            if (stored) coin = stored;
        }

        if (!method) method = `chain_w1_${coin}`;

        console.log(`Withdrawing ${amount} ${coin} with method ${method}`);
        replace_par(`Withdrawing ${amount} ${coin}...`);

        // Call the withdrawal function
        easyWithdrawal(coin, amount, method);
    }

    async function easyWithdrawal(coin, amount, method) {
        console.log('@easyWithdrawal', coin, amount, method);
        if (isCloudflareVerificationPage()) return;

        function detectCaptchaType() {
            if (document.querySelector('div[data-sitekey], iframe[src*="google.com/recaptcha/api.js"]')) return 'reCAPTCHA';
            if (document.querySelector('.iconcaptcha-container') || document.querySelector('.iconcaptcha-modal__body')) return 'IconCaptcha';
            if (document.querySelector('.hcaptcha-container, iframe[src*="hcaptcha.com/1/api.js"]')) return 'hCaptcha';
            return 'reCAPTCHA';
        }

        async function getCaptchaSolution() {
            const captchaType = detectCaptchaType();
            console.log('Captcha type:', captchaType);
            switch (captchaType) {
                case 'reCAPTCHA': return await recaptchaSolution();
                case 'hCaptcha': return await hcaptchaSolution();
                case 'IconCaptcha': return await iconcaptchaSolution();
                default: throw new Error('Unsupported captcha type');
            }
        }

        try {
            const response = await axios.post('withdraw.php', {
                coin: coin,
                withdrawal_amount: amount,
                method: method,
                token: await getCaptchaSolution()
            });
            console.log(response.data);
            replace_par(response.data.message);
            if (response.data.send_status == 200) {
                replace_par(response.data.message);
                console.log('DONE');
            } else {
                let i_msg = response.data.i_message || response.data.message;
                replace_par(i_msg);
                console.log('fail');
            }
            setTimeout(() => { grecaptcha?.reset(); }, 2000);
        } catch (error) {
            console.error(error);
            let response = error.response || null;
            if (response) {
                replace_par(response.data.message || 'API Error');
            } else {
                replace_par('Transaction failed');
            }
        }
    }

    // ─── ADD BUTTONS ──────────────────────────────────────────────────────────
    async function addButton() {
        let container1 = document.querySelector('sup');
        let container2 = document.querySelector("#all_submit");
        if (!container1 || !container2) {
            await wait(3000);
            return addButton();
        }

        const storedCoin = await getStoredCoin();
        const chainCoin = storedCoin || 'USDT';

        // Add Withdraw button (if not already present)
        if (!document.querySelector('#fastWithdrawal1')) {
            container1.innerHTML += '<a href="#r" id="fastWithdrawal1" data-coin="" data-amount="" data-method=""> Withdraw</a>';
            document.querySelector('#fastWithdrawal1').onclick = function() {
                withdrawCoin(this.dataset.coin, this.dataset.amount, this.dataset.method);
            };
        }

        if (/convert/ig.test(window.location.href)) {
            if (!document.querySelector('#fastWithdrawal2')) {
                let p_withdraw = document.createElement("p");
                let p1_withdraw = document.createElement("p");
                container2.parentNode.appendChild(p_withdraw);
                container2.parentNode.appendChild(p1_withdraw);

                // ✅ FIXED: set coin and method for FaucetPay
                const coinForFaucet = chainCoin; // e.g., 'BTC'
                p_withdraw.innerHTML += `<a href="#r" id="fastWithdrawal2" data-coin="${coinForFaucet}" data-amount="" data-method="faucetpay_w_${coinForFaucet}"> Withdraw (FaucetPay)</a>`;
                p1_withdraw.innerHTML += `<a href="#r" id="fastWithdrawal3" data-coin="${chainCoin}" data-amount="" data-method="chain_w1_${chainCoin}"> WithdrawChain (${chainCoin})</a>`;

                document.querySelector('#fastWithdrawal2').onclick = function () {
                    withdrawCoin(this.dataset.coin, this.dataset.amount, this.dataset.method);
                };
                document.querySelector('#fastWithdrawal3').onclick = function () {
                    withdrawCoin(this.dataset.coin, this.dataset.amount, this.dataset.method);
                };
            }
        }
    }

    // ─── INIT ──────────────────────────────────────────────────────────────────
    setTimeout(() => {
        if (isCloudflareVerificationPage()) return;
        addButton();
    }, 2000);
})();
