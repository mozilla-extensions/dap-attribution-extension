"use strict";

if (!browser.extension.inIncognitoContext) {
    browser.alarms.create({ periodInMinutes: SEND_DAP_INTERVAL_MINUTES });

    browser.alarms.onAlarm.addListener(handleEvent);
}