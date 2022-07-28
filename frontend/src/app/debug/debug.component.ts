import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss'],
})
export class DebugComponent implements OnInit {
  id: string | null = '';
  username: string | null = '';
  token: string | null = '';
  players: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.id = localStorage.getItem('id');
    this.username = localStorage.getItem('username');
    this.token = localStorage.getItem('token');
  }
}
