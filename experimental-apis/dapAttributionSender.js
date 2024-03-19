"use strict";

ChromeUtils.defineESModuleGetters(this, {
    DAPTelemetrySender: "resource://gre/modules/DAPTelemetrySender.sys.mjs",
});

this.dapAttributionSender = class extends ExtensionAPI {
  getAPI(context) {
    return {
        dapAttributionSender: {
        sendDapReport: (task, measurement) => {
            return DAPTelemetrySender.sendDAPMeasurement(task, measurement, 30000, "periodic");
        },
      },
    };
  }
};