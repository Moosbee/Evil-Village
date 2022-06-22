

exports.getmappixel=getmappixel;
exports.setmap=setmap;

function setmap(){
var Jimp=require("jimp");
let map = "../maps/map";
let number = configur.Game.Map;
map = map + number + ".png";
Jimp.read("./game/maps/map1.png", function (err, image) {
    if(err){
        console.log(err);
    }
    global.mappixel=image.bitmap.data;
    let test=image;
    //image.getPixelColor(x, y); // returns the colour of that pixel e.g. 0xFFFFFFFF
});
}
function getmappixel(x,y){
    
        x=Math.round(x);
        y=Math.round(y);
        let width=1000;
        let indexred = y * (width * 4) + x * 4;
        let indexgreen=indexred+1;
        let indexblue=indexred+2;
        let indexalpha=indexred+3;
    
        let red=global.mappixel[indexred];
        let green=global.mappixel[indexgreen];
        let blue=global.mappixel[indexblue];
        let alpha=global.mappixel[indexalpha];
        let data=[red,green,blue,alpha];
    
        //console.log(imageData.data);
        //console.log(data);
        return data;

}