"use strict";

const SEND_DAP_INTERVAL_MINUTES = 15;
const MAX_VECTOR_SIZE = 100;

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

const compareRecord = (r, id, index) => r.taskId === id && r.taskIndex === index;

const getRecord = async (key, id, index) => {
    const { [key]: records } = await getRecords([key]);
    return records.find((r) => compareRecord(r, id, index));
}

const getRecords = async (keys) => {
    const obj = !keys ? null : keys.reduce((result, key) => ({
        ...result,
        [key]: [],
    }), {});
    return await browser.storage.local.get(obj);
}

const getRecordOrDefault = async (record) => {
    return await getRecord(record.key, record.taskId, record.taskIndex) ?? {
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

const updateRecords = async (record) => {
    let { [record.key]: records } = await getRecords([record.key]);

    const index = records.findIndex((r) => compareRecord(r, record.taskId, record.taskIndex));
    if (index < 0) {
        records.push(record);
    } else {
        records[index] = record;
    }

    await browser.storage.local.set({ [record.key]: records });
}

const findMostRecentSourceRecord = async (keys) => {
    const records = await getRecords(keys);

    return keys.reduce((result, key) => records[key].reduce((cur, record) =>
        !cur || record.lastSourceTimestamp > cur.lastSourceTimestamp ? record : cur, result), null);
}