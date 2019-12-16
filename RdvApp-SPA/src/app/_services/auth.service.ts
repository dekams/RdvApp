import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly token = 'token';
  readonly baseUrl = 'https://localhost:5001/api/auth';

  constructor(private http: HttpClient) { }

  register(model: any) {
    return this.http.post(`${this.baseUrl}/register`, model);
  }

  login(model: any) {
    return this.http.post(`${this.baseUrl}/login`, model)
      .pipe(
        map((response: any) => {
          const user = response;

          if (user) {
            localStorage.setItem(this.token, user.token);
          }
        })
      );
  }

  isLoggedIn() {
    return !! localStorage.getItem(this.token);
  }

  logout() {
    localStorage.removeItem(this.token);
  }

}
