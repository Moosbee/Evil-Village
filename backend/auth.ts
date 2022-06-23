import { readFile } from 'fs/promises';
import { readFileSync, writeFileSync } from 'fs';
import { config } from '../config';
import { createHmac } from 'crypto';
import { getMapPixel } from './serverutilities';
interface player {
  id: number;
  username: string;
  pass: string;
}

async function verify(
  user: string,
  password: string
): Promise<number | 'failed' | 'wrong'> {
  let passwordHash = hash(password, user);
  let file = '[]';

  let pix=await getMapPixel(101,101);

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
  return jsonPlayer?.id;
}

async function createUser(
  user: string,
  password: string,
  maxPlayer: number
): Promise<number | 'failed' | 'taken'> {
  let passwordHash = hash(password, user);
  let file = '[]';
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
  let newid = Math.floor(Math.random() * (maxPlayer - 1 + 1)) + 1;
  while (jsonPlayers.find((e) => e.id === newid) != undefined) {
    newid = Math.floor(Math.random() * (maxPlayer - minPlayer + 1)) + minPlayer;
  }

  let newPlayer: player = {
    id: newid,
    username: user,
    pass: passwordHash,
  };
  jsonPlayers.push(newPlayer);
  try {
    writeFileSync('../players.json', JSON.stringify(jsonPlayers));
  } catch (e) {
    return 'failed';
  }
  return newPlayer.id;
}

function hash(text: string, salt: string): string {
  // string to be hashed
  let str = text;

  // secret or salt to be hashed with
  let secret = salt;

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