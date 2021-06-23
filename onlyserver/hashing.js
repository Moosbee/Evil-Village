const crypto = require("crypto");


exports.hash=hash;

function hash(text,salt){
    // string to be hashed
    let str = text;

    // secret or salt to be hashed with
    let secret = salt;

    // create a sha-256 hasher
    let sha256Hasher = crypto.createHmac("sha256", secret);

    // hash the string
    // and set the output format
    let hash = sha256Hasher.update(str).digest("hex");

    // A unique sha256 has
    //console.log(hash);

    return hash;
}