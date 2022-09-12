import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
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
  private token = 'watcher';
  private menuEntries: Update[] = [];

  private setMenusFast: EventEmitter<Update[]> = new EventEmitter(true);

  constructor(
    private http: HttpClient,
    private socket: Socket,
    private authService: AuthService,
    private router: Router
  ) {}

  // ============================================================================================== //
  // ============================================ Start =========================================== //
  // ============================================================================================== //

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
    if (this.token == 'watcher') throw new Error('No Token');
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

  // ============================================================================================== //
  // ============================================ Menu ============================================ //
  // ============================================================================================== //

  setMenu(Entry: Update) {
    this.menuEntries = [];
    this.menuEntries.push(Entry);
    this.setMenusFast.emit(this.menuEntries);
  }

  addMenu(Entry: Update) {
    this.menuEntries.push(Entry);
    this.setMenusFast.emit(this.menuEntries);
  }

  removeMenu(Entry: Update) {
    this.menuEntries = this.menuEntries.filter(
      (value) => value.name != Entry.name
    );
    this.setMenusFast.emit(this.menuEntries);
  }
  resetMenu() {
    this.menuEntries = [];
    this.setMenusFast.emit(this.menuEntries);
  }

  updateMenu(gameObjects: Update[]) {
    this.menuEntries = gameObjects.filter((value) => {
      return this.menuEntries.some((value2) => value.name == value2.name);
    });
    this.setMenusFast.emit(this.menuEntries);
  }

  getMenu() {
    return this.menuEntries;
  }
  getMenuFast() {
    return this.setMenusFast;
  }

  // ============================================================================================== //
  // =========================================== Actions ========================================== //
  // ============================================================================================== //

  goToPos(posOnMapX: number, posOnMapY: number) {
    for (let i = 0; i < this.menuEntries.length; i++) {
      const entry = this.menuEntries[i];
      let change: Changes = {
        name: entry.name,
        gotox: posOnMapX,
        gotoy: posOnMapY,
      };

      this.update(change).subscribe((update) => {});
    }
  }

  settle(gameObjectName: string) {
    let change: Changes = {
      name: gameObjectName,
      settle: true,
    };
    this.update(change).subscribe((update) => {});
  }

  settleAll() {
    for (let i = 0; i < this.menuEntries.length; i++) {
      const entry = this.menuEntries[i];
      this.settle(entry.name);
    }
  }

  changeName(gameObjectName: string, newName: string) {
    let change: Changes = {
      name: gameObjectName,
      newName: newName,
    };
    this.update(change).subscribe((update) => {});
  }

  toggleProduktion(gameObjectName: string) {
    let change: Changes = {
      name: gameObjectName,
      toggleArmy: true,
    };
    this.update(change).subscribe((update) => {});
  }

  toggleProduktionAll() {
    for (let i = 0; i < this.menuEntries.length; i++) {
      const entry = this.menuEntries[i];
      this.toggleProduktion(entry.name);
    }
  }

  private toGameObjects(GameObjectsString: string): Update[] {
    if (GameObjectsString == '') {
      GameObjectsString = '[]';
    }

    let GameObjects: Update[] = JSON.parse(GameObjectsString);

    return GameObjects;
  }
}
