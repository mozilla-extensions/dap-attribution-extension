"use strict";

const handleEvent = async () => {
    const records = await getRecords();

    console.log('Creating Reports...', records);

    const reports = await createReports(records);

    await sendReports(reports);
}

const createReports = async (records) => {
    const tasks = {};

    for (const [key, keyRecords] of Object.entries(records)) {
        for (const record of keyRecords) {
            const totals = tasks[record.taskId] ?? initMeasurement(record.taskSize);

            // Update each measurement value
            for (const [measurement, props] of Object.entries(MEASUREMENTS)) {
                const pos = record.taskIndex + (props.order * record.taskSize);
                totals[pos] += record.measurements[measurement];
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