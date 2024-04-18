(async () => {
    const table = document.querySelector("#records");
    const sendBtn = document.querySelector("#sendBtn");
    const logs = document.querySelector("#logs");
    const fields = [
        {
            element: document.querySelector("#sendInterval"),
            type: "update-interval",
            key: "Interval",
            default: SEND_DAP_INTERVAL_MINUTES,
        },
        {
            element: document.querySelector("#expireInterval"),
            type: "update-expiration",
            key: "Expiration",
            default: RECORD_EXPIRATION_DAYS,
        },
    ];

    sendBtn.addEventListener("click", () => {
        updatelogs("Sending Reports...");
        send({ type: "send-now" }, () => {
            updatelogs("Send Complete!");
        });
    });

    fields.forEach(async (field) => {
        let current = await browser.storage.session.get({ [field.key]: field.default });
        field.element.value = current[field.key];
        field.element.addEventListener("change", (e) => {
            updateValue(e, field.type, field.key);
        });
    });

    browser.runtime.onMessage.addListener((request) => {
        updatelogs(request);
    });

    drawRecords();

    async function updateValue(e, type, key) {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) {
            updatelogs(`Updating ${key}...`);
            send(
                {
                    type: type,
                    [key]: val,
                },
                () => {
                    browser.storage.session.set({ [key]: val });
                    updatelogs("Update complete!");
                }
            );
        } else {
            let current = await browser.storage.session.get(key);
            e.target.value = current;
            updatelogs(`Invalid ${key}`);
        }
    }

    async function updatelogs(log) {
        await drawRecords();
        logs.value = new Date().toLocaleString() + ": " + log + "\r\n" + logs.value;
    }

    async function drawRecords() {
        const keyRecords = await getRecordsByKey();

        table.innerHTML = `<caption><strong>Local Records</strong></caption>`;

        if (Object.entries(keyRecords).length === 0) {
            table.insertRow().insertCell().textContent = "No records exist.";
            return;
        }

        let header = table.insertRow();
        header.insertCell().outerHTML = "<th>key</th>";
        for (const [measurement, props] of Object.entries(MEASUREMENTS)) {
            header.insertCell().outerHTML = `<th>${measurement}</th>`;
        }

        for (const [key, records] of Object.entries(keyRecords)) {
            for (const record of records) {
                let row = table.insertRow();
                row.insertCell().textContent = key;
                for (const [measurement, props] of Object.entries(MEASUREMENTS)) {
                    row.insertCell().textContent = record.measurements[measurement];
                }
            }
        }
    }
})();
