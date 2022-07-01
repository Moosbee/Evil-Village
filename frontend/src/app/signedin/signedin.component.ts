import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signedin',
  templateUrl: './signedin.component.html',
  styleUrls: ['./signedin.component.scss'],
})
export class SignedinComponent implements OnInit {
  constructor(private router: Router) {}
  username?: string;
  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem('username');
    if (token != null && username != null) {
      this.username = username;
    } else {
      this.router.navigate(['/signin']);
    }
  }
}
