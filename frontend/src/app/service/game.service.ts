import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRes } from '../model/user-res';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private url = environment.backendLink;
  private token = 'ghg';

  constructor(private http: HttpClient, private socket: Socket) {}
  getUpdate(token: string): Observable<UserRes> {
    let params = new HttpParams().set('token', this.token);
    return this.http.post<UserRes>(
      this.url + 'makeuser',
      {},
      { params: params }
    );
  }

  getMap(): Observable<UserRes> {
    return this.http.post<UserRes>(
      this.url + 'makeuser',
      {},
    );
  }

  update(user: string, pass: string): Observable<UserRes> {
    let params = new HttpParams().set('token', this.token);
    return this.http.post<UserRes>(this.url + 'login', {}, { params: params });
  }
  getUpdateSocket(): Observable<String> {
    const socketGetObjects = new Observable<String>((observer) => {
      this.socket.fromEvent<String>('update').subscribe((erg) => {
        observer.next(erg);
      });
    });
    return socketGetObjects;
  }

  // async importGameObjects() {
  //   let savedGameFile: string;

  //   try {
  //     savedGameFile = await readFile(config.rootPath + config.Game.saveFile, {
  //       encoding: 'utf8',
  //     });
  //   } catch (e) {
  //     savedGameFile = '[]';
  //     throw e;
  //   }

  //   if (savedGameFile == '' || config.Game.ResetOnStart) {
  //     savedGameFile = '[]';
  //   }

  //   let savedGame: saveFile[] = JSON.parse(savedGameFile);

  //   for (let i = 0; i < savedGame.length; i++) {
  //     const element = savedGame[i];
  //     let savedObject: armee | schiff | stadt;
  //     switch (element.typeof.type) {
  //       case 'saveArmy':
  //         savedObject = new armee(
  //           element.x,
  //           element.y,
  //           element.owner,
  //           element.strength,
  //           element.id,
  //           element.size,
  //           element.typeof.gotox,
  //           element.typeof.gotoy
  //         );
  //         break;
  //       case 'saveSchiff':
  //         savedObject = new schiff(
  //           element.x,
  //           element.y,
  //           element.owner,
  //           element.strength,
  //           element.id,
  //           element.size,
  //           element.typeof.gotox,
  //           element.typeof.gotoy
  //         );
  //         break;
  //       case 'saveStadt':
  //         savedObject = new stadt(
  //           element.x,
  //           element.y,
  //           element.owner,
  //           element.strength,
  //           element.id,
  //           element.typeof.population,
  //           element.size,
  //           element.typeof.capital,
  //           element.typeof.speed,
  //           element.typeof.makingofarmy
  //         );
  //         break;
  //       default:
  //         continue;
  //         break;
  //     }
  //     this.gameObjects.push(savedObject);
  //   }
  // }
}
