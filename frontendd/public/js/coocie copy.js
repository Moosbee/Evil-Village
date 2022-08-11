



function setCookie(cname, cvalue, exdays) {
    if(exdays!=undefined){
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; Secure=false";
    }else{
        document.cookie = cname + "=" + cvalue + ";path=/; Secure=false";
    }

}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
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
    var coockie = getCookie(cname);
    if (coockie != "") {
        document.cookie = cname +"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure=false";
    }
    
}


