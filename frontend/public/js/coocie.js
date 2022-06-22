



function setCookie(cname, cvalue, exdays) {
    if(exdays!=undefined){
        Cookies.set('name', 'value', { expires: exdays });
    }else{
        Cookies.set(cname, cvalue);
    }

}

function getCookie(cname) {
    let cooc=Cookies.get(cname);
    if(cooc!=undefined){
        return cooc;
    }
    return "";
}

function checkCookie(cname) {
    var coockie = getCookie(cname);
    if (coockie != "") {
        return true;
    }
    return false;
}

function removeCookie(cname) {
    Cookies.remove(cname);
    
}


