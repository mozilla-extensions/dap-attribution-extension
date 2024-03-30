"use strict";

const handleSourceEvent = async (detail) => {
    const record = await getRecordOrDefault(detail);

    increaseMeasurement(record, detail.measurement);
    record.lastSourceTimestamp = Date.now();

    await updateRecord(record);
}

const handleTargetEvent = async (detail) => {
    const record = await findMostRecentSourceRecord(detail.keys);

    if (record) {
        increaseMeasurement(record, detail.measurement);

        await updateRecord(record);
    }
}