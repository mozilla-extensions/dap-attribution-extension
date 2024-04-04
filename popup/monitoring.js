(async () => {
    const container = document.querySelector("#records");
    const sendInterval = document.querySelector("#sendInterval");
    const expireInterval = document.querySelector("#expireInterval");
    const sendNow = document.querySelector("#sendNow");
    const logs = document.querySelector("#logs");

    let storedInterval = await browser.storage.session.get("interval");
    let curInterval = storedInterval.interval ?? SEND_DAP_INTERVAL_MINUTES;
    sendInterval.value = curInterval;
    sendInterval.addEventListener('change', (e) => {
        const interval = parseFloat(e.target.value);
        if (!isNaN(interval)) {
            updatelogs("Updating interval...");
            send({
                type: "update-interval",
                interval: interval
            }, () => {
                curInterval = interval;
                browser.storage.session.set({ interval: interval });
                updatelogs("Update complete!");
            });
        } else {
            updatelogs("Invalid Interval");
            sendInterval.value = curInterval;
        }
    });

    let storedExpire = await browser.storage.session.get("expire");
    let curExpire = storedExpire.expire ?? RECORD_EXPIRATION_DAYS;
    expireInterval.value = curExpire;
    expireInterval.addEventListener('change', (e) => {
        const interval = parseFloat(e.target.value);
        if (!isNaN(interval)) {
            updatelogs("Updating expiration...");
            send({
                type: "update-expiration",
                expiration: interval
            }, () => {
                curExpire = interval;
                browser.storage.session.set({ expire: interval });
                updatelogs("Update complete!");
            });
        } else {
            updatelogs("Invalid Expiration");
            expireInterval.value = curExpire;
        }
    });

    sendNow.addEventListener('click', () => {
        updatelogs("Sending Reports...");
        send({
            type: "send-now"
        }, () => {
            updatelogs("Send Complete!");
        });
    });

    browser.runtime.onMessage.addListener(async (request) => {
        updatelogs(request);
    });

    updateRecords();

    async function updatelogs(log) {
        await updateRecords();
        logs.value = (new Date()).toLocaleString() + ": " + log + '\r\n' + logs.value;
    }

    async function updateRecords() {
        const keyRecords = await getRecordsByKey();

        if (Object.entries(keyRecords).length === 0) {
            container.innerHTML = `<tr>No records exist.</tr>`;
            return;
        }

        let header = "<th>key</th>";
        for (const [measurement, props] of Object.entries(MEASUREMENTS)) {
            header += `<th>${measurement}</th>`;
        }

        container.innerHTML = `<tr>${header}</tr>`;

        for (const [key, records] of Object.entries(keyRecords)) {
            for (const record of records) {
                let columns = `<td>${key}</td>`;
                for (const [measurement, props] of Object.entries(MEASUREMENTS)) {
                    columns += `<td>${record.measurements[measurement]}</td>`;
                }
                container.innerHTML += `<tr>${columns}</tr>`;
            }
        }
    }
})();