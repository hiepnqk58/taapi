
const taapi = require("taapi");
const axios = require("axios");


// telegram
const teleURL='https://api.telegram.org/bot1965445087:AAEvNyDpccNONKf3N8dah9ICYYVwnzD_Dxg/sendMessage?chat_id=-525875746&text='
const sendMessTele = (message) => {
    axios.get(teleURL + message);
  };

//taapi
const my_key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZhbmtodW9uOTFAZ21haWwuY29tIiwiaWF0IjoxNjM5NDUyNzg0LCJleHAiOjc5NDY2NTI3ODR9.LOy5hpczR8mW8wYK-ZdSggqj0vJrgBP3pcnbL7TCdzY'
const client = taapi.client(my_key);



client.initBulkQueries();
 
client.addBulkQuery("stochrsi", "binance", "BTC/USDT", "4h");
client.addBulkQuery("dmi", "binance", "BTC/USDT", "4h");
client.addBulkQuery("dmi", "binance", "BTC/USDT", "4h");
client.addBulkQuery("stochrsi", "binance", "BTC/USDT", "4h",null,4);
client.addBulkQuery("dmi", "binance", "BTC/USDT", "4h",null,4);

let oldData={}
let newData={}

const checkStochRSI=()=>{

    if (!oldData.valueFastK){
        if ((newData.valueFastK<newData.valueFastD)&&(oldData.valueFastK>=oldData.valueFastD)&&(oldData.valueFastD<40)){
            sendMessTele('StockRSI_4h cross_up -- BUY')
        }
        if ((newData.valueFastK>newData.valueFastD)&&(oldData.valueFastK>80)&&(newData.valueFastK<80)){
            sendMessTele('StockRSI_4h cross_down level 80  -- SELL')
        }
    }
}

const checkDMI=()=>{

    if (!oldData.plusdi){
        if ((newData.plusdi>newData.minusdi)&&(oldData.minusdi>=oldData.plusdi)){
            sendMessTele('DMI_4h cross_up -- BUY')
        }
        if ((newData.plusdi<=newData.minusdi)&&(oldData.minusdi<oldData.plusdi)){
            sendMessTele('DMI_4h cross_down -- SELL')
        }
        if ((newData.adx<oldData.adx)&&(oldData.adx>50)){
            sendMessTele('ADX_4h down -- SELL')
        }
    }
}
const scanTAAPI=()=>{
    client.executeBulkQueries().then(result => {
        console.log('-----------------------------------');

        for (let i=0;i<2;i++){
          newData={...newData,...result[i].result}
        
        }
        for (let i=2;i<4;i++){
            oldData={...oldData,...result[i].result}
          
          }
        checkStochRSI();
        checkDMI();
       
        
    }).catch(error => {
        console.log(error);
    });
}
sendMessTele('start filter BTC 4h')
scanTAAPI()
setInterval(scanTAAPI,60000*20)
