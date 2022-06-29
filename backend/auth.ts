import { readFile } from 'fs/promises';
import { readFileSync, writeFileSync } from 'fs';
import { config } from '../config';
import { createHmac } from 'crypto';
import { makeRamdomInt } from './serverutilities';
interface player {
  id: number;
  username: string;
  pass: string;
}

async function verify(
  user: string,
  password: string
): Promise<player | 'failed' | 'wrong'> {
  let passwordHash = hash(password, user);
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
  if (jsonPlayer.pass != passwordHash) return 'wrong';
  jsonPlayer.pass = password;
  return jsonPlayer;
}

async function createUser(
  user: string,
  password: string
): Promise<player | 'failed' | 'taken'> {


  let file = '[]';
  let passwordHash = hash(password, user);



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
  let newid = makeRamdomInt(minPlayer, config.MaxPlayers);
  while (jsonPlayers.find((e) => e.id === newid) != undefined) {
    newid = makeRamdomInt(minPlayer, config.MaxPlayers);
  }

  let newPlayer: player = {
    id: newid,
    username: user,
    pass: passwordHash,
  };
  jsonPlayers.push(newPlayer);
  try {
    console.log(jsonPlayers);
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

function hash(text: string, salt: string): string {
  // string to be hashed
  let str:string = text;

  // secret or salt to be hashed with
  let secret:string = salt;

  // create a sha-256 hasher
  let sha256Hasher = createHmac('sha256', secret);

  // hash the string
  // and set the output format
  let hash = sha256Hasher.update(str).digest('hex');

  // A unique sha256 has
  //console.log(hash);

  return hash;
}

export { verify, createUser };
