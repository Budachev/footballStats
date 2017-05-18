import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../../services/login.service';


@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  user = null;

  constructor(private router: Router, private loginService: LoginService, private activatedRoute: ActivatedRoute) {
    this.loginService.userChanged$.subscribe(user => {
      this.user = user;
    });
  }

  onSubmit(formValue) {
    this.loginService.login(formValue)
      .map(data => data.json())
      .subscribe(res => {
        this.loginService.saveUser(res);
        this.router.navigate(['/record']);
      }, err => {
        this.error = err._body;
      });
  }

  ngOnInit() {
    this.user = this.loginService.getUser();
    let { code, state } = this.activatedRoute.snapshot.queryParams;

    if  (code && state){
      this.loginService.getLinkedInToken(code)
        .map(data => data.json())
        .subscribe(res => {
          this.loginService.saveUser({username : res.firstName });
          this.router.navigate(['/record']);
        }, err => {
          this.error = err._body;
        });
    }
  }

  logout() {
    this.loginService.logout();
  }

  linkedingLogin() {
    window.location.href = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86caiywwuj7ahu&redirect_uri=http://127.0.0.1:4200/login&state=987654321';
  }
}
