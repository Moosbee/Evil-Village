import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRes } from '../model/user-res';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private url = environment.backendLink;
  private token = 'ghg';

  constructor(private http: HttpClient) {}
  getUpdate(user: string, pass: string): Observable<UserRes> {
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

  update(user: string, pass: string): Observable<UserRes> {
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
