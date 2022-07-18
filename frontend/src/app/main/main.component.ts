import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(private router: Router,private gameService:GameService) {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem('username');
    if (token != null && username != null) {
    } else {
      this.router.navigate(['/signin']);
    }
  }
}
