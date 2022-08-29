# Evil-Village

a Project for School

How to Start:

- Run ```npm install```
- Run ```npm start```

Needs 2 or more Players to be good

Map: <https://azgaar.github.io/Fantasy-Map-Generator/>

API:

REST:

- POST /login QUERY token= BODY { username:string, password:string }
  RES {
  
  state: 'success'|'failed'|'wrong',
  
  id: number,
  
  username: string,
  
  pass: string,
  
  token: string,
  
  }

- POST /makeuser { username:string, password:string } RES {
  
  state: 'success'|'failed'|'taken',
  
  id: number,
  
  username: string,
  
  pass: string,
  
  token: string,
  
  }

- GET /config

- POST /config QUERY token=

- GET /game/map

- POST /game/main QUERY token=

- GET /game/update

- POST /game/update QUERY ?token= BODY {  
  id: number;
  gotox?: number;
  gotoy?: number;
  settle?: boolean;
  }

SOCKET.IO:

- "connection"

- server>client "update"

- "disconnect"

Terminal-Color:

- game InfoMessages:cyan
  