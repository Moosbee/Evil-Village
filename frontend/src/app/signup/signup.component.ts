import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../model/auth';
import { UserRes } from '../model/user-res';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  user: Auth = {};
  mesage: 'success' | 'taken' | 'failed' | 'wrong' | 'undefined' = 'undefined';
  pass2?: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  signup(e: Event) {
    e.preventDefault();
    if (
      this.user.username != undefined &&
      this.user.pass != undefined &&
      this.user.pass == this.pass2
    ) {
      this.authService
        .createUser(this.user.username, this.user.pass)
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
            this.router.navigate(['/signin']);
          } else if (auth.state == 'failed' || auth.state == 'taken') {
          }
        });
    }
  }
}
