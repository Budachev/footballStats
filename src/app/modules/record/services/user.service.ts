import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { config } from '../../../configs/app.config';

@Injectable()
export class UserService {
  constructor(private http: Http) { }

  getUsers() {
    let request = `${config.APIUrl}/users`;
    let user    = JSON.parse(localStorage.getItem('currentUser'));
    let headers = new Headers({ 'x-access-token': user.token });

    let options = new RequestOptions({ headers });

    return this.http.get(request, options);
  }

}
