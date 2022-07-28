import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRes } from '../model/user-res';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private url = environment.backendLink;
  private token = 'ghg';

  constructor(private http: HttpClient, private socket: Socket) {}
  getUpdate(token: string): Observable<UserRes> {
    let params = new HttpParams().set('token', this.token);
    return this.http.post<UserRes>(
      this.url + 'makeuser',
      {},
      { params: params }
    );
  }

  update(user: string, pass: string): Observable<UserRes> {
    let params = new HttpParams().set('token', this.token);
    return this.http.post<UserRes>(this.url + 'login', {}, { params: params });
  }
  getUpdateSocket(): Observable<String> {
    const socketGetObjects = new Observable<String>((observer) => {
      this.socket.fromEvent<String>('update').subscribe((erg) => {
        observer.next(erg);
      });
    });
    return socketGetObjects;
  }
}
