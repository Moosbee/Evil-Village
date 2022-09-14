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
  loggedIn: boolean;

  constructor(private authService: AuthService, private router: Router) {
    if (localStorage.getItem('token') != null) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (this.loggedIn && token != null) {
      this.authService.authToken(token).subscribe((auth: UserRes) => {
        if (
          auth.state == 'success' &&
          typeof auth.username == 'string' &&
          typeof auth.token == 'string'
        ) {
          localStorage.setItem('username', auth.username);
          localStorage.setItem('token', auth.token);
          this.loggedIn = true;
          this.router.navigate(['/signedIn']);
        }
      });
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
            typeof auth.username == 'string' &&
            typeof auth.token == 'string' &&
            typeof auth.adminLevel == 'number'
          ) {
            localStorage.setItem('username', auth.username);
            localStorage.setItem('token', auth.token);
            localStorage.setItem('adminLevel', auth.adminLevel.toString());
            this.loggedIn = true;
            setTimeout(() => {
              this.router.navigate(['/game']);
            }, 500);
          } else if (auth.state == 'failed' || auth.state == 'taken') {
          }
        });
    }
  }
}
