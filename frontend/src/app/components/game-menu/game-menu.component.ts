import { Component, OnInit } from '@angular/core';
import { GameMenuService } from 'src/app/service/game-menu.service';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss'],
})
export class GameMenuComponent implements OnInit {
  text = '';

  constructor(private gameMenuService: GameMenuService) {}

  ngOnInit(): void {
    this.gameMenuService.getMenuFast().subscribe((recText)=>{
      this.text=recText;
    })
  }
}
