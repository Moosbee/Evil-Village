import { EventEmitter, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { observable, Observable } from 'rxjs';
import { Update } from '../model/update';

@Injectable({
  providedIn: 'root',
})
export class GameMenuService {
  menuEntries: Update[] = [];
  upda = 'test';  

  setMenusFast = new Observable<string>((observer) => {
    
  });

  constructor() {
    
  }

  setMenu(test: string) {
    this.upda = test;
    // west(test);

  }

  getMenu(){
    return this.menuEntries;
  }

  addMenu() {}

  getMenuFast() {
    return this.setMenusFast;
  }
}

