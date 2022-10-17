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

  constructor(private http: HttpClient) {}
  createUser(user: string, pass: string): Observable<UserRes> {
    return this.http.post<UserRes>(this.url + 'makeuser', {
      username: user,
      password: pass,
    });
  }

  authUser(user: string, pass: string): Observable<UserRes> {
    return this.http.post<UserRes>(this.url + 'login', {
      username: user,
      password: pass,
    });
  }

  authToken(token: string): Observable<UserRes> {
    // let params = new HttpParams().set('token', token);, { params: params }
    // console.log(token);
    const options = token
      ? { params: new HttpParams().set('token', token) }
      : {};

    // const options = new HttpParams({ fromString: `token=${token}` });

    return this.http.post<UserRes>(this.url + 'login', {}, options);
  }
}
