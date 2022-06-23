import { verify } from "./auth";
import { getMapPixel } from "./serverutilities";

// const verify = require('./auth');


getMapPixel(100,100).then((pixel)=>{
    console.log(pixel);
    verify("west","mm").then((erg)=>{
        console.log(erg)
    })
});
getMapPixel(200,200).then((pixel)=>{
    console.log(pixel);
});


