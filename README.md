# Evil-Village

a Project for School

How to Start:

- Run `npm install`
- Run `npm start`

Needs 2 or more Players to be good

Map: <https://azgaar.github.io/Fantasy-Map-Generator/>

API:

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

- POST /config/$config$ ?token= BODY {
  newValue: number|string|boolean
  }

- GET /game/map

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

Terminal-Color:

- game InfoMessages:cyan
