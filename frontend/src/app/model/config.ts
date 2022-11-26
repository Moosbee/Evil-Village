interface gameConfig {
  RESETONSTART: boolean;
  MAPFILENAME: string;
  SAVEFILE: string;
  RUNSPEED: number;
  MAXGAMEOBJECTS: number;
}

export interface Config {
  MAXPLAYERS: number;
  PLAYERFILE: string;
  PLAINTEXTPASSWORD: boolean;
  EXPRESSPORT: number;
  FRONTENDURL: string;
  FRONTENDPATH: string;
  GAME: gameConfig;
}
