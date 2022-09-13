import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  url = '';
  username: string = '';
  loggedIn: boolean = false;
  constructor(private router: Router, private gameService: GameService) {
    let token = localStorage.getItem('token');
    if (token == null && router.url != '/signUn') {
      this.router.navigate(['/signIn']);
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
        let username = localStorage.getItem('username');
        if (username != null) {
          this.username = username;
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
        if (this.url != '/game') return;
        let token = localStorage.getItem('token');
        if (token == null) {
          // this.router.navigate(['/signIn']);
          return;
        }
        this.gameService.setToken(token);

        // this.gameService.getUpdate().subscribe((newGameObjects) => {
        //   this.gameObjects = newGameObjects;
        // });
      }
    });
  }

  ngOnInit(): void {}
}
