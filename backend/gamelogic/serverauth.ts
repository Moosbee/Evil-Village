import { readFile } from 'fs/promises';
import { readFileSync, writeFileSync } from 'fs';
import { config } from '../config';
import { createHmac, randomBytes } from 'crypto';
import { makeRandomInt } from './serverutilities';
interface player {
  id: number;
  username: string;
  pass: string;
  token: string;
  tokenDate: string;
}

async function verify(
  user: string,
  password: string
): Promise<player | 'failed' | 'wrong'> {
  let passwordHash = '';
  if (config.plainTextPassword) {
    passwordHash = password;
  } else {
    passwordHash = await hash(password, user);
  }
  let file = '[]';
  // console.log(config.rootPath + config.PlayerFile);

  try {
    file = await readFile(config.rootPath + config.PlayerFile, {
      encoding: 'utf8',
    });
  } catch (e) {
    return 'failed';
  }
  let jsonPlayers: player[] = JSON.parse(file);
  let jsonPlayer = jsonPlayers.find((e) => e.username === user);
  if (jsonPlayer == undefined) return 'failed';
  //if (timingSafeEqual(jsonPlayer.pass,passwordHash)) return 'wrong';
  if (jsonPlayer.pass != passwordHash) return 'wrong';
  let now = new Date();
  if (jsonPlayer.tokenDate == undefined) {
    jsonPlayer.tokenDate = now.toJSON();
    jsonPlayer.token = createToken();
  }
  let expirer: number = 24 * 60 * 60 * 1000;
  let timeDiv = now.getTime() - new Date(jsonPlayer.tokenDate).getTime();
  if (timeDiv > expirer) {
    console.log('new token');
    jsonPlayer.token = createToken();
    jsonPlayer.tokenDate = now.toJSON();
  }
  try {
    //console.log(jsonPlayers);
    writeFileSync(
      config.rootPath + config.PlayerFile,
      JSON.stringify(jsonPlayers)
    );
  } catch (e) {
    return 'failed';
  }

  jsonPlayer.pass = password;
  return jsonPlayer;
}

async function verifyToken(token: string): Promise<player | 'failed'> {
  let file = '[]';

  try {
    file = await readFile(config.rootPath + config.PlayerFile, {
      encoding: 'utf8',
    });
  } catch (e) {
    return 'failed';
  }
  let jsonPlayers: player[] = JSON.parse(file);
  let jsonPlayer = jsonPlayers.find((e) => e.token === token);
  if (jsonPlayer == undefined) return 'failed';

  let expirer: number = 24 * 60 * 60 * 1000;
  let timeDiv = new Date().getTime() - new Date(jsonPlayer.tokenDate).getTime();
  if (timeDiv > expirer) {
    return 'failed';
  }

  return jsonPlayer;
}

async function createUser(
  user: string,
  password: string
): Promise<player | 'failed' | 'taken'> {
  let file = '[]';
  let passwordHash: string;
  if (config.plainTextPassword) {
    passwordHash = password;
  } else {
    passwordHash = await hash(password, user);
  }

  try {
    file = readFileSync(config.rootPath + config.PlayerFile, {
      encoding: 'utf8',
    });
  } catch (e) {
    return 'failed';
  }
  let jsonPlayers: player[] = JSON.parse(file);
  let jsonPlayer = jsonPlayers.find((e) => e.username === user);
  if (jsonPlayer != undefined) return 'taken';
  let minPlayer = 1;
  let newid = makeRandomInt(minPlayer, config.MaxPlayers);
  while (jsonPlayers.find((e) => e.id === newid) != undefined) {
    newid = makeRandomInt(minPlayer, config.MaxPlayers);
  }
  let token: string = createToken();
  let now = new Date().toJSON();

  let newPlayer: player = {
    id: newid,
    username: user,
    pass: passwordHash,
    token: token,
    tokenDate: now,
  };
  jsonPlayers.push(newPlayer);
  try {
    //console.log(jsonPlayers);
    writeFileSync(
      config.rootPath + config.PlayerFile,
      JSON.stringify(jsonPlayers)
    );
  } catch (e) {
    return 'failed';
  }
  newPlayer.pass = password;
  return newPlayer;
}

async function hash(password: string, salt: string): Promise<string> {
  // string to be hashed

  // secret or salt to be hashed with

  // create a sha-256 hasher
  let sha256Hasher = createHmac('sha256', salt);

  // hash the string
  // and set the output format
  let hash = sha256Hasher.update(password).digest('hex');

  // A unique sha256 has
  // console.log(hash);

  return hash;

  // pbkdf2(password, salt, 100, 10, 'sha256', (err, derivedKey) => {
  //   return derivedKey.toString('hex');
  // });
}

function createToken(): string {
  return randomBytes(30).toString('hex');
}

export { verify, createUser, verifyToken, player };
