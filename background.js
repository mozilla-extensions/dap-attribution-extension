"use strict";

if (!browser.extension.inIncognitoContext) {
    browser.alarms.create({ periodInMinutes: SEND_DAP_INTERVAL_MINUTES });

    browser.alarms.onAlarm.addListener(async () => {
        send("Sending Reports...");

        await handleEvent();

        send("Send Complete!");

    });

    browser.runtime.onMessage.addListener(async (request, sender, complete) => {
        console.log(`A content script sent a message:`, request);

        if (request.type === "send-now") {
            await handleEvent();
        } else if (request.type === "update-interval") {
            browser.alarms.clearAll();
            browser.alarms.create({ periodInMinutes: request.interval });
        } else if (request.type === "update-expiration") {
            RECORD_EXPIRATION_MILLI = request.expiration * (1000 * 60 * 60 * 24)
        }

        if (complete) {
            complete({ response: "Response from background script" });
        }
    });
}