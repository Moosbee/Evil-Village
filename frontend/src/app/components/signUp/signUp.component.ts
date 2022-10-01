import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../model/auth';
import { UserRes } from '../../model/user-res';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-signUp',
  templateUrl: './signUp.component.html',
  styleUrls: ['./signUp.component.scss'],
})
export class SignUpComponent implements OnInit {
  user: Auth = {};
  message: 'success' | 'taken' | 'failed' | 'wrong' | 'undefined' = 'undefined';
  pass2?: string;
  showPasswd = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  signUp(e: Event) {
    e.preventDefault();
    if (this.user.username == undefined || this.user.pass == undefined) {
      return;
    }
    if (this.user.pass != this.pass2) {
      this.message = 'wrong';
      return;
    }
    this.authService
      .createUser(this.user.username, this.user.pass)
      .subscribe((auth: UserRes) => {
        this.message = auth.state;
        if (
          auth.state == 'success' &&
          typeof auth.username == 'string' &&
          typeof auth.token == 'string'
        ) {
          localStorage.setItem('username', auth.username);
          localStorage.setItem('token', auth.token);
          setTimeout(() => {
            this.router.navigate(['/signIn']);
          }, 1100);
        }
      });
  }
}
