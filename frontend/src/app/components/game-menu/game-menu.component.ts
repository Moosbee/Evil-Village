import { Component, Input, OnInit } from '@angular/core';
import { Update } from 'src/app/model/update';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss'],
})
export class GameMenuComponent implements OnInit {
  @Input() username: string = '';
  menuEntries: Update[] = [];
  nameRegex = '^([^"´\']{5,})$';

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getMenuFast().subscribe((menuEntries: Update[]) => {
      this.menuEntries = menuEntries;
    });
  }

  isSameGameObject(index: number, gameObject: Update) {
    return gameObject.name;
  }

  settle(gameObjectName: string) {
    this.gameService.settle(gameObjectName);
  }

  toggleProduktion(gameObjectName: string) {
    this.gameService.toggleProduktion(gameObjectName);
  }

  changeName(e: Event, input: HTMLInputElement, nameBefore: string) {
    let re = new RegExp(this.nameRegex);
    let inpText = input.value;
    if (re.test(inpText)) {
      // alert(`Yes:${inpText}`);
      this.gameService.changeName(nameBefore, inpText);
    } else {
      // alert(`No:${inpText}`);
    }
  }

  settleAll() {
    this.gameService.settleAll();
  }
  toggleProduktionAll() {
    this.gameService.toggleProduktionAll();
  }
}
