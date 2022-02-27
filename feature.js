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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1ycmlnaHQ1MjM0NTlAZ21haWwuY29tIiwiaWF0IjoxNjQ1ODY4MjEyLCJleHAiOjc5NTMwNjgyMTJ9.n80QDc3cWGLEWT8Zp7IjkkyS3NQ4AqXDBq81QTvNOUs";
const client = taapi.client(my_key);

client.initBulkQueries();

client.addBulkQuery("dmi", "binance", "BTC/USDT", "15m");
client.addBulkQuery("dmi", "binance", "BTC/USDT", "15m", null, 4);

let oldData = {};
let newData = {};

const checkDMI = () => {
  if (oldData.plusdi) {
    if (newData.plusdi > newData.minusdi && oldData.minusdi >= oldData.plusdi) {
      sendMessTele("DMI_15p cross_up -- BUY Long");
    }
    if (newData.plusdi <= newData.minusdi && oldData.minusdi < oldData.plusdi) {
      sendMessTele("DMI_15p cross_down -- Buy Short");
    }
    // if (newData.adx < oldData.adx && oldData.adx > 50) {
    //   sendMessTele("ADX_15p down -- SELL");
    // }
  }
};
const feature = () => {
  client
    .executeBulkQueries()
    .then((result) => {
      console.log(result);
      if (result.length > 0) {
        newData = { ...newData, ...result[0].result };
        oldData = { ...oldData, ...result[1].result };
        console.log(newData, oldData);
        checkDMI();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

feature();
const job = schedule.scheduleJob("*/15 * * * *    ", function () {
  feature();
});
