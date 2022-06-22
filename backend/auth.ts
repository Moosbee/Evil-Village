import { hash } from './hashing';
import { readFile } from 'fs/promises';
import { readFileSync } from 'fs';
import { writeFileSync } from "fs";

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
  try {
    file = await readFile('../players.json', { encoding: 'utf8' });
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
  maxPlayer:number
): Promise<number | 'failed' | 'taken'> {
  let passwordHash = hash(password, user);
  let file = '[]';
  try {
    file = readFileSync('../players.json', { encoding: 'utf8' });
  } catch (e) {
    return 'failed';
  }
  let jsonPlayers: player[] = JSON.parse(file);
  let jsonPlayer = jsonPlayers.find((e) => e.username === user);
  if (jsonPlayer != undefined) return 'taken';
  let minPlayer=1;
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

export { verify, createUser };
