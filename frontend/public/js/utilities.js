function onloaded(){
    if(checkCookie("username")){
        var dater={
            usernamefld:getCookie("username"),
            passwordfld:getCookie("password")
        };
        $.ajax({url:"/login",type: 'POST',
        data:dater,
        success: function(result,status){
            console.log(result);
            var JSONRes = JSON.parse(result);
            if(JSONRes.state=="success"){
                document["vorname"]=JSONRes.vorname;
                document["nachname"]=JSONRes.nachname;
                document["benutzername"]=JSONRes.benutzername;
                document["tokenid"]=JSONRes.id;
                makeitready();
            }
        }});
    }else{
        if(location.pathname =='/login'){
            console.log("test");
        }else{
            location.href = '/login';
        }
    }
}

function dark(){
    console.log("dark");
    var element = document.body;
    element.classList.toggle("dark-mode");
}

function setmap(){

    let canis= document.createElement("canvas");
    canis.height=1000;
    canis.width=1000;
    let cani=canis.getContext("2d");
    let imageData = new ImageData(1000, 1000);
    let image = document.createElement("img");
    image.src = "/game/map";
    cani.drawImage(image, 0, 0, 1000, 1000);
    imageData = cani.getImageData(0, 0, 1000, 1000);

    let terr=imageData.data
    window.mapTerrain=terr;

}

function getmappixel(x,y){
if(!window.mapTerrain){
    console.log("Setting Map");
    setmap();
}


    x=Math.round(x);
    y=Math.round(y);
    let width=1000;
    let indexred = y * (width * 4) + x * 4;
    let indexgreen=indexred+1;
    let indexblue=indexred+2;
    let indexalpha=indexred+3;

    let red=window.mapTerrain[indexred];
    let green=window.mapTerrain[indexgreen];
    let blue=window.mapTerrain[indexblue];
    let alpha=window.mapTerrain[indexalpha];
    let data=[red,green,blue,alpha];

    //console.log(imageData.data);
    //console.log(data);
    return data;

}


function logof(){
    console.log("Logout")
    if(checkCookie("username")){
        removeCookie("username");
        removeCookie("password");
        location.href = '/login';
    }
}