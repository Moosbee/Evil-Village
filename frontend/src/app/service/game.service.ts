import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRes } from '../model/user-res';
import { Socket } from 'ngx-socket-io';
import { Update } from '../model/update';
import { Changes } from '../model/changes';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private url = environment.backendLink;
  private token = 'ghg';

  constructor(private http: HttpClient, private socket: Socket) {}

  setToken(token: string) {
    this.token = token;
  }
  getUpdate(): Observable<Update[]> {
    let params = new HttpParams().set('token', this.token);
    return this.http.post<Update[]>(
      this.url + 'game/main',
      {},
      { params: params }
    );
  }

  update(changes: Changes): Observable<Update[]> {
    if (this.token == 'ghg') {
      throw new Error('No Token');
    }
    let params = new HttpParams().set('token', this.token);
    return this.http.post<Update[]>(
      this.url + 'game/update',
      { changes },
      { params: params }
    );
  }
  getUpdateSocket(): Observable<Update[]> {
    const socketGetObjects = new Observable<Update[]>((observer) => {
      this.socket.fromEvent<string>('update').subscribe((erg) => {
        observer.next(this.toGameObjects(erg));
      });
    });
    return socketGetObjects;
  }

  private toGameObjects(GameObjectsString: string): Update[] {
    if (GameObjectsString == '') {
      GameObjectsString = '[]';
    }

    let GameObjects: Update[] = JSON.parse(GameObjectsString);

    return GameObjects;
  }
}
