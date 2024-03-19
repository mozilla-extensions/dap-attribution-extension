"use strict";

const handleSourceEvent = async (detail) => {
    console.log("Source Start", detail);

    const record = await getRecordOrDefault(detail);

    increaseMeasurement(record, detail.measurement);
    record.lastSourceTimestamp = new Date();

    await updateRecords(record);

    console.log("Source Complete", JSON.stringify(record));
}

const handleTargetEvent = async (detail) => {
    console.log("Target Start", detail);

    // Get the record for the conversion keys with the most recent source event
    const record = await findMostRecentSourceRecord(detail.keys);

    if (record) {
        if (record.lastSourceTimestamp >= getLastAllowedTimestamp()) {
            increaseMeasurement(record, detail.measurement);

            await updateRecords(record);
        }
    }

    console.log("Target Complete", JSON.stringify(record));
}

const increaseMeasurement = (record, measurement) => {
    if (record.measurements[measurement] < MAX_VECTOR_SIZE) {
        record.measurements[measurement]++;
    }
}