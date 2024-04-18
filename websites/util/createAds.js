var tasks = [
  "hYycR_j0VUxBzS2MWi_mIKbMsTX2ZaGaIVvr03zPTt8",
  "v17q4Bdx5Dv56Dk1isHE6BqfN9R9zAUWYWiWMC3rYyQ"
];
var taskSize = 5;

var placements = [1, 2];
var advertisers = [1, 2];


let advAds = {};
advertisers.forEach((a) => {
  advAds[a] = Array.from({length: taskSize}, (_, i) => (i + 1) + ((a * taskSize) - taskSize));
});

let ads = [];
let i = 0;
let lastTaskIdIndex = 0;
placements.forEach((plc) => {
  let curAdvAdIMap = {};
  advertisers.forEach((a) => {
    curAdvAdIMap[a] = 0;
  });

  for (let tI = 0; tI < taskSize; tI++) {
    const taskId = tasks[lastTaskIdIndex % tasks.length]
    lastTaskIdIndex++;
    const curAdv = advertisers[i % advertisers.length];
    const curAdvAds = advAds[curAdv];
    const curAd = curAdvAds[curAdvAdIMap[curAdv]++];
    const plcAd = getPlcAd(plc, curAdv, curAd, curAd, "", taskId, tI, curAd);
    const attrObj = {
      taskId: plcAd.taskId,
      taskIndex: plcAd.taskIndex,
      taskSize: plcAd.taskSize,
      key: plcAd.conversionKey,
    };
    ads.push({
      plc: {
        id: plcAd.placementId
      },
      ad: {
        id: plcAd.adId,
        name: plcAd.adName,
        url: plcAd.adUrl,
      },
      att: {
        imp: btoa(
          JSON.stringify({ measurement: "impression", ...attrObj })
        ),
        cl: btoa(JSON.stringify({ measurement: "click", ...attrObj })),
      },
      debug: plcAd,
    });
    i++;
  }
});

console.log(JSON.stringify(ads));

function getPlcAd(plcI, advI, adI, pId, url, tId, tI, kI) {
  return {
    placementId: "plc" + plcI,
    advertiserId: "adv" + advI,
    adId: "ad" + adI,
    advertiserName: "Advertiser " + advI,
    adName: "Product " + pId,
    adUrl: url,
    taskId: tId,
    taskIndex: tI,
    taskSize: taskSize,
    conversionKey: "key" + kI,
  }
}