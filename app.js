const taapi = require("taapi");
const axios = require("axios");
const schedule = require("node-schedule");

// telegram
const teleURL =
  "https://api.telegram.org/bot1965445087:AAEvNyDpccNONKf3N8dah9ICYYVwnzD_Dxg/sendMessage?chat_id=-525875746&text=";
const sendMessTele = (message) => {
  axios.get(teleURL + message);
};

//taapi
const my_key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZhbmtodW9uOTFAZ21haWwuY29tIiwiaWF0IjoxNjM5NDUyNzg0LCJleHAiOjc5NDY2NTI3ODR9.LOy5hpczR8mW8wYK-ZdSggqj0vJrgBP3pcnbL7TCdzY";
const client = taapi.client(my_key);

client.initBulkQueries();

client.addBulkQuery("stochrsi", "binance", "BTC/USDT", "4h");
client.addBulkQuery("dmi", "binance", "BTC/USDT", "4h");
client.addBulkQuery("stochrsi", "binance", "BTC/USDT", "4h", null, 4);
client.addBulkQuery("dmi", "binance", "BTC/USDT", "4h", null, 4);

let oldData = {};
let newData = {};

const checkStochRSI = () => {
  if (oldData.valueFastK) {
    if (
      Number(newData.valueFastK) < Number(newData.valueFastD) &&
      Number(oldData.valueFastK) >= Number(oldData.valueFastD) &&
      Number(oldData.valueFastD) < 40
    ) {
      sendMessTele("StockRSI_4h cross_up -- BUY");
    }
    if (
      Number(newData.valueFastK) > Number(newData.valueFastD) &&
      Number(oldData.valueFastK) > 80 &&
      Number(newData.valueFastK) < 80
    ) {
      sendMessTele("StockRSI_4h cross_down level 80  -- SELL");
    }
  }
};

const checkDMI = () => {
  if (oldData.plusdi) {
    if (
      Number(newData.plusdi) > Number(newData.minusdi) &&
      Number(oldData.minusdi) >= Number(oldData.plusdi)
    ) {
      sendMessTele("DMI_4h cross_up -- BUY");
    }
    if (
      Number(newData.plusdi) <= Number(newData.minusdi) &&
      Number(newData.plusdi) <= Number(newData.minusdi)
    ) {
      console.log(123123);
      sendMessTele("DMI_4h cross_down -- SELL");
    }
    if (Number(newData.adx) < Number(oldData.adx) && Number(oldData.adx) > 50) {
      sendMessTele("ADX_4h down -- SELL");
    }
  }
};
const scanTAAPI = () => {
  client
    .executeBulkQueries()
    .then((result) => {
      console.log("-----------------------------------");
      console.log("loai:", typeof result);
      if (result.length > 0) {
        for (let i = 0; i < 2; i++) {
          newData = { ...newData, ...result[i].result };
        }
        for (let i = 2; i < 4; i++) {
          oldData = { ...oldData, ...result[i].result };
        }
        checkStochRSI();
        checkDMI();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

sendMessTele("start filter BTC 4h");
scanTAAPI();
const job = schedule.scheduleJob("*/30 * * * *", function () {
  scanTAAPI();
});
// setInterval(scanTAAPI,60000*20)
