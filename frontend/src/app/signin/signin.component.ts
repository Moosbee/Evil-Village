import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../model/auth';
import { UserRes } from '../model/user-res';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  user: Auth = {};
  mesage: 'success' | 'taken' | 'failed' | 'wrong' | 'undefined' = 'undefined';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
signin(e: Event) {
    e.preventDefault();
    if (this.user.username != undefined && this.user.pass != undefined) {
      this.authService
        .authUser(this.user.username, this.user.pass)
        .subscribe((auth: UserRes) => {
          this.mesage = auth.state;
          if (
            auth.state == 'success' &&
            typeof auth.id == 'number' &&
            typeof auth.username == 'string' &&
            typeof auth.token == 'string'
          ) {
            localStorage.setItem('id', auth.id.toString());
            localStorage.setItem('username', auth.username);
            localStorage.setItem('token', auth.token);
            this.router.navigate(['/signedin']);
          } else if (auth.state == 'failed' || auth.state == 'taken') {
          }
        });
    }
  }
}
