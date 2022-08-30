import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRes } from '../model/user-res';
import { Socket } from 'ngx-socket-io';
import { Update } from '../model/update';
import { Changes } from '../model/changes';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private url = environment.backendLink;
  private token = 'ghg';

  constructor(
    private http: HttpClient,
    private socket: Socket,
    private authService: AuthService,
    private router: Router
  ) {}

  setToken(token: string) {
    this.token = token;
    this.authService.authToken(token).subscribe((auth: UserRes) => {
      if (auth.state == 'success' && typeof auth.token == 'string') {
        this.token = auth.token;
      } else if (auth.state == 'failed' || auth.state == 'taken') {
        this.router.navigate(['/signIn']);
      }
    });
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
