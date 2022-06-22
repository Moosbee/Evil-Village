// const crypto = require("crypto");

import { createHmac } from "crypto";

function hash(text: string, salt: string):string {
  // string to be hashed
  let str = text;

  // secret or salt to be hashed with
  let secret = salt;

  // create a sha-256 hasher
  let sha256Hasher = createHmac("sha256", secret);

  // hash the string
  // and set the output format
  let hash = sha256Hasher.update(str).digest("hex");

  // A unique sha256 has
  //console.log(hash);

  return hash;
}

export { hash };
