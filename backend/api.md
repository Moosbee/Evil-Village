# API

REST:

- POST /login QUERY ?token= BODY { username:string, password:string }
  RES {
  state: 'success'|'failed'|'wrong',
  username: string,
  pass: string,
  token: string,
  }

- POST /makeuser { username:string, password:string }
  RES {
  state: 'success'|'failed'|'taken',
  username: string,
  pass: string,
  token: string,
  }

- GET /config

- POST /config QUERY ?token= BODY {
  ROOTPATH: string;
  MAXPLAYERS: number;
  PLAYERFILE: string;
  PLAINTEXTPASSWORD: boolean;
  FAVICON: number;
  EXPRESSPORT: number;
  FRONTENDURL: string;
  GAME: {
  RESETONSTART: boolean;
  MAPFILENAME: string;
  SAVEFILE: string;
  RUNSPEED: number;
  MAXGAMEOBJECTS: number;
  };
  }

- GET /game/map

- GET /game/map/$id$

- GET /game/maps BODY {
    name: string;
    description: string;
  }[]

- POST /game/main QUERY ?token=

- GET /game/update

- POST /game/update QUERY ?token= BODY {  
  name: string;
  gotox?: number;
  gotoy?: number;
  settle?: boolean;
  newName?: string;
  toggleArmy?: boolean;
  }

- POST /game/updates QUERY ?token= BODY []
  {  
   name: string;
  gotox?: number;
  gotoy?: number;
  settle?: boolean;
  newName?: string;
  toggleArmy?: boolean;
  }
  ]

SOCKET.IO:

- "connection"

- server>client "update"

- "disconnect"
