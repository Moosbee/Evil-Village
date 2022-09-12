import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-menu-box',
  templateUrl: './game-menu-box.component.html',
  styleUrls: ['./game-menu-box.component.scss'],
})
export class GameMenuBoxComponent implements OnInit {
  username = '';
  loggedIn = false;
  constructor(private router: Router) {}

  ngOnInit(): void {
    let username = localStorage.getItem('username');
    if (username != null) {
      this.username = username;
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/signIn']);
  }
}
