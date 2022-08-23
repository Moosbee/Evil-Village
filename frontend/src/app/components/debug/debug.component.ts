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
  zoom = 1;
  left = -50;
  left2 = -50;

  constructor() {}

  ngOnInit(): void {
    this.id = localStorage.getItem('id');
    this.username = localStorage.getItem('username');
    this.token = localStorage.getItem('token');
  }

  apply(inp: HTMLInputElement, inpLeft: HTMLInputElement) {
    let text = +inp.value;
    let text2 = +inpLeft.value;
    this.zoom = text;
    this.left2 = text2;
    let diff = 50 / this.zoom - 50;
    this.left = this.left2 - diff;
  }
}
