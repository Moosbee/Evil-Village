import { Component, Input, OnInit } from '@angular/core';
import { GameObject } from 'src/app/model/game-object';
import { Stats } from 'src/app/model/stats';
import { Update } from 'src/app/model/update';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss'],
})
export class GameMenuComponent implements OnInit {
  @Input() username: string = '';
  menuEntries: GameObject[] = [];
  // prettier-ignore
  stats: Stats = {
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
  entryLengthBefore = 0;
  loggedIn = false;
  page = -1;
  expanded = false;
  shownMenuEntry: GameObject = {
    name: 'none',
    owner: 'none',
    size: 0,
    strength: 0,
    x: 0,
    y: 0,
    typeof: {
      type: 'saveStadt',
      capital: false,
      makingofarmy: 0,
      population: 0,
      production: false,
      speed: 0,
    },
  };

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getInfoFast().subscribe((Update: Update) => {
      if (!(this.entryLengthBefore == Update.menuEntries.length)) {
        this.page = Update.menuEntries.length - 1;
      }
      this.entryLengthBefore = Update.menuEntries.length;
      this.menuEntries = Update.menuEntries;
      if (this.page >= Update.menuEntries.length) {
        this.page = Update.menuEntries.length - 1;
      }
      if (Update.stats != undefined) {
        this.stats = Update.stats;
      }
      this.shownMenuEntry = this.menuEntries[this.page];
    });
  }

  next() {
    if (!(this.page + 1 >= this.menuEntries.length)) {
      this.page = this.page + 1;
      this.shownMenuEntry = this.menuEntries[this.page];
    } else {
      this.page = -1;
    }
  }
  before() {
    if (!(this.page - 1 < -1)) {
      this.page = this.page - 1;
      this.shownMenuEntry = this.menuEntries[this.page];
    } else {
      this.page = this.menuEntries.length - 1;
    }
  }

  isSameGameObject(index: number, gameObject: GameObject) {
    return gameObject.name;
  }

  settleAll(condition?: boolean) {
    for (let i = 0; i < this.menuEntries.length; i++) {
      const entry = this.menuEntries[i];
      if (condition == undefined) {
        this.gameService.settle(entry.name);
        continue;
      }
      if (
        (entry.typeof.type == 'saveArmy' ||
          entry.typeof.type == 'saveSchiff') &&
        condition == false
      ) {
        this.gameService.settle(entry.name);
      } else if (entry.typeof.type == 'saveStadt' && condition == true) {
        this.gameService.settle(entry.name);
      }
    }
  }
  ProduktionAll(condition?: boolean) {
    for (let i = 0; i < this.menuEntries.length; i++) {
      const entry = this.menuEntries[i];
      if (entry.typeof.type == 'saveStadt') {
        if (condition == undefined) {
          this.gameService.toggleProduktion(entry.name);
          continue;
        } else if (condition && !entry.typeof.production) {
          this.gameService.toggleProduktion(entry.name);
        } else if (!condition && entry.typeof.production) {
          this.gameService.toggleProduktion(entry.name);
        }
      }
    }
  }
}
