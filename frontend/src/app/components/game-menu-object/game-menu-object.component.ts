import { Component, Input, OnInit } from '@angular/core';
import { GameObject } from 'src/app/model/game-object';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-game-menu-object',
  templateUrl: './game-menu-object.component.html',
  styleUrls: ['./game-menu-object.component.scss'],
})
export class GameMenuObjectComponent implements OnInit {
  @Input() username: string = '';
  @Input() menuEntry: GameObject = {
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

  nameRegex = '^([a-zA-Z0-9]{5,})$';

  constructor(private gameService: GameService) {}

  ngOnInit(): void {}

  settle() {
    this.gameService.settle(this.menuEntry.name);
  }

  toggleProduktion() {
    this.gameService.toggleProduktion(this.menuEntry.name);
  }

  changeName(e: Event, input: HTMLInputElement) {
    let re = new RegExp(this.nameRegex);
    let inpText = input.value;
    if (re.test(inpText)) {
      // alert(`Yes:${inpText}`);
      this.gameService.changeName(this.menuEntry.name, inpText);
    } else {
      // alert(`No:${inpText}`);
      input.classList.toggle('invalide');
      input.value = this.menuEntry.name;
      setTimeout(() => {
        input.classList.toggle('invalide');
      }, 1000);
    }
  }
}
