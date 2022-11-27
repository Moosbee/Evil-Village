import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signedIn',
  templateUrl: './signedIn.component.html',
  styleUrls: ['./signedIn.component.scss'],
})
export class SignedInComponent implements OnInit {
  constructor(private router: Router) {}
  username?: string;
  ngOnInit(): void {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem('username');
    if (token != null && username != null) {
      this.username = username;
    } else {
      this.router.navigate(['/signIn']);
    }
  }
}
