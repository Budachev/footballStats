import {EventEmitter, Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { config } from '../configs/app.config';
import { Router } from '@angular/router';
class UserItem {
  constructor(public name: string, public done: boolean) {
  }
}

@Injectable()
export class LoginService {
  public userChanged$: EventEmitter<UserItem>;
  public user = null;
  constructor(private http: Http, private router: Router) {
    this.userChanged$ = new EventEmitter();
  }

  login(user) {
    let request = `${config.APIUrl}/login`;

    return this.http.post(request, user);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.userChanged$.emit(null);
    this.router.navigate(['/login']);
  }

  register(user) {
    let request = `${config.APIUrl}/register`;

    return this.http.post(request, user);
  }

  saveUser(user) {
    this.user = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.userChanged$.emit(user);
  }

  getUser() {
    return JSON.parse( localStorage.getItem('currentUser') );
  }

  getLinkedInToken(code) {
    let body = `grant_type=authorization_code&code=${code}&redirect_uri=http://127.0.0.1:4200/login&client_id=86caiywwuj7ahu&client_secret=8BW3ggXPSWD1wKdM`;

    let request = `${config.APIUrl}/login/social`;
    return this.http.post(request, { body });
  }
}
