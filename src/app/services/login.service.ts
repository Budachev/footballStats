import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { config } from '../configs/app.config';

@Injectable()
export class LoginService {
  constructor(private http: Http) { }

  login(user) {
    let request = `${config.APIUrl}/login`;

    return this.http.post(request, user);
  }

  register(user) {
    let request = `${config.APIUrl}/register`;

    return this.http.post(request, user);
  }

}
