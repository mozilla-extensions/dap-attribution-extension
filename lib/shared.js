"use strict";

const SEND_DAP_INTERVAL_MINUTES = 1; // This will need to be changed when onboarding supply and actual advertisers
const MAX_VECTOR_SIZE = 100;
const RECORD_EXPIRATION_DAYS = 31;
const RECORD_EXPIRATION_MILLI = RECORD_EXPIRATION_DAYS * (1000 * 60 * 60 * 24)

const MEASUREMENT_TYPES = {
    source: {
        id: "source"
    },
    target: {
        id: "target"
    }
}
const MEASUREMENTS = {
    impression: {
        order: 0,
        type: MEASUREMENT_TYPES.source.id,
    },
    click: {
        order: 1,
        type: MEASUREMENT_TYPES.source.id,
    },
    conversion: {
        order: 2,
        type: MEASUREMENT_TYPES.target.id,
    },
}
const MEASUREMENT_COUNT = Object.keys(MEASUREMENTS).length;

const getRecordsByKey = async (keys) => {
    const keyMap = !keys ? null : keys.reduce((result, key) => ({
        ...result,
        [key]: [],
    }), {});
    return await browser.storage.local.get(keyMap);
}

const getRecordOrDefault = async (record) => {
    return await findRecord(record.key, record.taskId, record.taskIndex) ?? {
        taskId: record.taskId,
        taskIndex: record.taskIndex,
        taskSize: record.taskSize,
        key: record.key,
        measurements: Object.entries(MEASUREMENTS).reduce((result, measurement) => ({
            ...result,
            [measurement[0]]: 0,
        }), {}),
        lastSourceTimestamp: null
    };
}

const compareRecord = (r, id, index) => r.taskId === id && r.taskIndex === index;

const findRecord = async (key, id, index) => {
    const { [key]: records } = await getRecordsByKey([key]);
    return records.find((r) => compareRecord(r, id, index));
}

const updateKeyRecords = async (keyRecords) => {
    for (const [key, records] of Object.entries(keyRecords)) {
        if (records.length > 0) {
            for (const record of records) {
                await updateRecord(record);
            }
        } else {
            removeKey(key);
        }
    }
}

const updateRecord = async (record) => {
    let { [record.key]: records } = await getRecordsByKey([record.key]);

    const index = records.findIndex((r) => compareRecord(r, record.taskId, record.taskIndex));
    if (index < 0) {
        records.push(record);
    } else {
        if (record.lastSourceTimestamp < Date.now() - RECORD_EXPIRATION_MILLI) {
            records.splice(index, 1);
        } else {
            records[index] = record;
        }
    }

    if (records.length > 0) {
        await browser.storage.local.set({ [record.key]: records });
    } else {
        removeKey(record.key);
    }
}

const removeKey = async (key) => {
    await browser.storage.local.remove(key);
}

const findMostRecentSourceRecord = async (keys) => {
    const records = await getRecordsByKey(keys);

    return keys.reduce((result, key) => records[key].reduce((cur, record) =>
        !cur || record.lastSourceTimestamp > cur.lastSourceTimestamp ? record : cur, result), null);
}

const increaseMeasurement = (record, measurement) => {
    if (record.measurements[measurement] < MAX_VECTOR_SIZE) {
        record.measurements[measurement]++;
    }
}

function send(data, complete) {
    const sending = browser.runtime.sendMessage(data);
    if (complete) {
        sending.then(complete);
    }
}