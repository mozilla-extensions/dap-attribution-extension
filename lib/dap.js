"use strict";

const handleEvent = async () => {
    const keyRecords = await getRecordsByKey();

    const reports = await createReports(keyRecords);

    await sendReports(reports);

    await updateKeyRecords(keyRecords);
}

const createReports = async (keyRecords) => {
    const tasks = {};
    for (const [key, records] of Object.entries(keyRecords)) {
        for (const record of records) {
            const totals = tasks[record.taskId] ?? initMeasurement(record.taskSize);

            // Update each measurement value
            for (const [measurement, props] of Object.entries(MEASUREMENTS)) {
                const pos = record.taskIndex + (props.order * record.taskSize);
                totals[pos] += record.measurements[measurement];
                record.measurements[measurement] = 0;
            }

            tasks[record.taskId] = totals;
        }
    }

    return tasks;
}

const sendReports = async (reports) => {
    const promises = [];
    for (const [taskId, measurement] of Object.entries(reports)) {
        promises.push(browser.dapAttributionSender.sendDapReport({
            id: taskId,
            time_precision: 60,
            measurement_type: "vecu8",
        }, measurement));
    }
    await Promise.all(promises);
}

const initMeasurement = (taskSize) => {
    return new Array(MEASUREMENT_COUNT * taskSize).fill(0);
}