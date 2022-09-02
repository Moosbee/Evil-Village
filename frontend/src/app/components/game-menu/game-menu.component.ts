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

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getMenuFast().subscribe((menuEntries: Update[]) => {
      this.menuEntries = menuEntries;
    });
  }
}
