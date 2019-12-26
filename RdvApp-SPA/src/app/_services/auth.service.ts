import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'token';
  private readonly name = 'unique_name';
  private readonly nameid = 'nameid';
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly jwtHelper = new JwtHelperService();
  private decodedToken: any;

  static getToken() {
    return localStorage.getItem('token');
  }

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
            localStorage.setItem(this.tokenKey, user.token);
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            localStorage.setItem(this.name, this.decodedToken.unique_name);
            localStorage.setItem(this.nameid, this.decodedToken.nameid);
          }
        })
      );
  }

  isLoggedIn() {
    // return !! localStorage.getItem(this.token);

    const token = localStorage.getItem(this.tokenKey);
    return !this.jwtHelper.isTokenExpired(token);
  }

  get token() {
    return localStorage.getItem(this.tokenKey);
  }

  get nameId() {
    return +localStorage.getItem(this.nameid);
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
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.name);
    localStorage.removeItem(this.nameid);
  }

}
