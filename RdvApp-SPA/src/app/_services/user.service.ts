import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../_models/user';
import { AuthService } from './auth.service';
import { PaginatedResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';

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

  getUsers(page?: number, itemPerPage?: number, userParams?: any) {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();

    if (page && itemPerPage) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemPerPage.toString());
    }

    if (userParams) {
      params = params.append('gender', userParams.gender);
      params = params.append('minAge', userParams.minAge.toString());
      params = params.append('maxAge', userParams.maxAge.toString());
      params = params.append('orderBy', userParams.orderBy);
    }

    return this.http.get<User[]>(this.baseUrl, { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          const pagination = response.headers.get('Pagination');
          if (pagination) {
            paginatedResult.pagination = JSON.parse(pagination);
          }
          return paginatedResult;
        })
      ); // , this.httpOptions
  }

  getUser(id: number) {
    return this.http.get<User>(`${this.baseUrl}/${id}`); // , this.httpOptions
  }

  updateUser(id: number, user: User) {
    return this.http.put(`${this.baseUrl}/${id}`, user);
  }

  setMainPhoto(userId: number, photoId: number) {
    return this.http.post(`${this.baseUrl}/${userId}/photos/${photoId}/setMain`, {});
  }

  deletePhoto(userId: number, photoId: number) {
    return this.http.delete(`${this.baseUrl}/${userId}/photos/${photoId}`);
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(`${this.baseUrl}/${id}/like/${recipientId}`, {});
  }

}
