import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../_models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private auth: AuthService) { }

  // readonly httpOptions = {
  //   headers: new HttpHeaders({
  //     Authorization: `Bearer ${this.auth.token}`
  //   })
  // };

  getUsers() {
    return this.http.get<User[]>(this.baseUrl); // , this.httpOptions
  }

  getUser(id: number) {
    return this.http.get<User>(`${this.baseUrl}/${id}`); // , this.httpOptions
  }

  updateUser(id: number, user: User) {
    return this.http.put(`${this.baseUrl}/${id}`, user);
  }

}
