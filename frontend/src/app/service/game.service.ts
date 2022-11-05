import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRes } from '../model/user-res';
import { Socket } from 'ngx-socket-io';
import { GameObject } from '../model/game-object';
import { Changes } from '../model/changes';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Update } from '../model/update';
import { nameSpaces, Stats } from '../model/stats';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private url = environment.backendLink;
  private token = 'watcher';
  private Update: Update = {
    gameObjects: [],
    menuEntries: [],
  };

  private username = 'watcher';

  private getInfo: EventEmitter<Update> = new EventEmitter(true);

  constructor(
    private http: HttpClient,
    private socket: Socket,
    private authService: AuthService,
    private router: Router
  ) {
    this.socket.fromEvent<string>('update').subscribe((erg) => {
      this.setGameObjects(this.toGameObjects(erg));
    });
  }

  // ============================================================================================== //
  // =========================================== Network ========================================== //
  // ============================================================================================== //

  setToken(token: string) {
    this.token = token;
    console.log('setToken');
    this.authService.authToken(token).subscribe((auth: UserRes) => {
      if (
        auth.state == 'success' &&
        typeof auth.token == 'string' &&
        typeof auth.username == 'string'
      ) {
        this.token = auth.token;
        this.username = auth.username;
      } else if (auth.state == 'failed' || auth.state == 'taken') {
        this.router.navigate(['/signIn']);
      }
    });
  }
  resetToken() {
    console.log('resetToken');
    this.token = 'watcher';
  }
  private getUpdate(): Observable<GameObject[]> {
    let params = new HttpParams().set('token', this.token);
    return this.http.post<GameObject[]>(
      this.url + 'game/main',
      {},
      { params: params }
    );
  }

  private update(changes: Changes): Observable<GameObject[]> {
    let params = new HttpParams().set('token', this.token);
    return this.http.post<GameObject[]>(
      this.url + 'game/update',
      { changes },
      { params: params }
    );
  }

  // ============================================================================================== //
  // ============================================ Info ============================================ //
  // ============================================================================================== //

  getInfoFast() {
    return this.getInfo;
  }

  // ============================================================================================== //
  // ============================================ Menu ============================================ //
  // ============================================================================================== //

  setMenu(Entry: GameObject) {
    this.Update.menuEntries = [];
    this.Update.menuEntries.push(Entry);
    this.updateMenu();
  }

  addMenu(Entry: GameObject) {
    this.Update.menuEntries.push(Entry);
    this.updateMenu();
  }

  removeMenu(Entry: GameObject) {
    this.Update.menuEntries = this.Update.menuEntries.filter(
      (value) => value.name != Entry.name
    );
    this.updateMenu();
  }
  resetMenu() {
    this.Update.menuEntries = [];
    this.updateMenu();
  }

  getMenu() {
    return this.Update.menuEntries;
  }

  // ============================================================================================== //
  // =========================================== Actions ========================================== //
  // ============================================================================================== //

  start() {
    this.getUpdate().subscribe((newGameObjects) => {});
  }

  goToPos(posOnMapX: number, posOnMapY: number) {
    if (this.token == 'watcher') return;

    for (let i = 0; i < this.Update.menuEntries.length; i++) {
      const entry = this.Update.menuEntries[i];
      if (
        entry.typeof.type == 'saveArmy' ||
        entry.typeof.type == 'saveSchiff'
      ) {
        let change: Changes = {
          name: entry.name,
          gotox: posOnMapX,
          gotoy: posOnMapY,
        };

        this.update(change).subscribe((update) => {});
      }
    }
  }

  settle(gameObjectName: string) {
    if (this.token == 'watcher') return;

    let change: Changes = {
      name: gameObjectName,
      settle: true,
    };
    this.update(change).subscribe((update) => {});
  }

  changeName(gameObjectName: string, newName: string) {
    if (this.token == 'watcher') return;

    let change: Changes = {
      name: gameObjectName,
      newName: newName,
    };
    this.update(change).subscribe((update) => {});
  }

  toggleProduktion(gameObjectName: string) {
    if (this.token == 'watcher') return;

    let change: Changes = {
      name: gameObjectName,
      toggleArmy: true,
    };
    this.update(change).subscribe((update) => {});
  }

  // ============================================================================================== //
  // ====================================== Data Manipulation ===================================== //
  // ============================================================================================== //

  private setGameObjects(gameObjects: GameObject[]) {
    this.Update.gameObjects = gameObjects;
    this.reloadMenu();
  }

  private reloadMenu() {
    // this.Update.menuEntries
    let newEntrys: GameObject[] = [];
    this.Update.menuEntries.forEach((value, index) => {
      let value2 = this.Update.gameObjects.find(
        (value3) => value.name == value3.name
      );
      if (value2 != undefined) {
        newEntrys.push(value2);
      }
    });

    this.Update.menuEntries = newEntrys;

    this.updateMenu();
  }
  // private reloadMenu() {
  //   this.Update.menuEntries = this.Update.gameObjects.filter((value) => {
  //     return this.Update.menuEntries.some(
  //       (value2) => value.name == value2.name
  //     );
  //   });
  //   this.updateMenu();
  // }

  private updateMenu() {
    this.reCalcStats();
    this.getInfo.emit(this.Update);
  }

  private toGameObjects(GameObjectsString: string): GameObject[] {
    if (GameObjectsString == '') {
      GameObjectsString = '[]';
    }

    let GameObjects: GameObject[] = JSON.parse(GameObjectsString);

    return GameObjects;
  }

  // ============================================================================================== //
  // ========================================= Statistics ========================================= //
  // ============================================================================================== //

  private reCalcStats() {
    // prettier-ignore
    let newStats: Stats = {
      all: {
        all: {count: 0,avgStrength: 0,minStrength: 0,maxStrength: 0},
        army: {count: 0,moving: 0,avgStrength: 0,minStrength: 0,maxStrength: 0},
        schiff: {count: 0,moving: 0,avgStrength: 0,minStrength: 0,maxStrength: 0},
        stadt: {count: 0,producing: 0,capitals: 0,avgStrength: 0,minStrength: 0,maxStrength: 0,avgPopulation: 0,minPopulation: 0,maxPopulation: 0,avgSpeed: 0,minSpeed: 0,maxSpeed: 0},
      },
      your: {
        all: {count: 0,avgStrength: 0,minStrength: 0,maxStrength: 0},
        army: {count: 0,moving: 0,avgStrength: 0,minStrength: 0,maxStrength: 0},
        schiff: {count: 0,moving: 0,avgStrength: 0,minStrength: 0,maxStrength: 0},
        stadt: {count: 0,producing: 0,capitals: 0,avgStrength: 0,minStrength: 0,maxStrength: 0,avgPopulation: 0,minPopulation: 0,maxPopulation: 0,avgSpeed: 0,minSpeed: 0,maxSpeed: 0},
      },
      notYour: {
        all: {count: 0,avgStrength: 0,minStrength: 0,maxStrength: 0},
        army: {count: 0,moving: 0,avgStrength: 0,minStrength: 0,maxStrength: 0},
        schiff: {count: 0,moving: 0,avgStrength: 0,minStrength: 0,maxStrength: 0},
        stadt: {count: 0,producing: 0,capitals: 0,avgStrength: 0,minStrength: 0,maxStrength: 0,avgPopulation: 0,minPopulation: 0,maxPopulation: 0,avgSpeed: 0,minSpeed: 0,maxSpeed: 0},
      },
    };

    let objectsToCalc: GameObject[];
    if (this.Update.menuEntries.length == 0) {
      objectsToCalc = this.Update.gameObjects;
    } else {
      objectsToCalc = this.Update.menuEntries;
    }

    for (let i = 0; i < objectsToCalc.length; i++) {
      newStats = this.calcStatPerObj(newStats, objectsToCalc[i]);
    }
    newStats.all.all.avgStrength = Math.floor(
      newStats.all.all.avgStrength / newStats.all.all.count
    );
    newStats.all.army.avgStrength = Math.floor(
      newStats.all.army.avgStrength / newStats.all.army.count
    );
    newStats.all.schiff.avgStrength = Math.floor(
      newStats.all.schiff.avgStrength / newStats.all.schiff.count
    );
    newStats.all.stadt.avgPopulation = Math.floor(
      newStats.all.stadt.avgPopulation / newStats.all.stadt.count
    );
    newStats.all.stadt.avgSpeed = Math.floor(
      newStats.all.stadt.avgSpeed / newStats.all.stadt.count
    );
    newStats.all.stadt.avgStrength = Math.floor(
      newStats.all.stadt.avgStrength / newStats.all.stadt.count
    );
    newStats.your.all.avgStrength = Math.floor(
      newStats.your.all.avgStrength / newStats.your.all.count
    );
    newStats.your.army.avgStrength = Math.floor(
      newStats.your.army.avgStrength / newStats.your.army.count
    );
    newStats.your.schiff.avgStrength = Math.floor(
      newStats.your.schiff.avgStrength / newStats.your.schiff.count
    );
    newStats.your.stadt.avgPopulation = Math.floor(
      newStats.your.stadt.avgPopulation / newStats.your.stadt.count
    );
    newStats.your.stadt.avgSpeed = Math.floor(
      newStats.your.stadt.avgSpeed / newStats.your.stadt.count
    );
    newStats.your.stadt.avgStrength = Math.floor(
      newStats.your.stadt.avgStrength / newStats.your.stadt.count
    );
    newStats.notYour.all.avgStrength = Math.floor(
      newStats.notYour.all.avgStrength / newStats.notYour.all.count
    );
    newStats.notYour.army.avgStrength = Math.floor(
      newStats.notYour.army.avgStrength / newStats.notYour.army.count
    );
    newStats.notYour.schiff.avgStrength = Math.floor(
      newStats.notYour.schiff.avgStrength / newStats.notYour.schiff.count
    );
    newStats.notYour.stadt.avgPopulation = Math.floor(
      newStats.notYour.stadt.avgPopulation / newStats.notYour.stadt.count
    );
    newStats.notYour.stadt.avgSpeed = Math.floor(
      newStats.notYour.stadt.avgSpeed / newStats.notYour.stadt.count
    );
    newStats.notYour.stadt.avgStrength = Math.floor(
      newStats.notYour.stadt.avgStrength / newStats.notYour.stadt.count
    );
    this.Update.stats = newStats;
  }

  private calcStatPerObj(stats: Stats, gameObject: GameObject): Stats {
    stats.all = this.calcNameSpacePerObj(stats.all, gameObject);

    if (gameObject.owner == this.username) {
      stats.your = this.calcNameSpacePerObj(stats.your, gameObject);
    } else {
      stats.notYour = this.calcNameSpacePerObj(stats.notYour, gameObject);
    }
    return stats;
  }

  private calcNameSpacePerObj(
    nameSpace: nameSpaces,
    gameObject: GameObject
  ): nameSpaces {
    nameSpace.all.count = nameSpace.all.count + 1;

    let zwischenCalcVar = this.calcAvgMinMaxObj(
      gameObject.strength,
      nameSpace.all.avgStrength,
      nameSpace.all.minStrength,
      nameSpace.all.maxStrength
    );
    nameSpace.all.avgStrength = zwischenCalcVar.newAvg;
    nameSpace.all.minStrength = zwischenCalcVar.newMin;
    nameSpace.all.maxStrength = zwischenCalcVar.newMax;

    if (gameObject.typeof.type == 'saveArmy') {
      nameSpace.army.count = nameSpace.army.count + 1;
      if (
        gameObject.x != gameObject.typeof.gotox ||
        gameObject.y != gameObject.typeof.gotoy
      ) {
        nameSpace.army.moving = nameSpace.army.moving + 1;
      }

      let zwischenCalcVar = this.calcAvgMinMaxObj(
        gameObject.strength,
        nameSpace.army.avgStrength,
        nameSpace.army.minStrength,
        nameSpace.army.maxStrength
      );
      nameSpace.army.avgStrength = zwischenCalcVar.newAvg;
      nameSpace.army.minStrength = zwischenCalcVar.newMin;
      nameSpace.army.maxStrength = zwischenCalcVar.newMax;
    }
    if (gameObject.typeof.type == 'saveSchiff') {
      nameSpace.schiff.count = nameSpace.schiff.count + 1;
      if (
        gameObject.x != gameObject.typeof.gotox ||
        gameObject.y != gameObject.typeof.gotoy
      ) {
        nameSpace.army.moving = nameSpace.army.moving + 1;
      }

      let zwischenCalcVar = this.calcAvgMinMaxObj(
        gameObject.strength,
        nameSpace.schiff.avgStrength,
        nameSpace.schiff.minStrength,
        nameSpace.schiff.maxStrength
      );
      nameSpace.schiff.avgStrength = zwischenCalcVar.newAvg;
      nameSpace.schiff.minStrength = zwischenCalcVar.newMin;
      nameSpace.schiff.maxStrength = zwischenCalcVar.newMax;
    }
    if (gameObject.typeof.type == 'saveStadt') {
      nameSpace.stadt.count = nameSpace.stadt.count + 1;
      if (gameObject.typeof.capital) {
        nameSpace.stadt.capitals = nameSpace.stadt.capitals + 1;
      }
      if (gameObject.typeof.production) {
        nameSpace.stadt.producing = nameSpace.stadt.producing + 1;
      }

      let zwischenCalcVar = this.calcAvgMinMaxObj(
        gameObject.strength,
        nameSpace.stadt.avgStrength,
        nameSpace.stadt.minStrength,
        nameSpace.stadt.maxStrength
      );
      nameSpace.stadt.avgStrength = zwischenCalcVar.newAvg;
      nameSpace.stadt.minStrength = zwischenCalcVar.newMin;
      nameSpace.stadt.maxStrength = zwischenCalcVar.newMax;

      zwischenCalcVar = this.calcAvgMinMaxObj(
        gameObject.typeof.population,
        nameSpace.stadt.avgPopulation,
        nameSpace.stadt.minPopulation,
        nameSpace.stadt.maxPopulation
      );
      nameSpace.stadt.avgPopulation = zwischenCalcVar.newAvg;
      nameSpace.stadt.minPopulation = zwischenCalcVar.newMin;
      nameSpace.stadt.maxPopulation = zwischenCalcVar.newMax;

      zwischenCalcVar = this.calcAvgMinMaxObj(
        gameObject.typeof.speed,
        nameSpace.stadt.avgSpeed,
        nameSpace.stadt.minSpeed,
        nameSpace.stadt.maxSpeed
      );
      nameSpace.stadt.avgSpeed = zwischenCalcVar.newAvg;
      nameSpace.stadt.minSpeed = zwischenCalcVar.newMin;
      nameSpace.stadt.maxSpeed = zwischenCalcVar.newMax;
    }

    return nameSpace;
  }

  private calcAvgMinMaxObj(
    newVal: number,
    oldAvg: number,
    oldMin: number,
    oldMax: number
  ): {
    newAvg: number;
    newMin: number;
    newMax: number;
  } {
    let newValues = {
      newAvg: oldAvg + newVal,
      newMax: 0,
      newMin: 0,
    };

    if (newVal < oldMin) {
      newValues.newMin = newVal;
    }
    if (newVal > oldMax) {
      newValues.newMax = newVal;
    }

    return newValues;
  }
}
