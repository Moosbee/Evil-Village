import { EventEmitter, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { observable, Observable } from 'rxjs';
import { Update } from '../model/update';

@Injectable({
  providedIn: 'root',
})
export class GameMenuService {
  menuEntries: Update[] = [];

  setMenusFast: EventEmitter<Update[]> = new EventEmitter(true);

  constructor() {}

  setMenu(Entry: Update) {
    this.menuEntries = [];
    this.menuEntries.push(Entry);
    this.setMenusFast.emit(this.menuEntries);
    // west(test);
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
}
