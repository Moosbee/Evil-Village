# Evil-Village

a Project for School

How to Start:

1. Use docker `docker compose up`

2. semi build
   1. `cd frontend`
   2. `npm i`
   3. `npm run buildToBackend`
   4. `cd ../backend`
   5. `npm i`
   6. `npm start`

3. Dev(2 command lines)
   1. Start terminal 1
   2. `cd backend`
   3. `npm i`
   4. `npm start`
   5. Start terminal 2
   6. `cd frontend`
   7. `npm i`
   8. `npm start`

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
