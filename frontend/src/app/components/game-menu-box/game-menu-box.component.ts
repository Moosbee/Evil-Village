import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-game-menu-box',
  templateUrl: './game-menu-box.component.html',
  styleUrls: ['./game-menu-box.component.scss'],
})
export class GameMenuBoxComponent implements OnInit {
  @Input() username = '';
  @Input() loggedIn = false;
  @Input() adminLevel = 0;
  constructor(private router: Router, private gameService: GameService) {}

  ngOnInit(): void {}

  logout() {
    localStorage.clear();
    this.gameService.resetToken();
    this.router.navigate(['/signIn']);
  }
}
