import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../model/auth';
import { UserRes } from '../../model/user-res';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-signIn',
  templateUrl: './signIn.component.html',
  styleUrls: ['./signIn.component.scss'],
})
export class SignInComponent implements OnInit {
  user: Auth = {};
  message: 'success' | 'taken' | 'failed' | 'wrong' | 'undefined' = 'undefined';
  loggedin: boolean;

  constructor(private authService: AuthService, private router: Router) {
    if (localStorage.getItem('token') != null) {
      this.loggedin = true;
    } else {
      this.loggedin = false;
    }
  }

  ngOnInit(): void {
    if (!this.loggedin) {
      this.router.navigate(['/signedIn']);
    }
  }
  signIn(e: Event) {
    e.preventDefault();
    if (this.user.username != undefined && this.user.pass != undefined) {
      this.authService
        .authUser(this.user.username, this.user.pass)
        .subscribe((auth: UserRes) => {
          this.message = auth.state;
          if (
            auth.state == 'success' &&
            typeof auth.id == 'number' &&
            typeof auth.username == 'string' &&
            typeof auth.token == 'string'
          ) {
            localStorage.setItem('id', auth.id.toString());
            localStorage.setItem('username', auth.username);
            localStorage.setItem('token', auth.token);
            this.loggedin = true;
            this.router.navigate(['/signedIn']);
          } else if (auth.state == 'failed' || auth.state == 'taken') {
          }
        });
    }
  }
}
