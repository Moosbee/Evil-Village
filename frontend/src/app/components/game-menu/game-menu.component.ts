import { Component, Input, OnInit } from '@angular/core';
import { Update } from 'src/app/model/update';
import { GameMenuService } from 'src/app/service/game-menu.service';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss'],
})
export class GameMenuComponent implements OnInit {
  @Input() username: string = '';
  menuEntries: Update[] = [];

  constructor(private gameMenuService: GameMenuService) {}

  ngOnInit(): void {
    this.gameMenuService.getMenuFast().subscribe((menuEntries: Update[]) => {
      this.menuEntries = menuEntries;
    });
  }
}
