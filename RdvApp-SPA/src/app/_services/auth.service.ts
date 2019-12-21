import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly token = 'token';
  private readonly name = 'unique_name';
  private readonly baseUrl = 'https://localhost:5001/api/auth';
  private readonly jwtHelper = new JwtHelperService();
  private decodedToken: any;

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
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            localStorage.setItem(this.name, this.decodedToken.unique_name);
          }
        })
      );
  }

  isLoggedIn() {
    // return !! localStorage.getItem(this.token);

    const token = localStorage.getItem(this.token);
    return !this.jwtHelper.isTokenExpired(token);
  }

  get uniqueName() {
    const uniqueName = localStorage.getItem(this.name);

    if (uniqueName) {
      return uniqueName;
    } else {
      return 'User';
    }
  }

  logout() {
    localStorage.removeItem(this.uniqueName);
    localStorage.removeItem(this.token);
  }

}
