import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  name = environment.name;
  username = '';
  url: string = '';
  loggedIn = false;
  opened = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
        let token = localStorage.getItem('token');
        let username = localStorage.getItem('username');
        if (token != null && username != null) {
          this.username = username;
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      }
    });
  }

  ngOnInit(): void {}

  toggleGameMenu(e: MouseEvent, menu: HTMLDivElement) {}
}
