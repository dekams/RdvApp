import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly userKey = 'user';
  private readonly tokenKey = 'token';
  private readonly photoUrlKey = 'photoUrl';
  private readonly name = 'unique_name';
  private readonly nameid = 'nameid';
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private readonly jwtHelper = new JwtHelperService();
  private decodedToken: any;
  // tslint:disable-next-line: max-line-length
  public readonly photoSubject = new BehaviorSubject<string>(this.photoUrl);

  static getToken() {
    return localStorage.getItem('token');
  }

  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(model: any) {
    return this.http.post(`${this.baseUrl}/login`, model)
      .pipe(
        map((response: any) => {
          const user = response;

          if (user) {
            localStorage.setItem(this.tokenKey, user.token);
            localStorage.setItem(this.userKey, JSON.stringify(user.current));

            this.setPhotoUrl(user.current.photoUrl);
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

  get currentUser() {
    return JSON.parse(localStorage.getItem(this.userKey)) as User;
  }

  get token() {
    return localStorage.getItem(this.tokenKey);
  }

  private get photoUrl() {
    return localStorage.getItem(this.photoUrlKey);
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

  setPhotoUrl(photoUrl: string) {
    if (!photoUrl) {
      photoUrl = '../../../assets/user.png';
    }
    localStorage.setItem(this.photoUrlKey, photoUrl);
    this.photoSubject.next(photoUrl);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.photoUrlKey);
    localStorage.removeItem(this.name);
    localStorage.removeItem(this.nameid);
  }

}
