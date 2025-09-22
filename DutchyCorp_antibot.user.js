(function () {
    const solveAntibot = true;

    /*** Helpers ***/
    const log = (...args) => console.log("[userscript]", ...args);

    function isCloudflareVerificationPage() {
        const h2Text = document.querySelector("h2")?.innerText.toLowerCase();
        return h2Text?.includes("verify");
    }

    function safeRun(fn) {
        try {
            if (!isCloudflareVerificationPage()) fn();
        } catch (err) {
            console.error("Script error:", err);
        }
    }

    /*** Anti-bot solver ***/
    function startAntibotSolver() {
        log("Anti-bot solver enabled");

        async function handleAntibotModal() {
            if (isCloudflareVerificationPage()) return;

            const modals = document.querySelectorAll(".modal.open");
            const modal = Array.from(modals).find(m => m.style.display === "block");
            if (!modal) return;

            const modalId = modal.id;
            if (!modalId) return;

            const container = document.querySelector(`#${modalId}`);
            if (!container) return;

            const icons = Array.from(container.querySelectorAll(".gradient-btn.btn.btn-secondary input"));
            const targetText = container.innerText
                .replace(/[\W]/g, "")
                .replace(/.*Select|Gosend/gi, "")
                .trim();

            for (const input of icons) {
                const iconText = input.value.replace(/[\W]/g, "").trim();
                if (iconText === targetText) {
                    input.click();
                    setTimeout(() => {
                        container.querySelector("button")?.click();
                    }, 1000);

                    modal.style.display = "none";
                    document.querySelector(".modal-overlay")?.click();
                    log("Anti-bot solved");
                    break;
                }
            }
        }

        setInterval(() => safeRun(handleAntibotModal), 2000);
    }

    /*** Shortlink fixer ***/
    function initShortlinkFixer() {
        log("Shortlink fixer enabled");

        window.addEventListener("load", () => {
            const shortlinkBtn = document.querySelectorAll("a.gradient-btn.btn");
            const username = document.querySelector("ul li .user_avatar + b")?.innerText.trim().toLowerCase() || "";

            const user = encodeURIComponent(username);

            for (const btn of shortlinkBtn) {
                try {
                    const onclick = btn.getAttribute("onclick") || "";
                    const match = onclick.match(/ad_display\('square',\s*(\d+)\)/);
                    if (!match) continue;

                    const id = Number(match[1]);
                    if (Number.isNaN(id)) continue;

                    btn.removeAttribute("onclick");
                    btn.removeAttribute("onmousedown");

                    const baseUrl = `/shortlinks-wall/extend_claim_count.php?username=${user}&id=${id}`;
                    btn.setAttribute("href", baseUrl);
                    btn.setAttribute("target", "_blank");
                    btn.setAttribute("data-tooltip", "Visit Shortlink");

                    btn.dataset.shortlinkId = String(id);

                    if (btn._shortlinkHandler) {
                        btn.removeEventListener("click", btn._shortlinkHandler);
                    }

                    const handler = () => {
                        const finalId = Number(btn.dataset.shortlinkId);
                        btn.href = `/shortlinks-wall/extend_claim_count.php?username=${user}&id=${finalId}`;
                    };

                    btn.addEventListener("click", handler);
                    btn._shortlinkHandler = handler;
                } catch (err) {
                    console.error("checkLinks error:", err);
                }
            }
        });
    }

    /*** Entrypoint ***/
    if (isCloudflareVerificationPage()) {
        log("Cloudflare verification detected, exiting script");
        return;
    }

    if (solveAntibot) {
        startAntibotSolver();
    } else {
        initShortlinkFixer();
    }
})();
