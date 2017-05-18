import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../services/login.service';

@Component({
  templateUrl: './register.component.html',
  styles: [`
    form.ng-dirty .ng-invalid{
        border: 1px solid red;
    }
  `],
})
export class RegisterComponent {
  error = '';
  userModel = {
    username: '',
    useremail: '',
    password: '',
    repeatPassword: '',
  };

  constructor( private loginService: LoginService, private router: Router) { }

  onSubmit(formValue) {
    this.loginService.register(formValue)
      .map(data => data.json())
      .subscribe(res => {
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.router.navigate(['/record']);
      }, err => {
        this.error = err._body;
      });
  }
}
