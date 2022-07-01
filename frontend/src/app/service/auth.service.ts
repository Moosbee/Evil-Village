import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserRes } from '../model/user-res';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.backendLink;
  private token = 'ghg';

  constructor(private http: HttpClient) {}
  createUser(user: string, pass: string): Observable<UserRes> {
    let params = new HttpParams().set('token', this.token);
    return this.http.post<UserRes>(
      this.url + 'makeuser',
      {
        username: user,
        password: pass,
      },
      { params: params }
    );
  }

  authUser(user: string, pass: string): Observable<UserRes> {
    let params = new HttpParams().set('token', this.token);
    return this.http.post<UserRes>(
      this.url + 'login',
      {
        username: user,
        password: pass,
      },
      { params: params }
    );
  }
}
