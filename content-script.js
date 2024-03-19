"use strict";

if (!window.hasRunAttributionScript) {
  window.addEventListener("fx-attribution", handleEvent, false);
}
window.hasRunAttributionScript = true;

const actions = {
  [MEASUREMENT_TYPES.source.id]: handleSourceEvent,
  [MEASUREMENT_TYPES.target.id]: handleTargetEvent,
}

async function handleEvent(e) {
  if (!browser.extension.inIncognitoContext) {
    const payload = JSON.parse(window.atob(e.detail));
    const measurement = MEASUREMENTS[payload.measurement];

    if (measurement) {
      await actions[measurement.type](payload);
    }
  }

  // Dispatch event so clients can perform actions after completion
  window.dispatchEvent(
    new CustomEvent("fx-attribution-complete")
  );
}