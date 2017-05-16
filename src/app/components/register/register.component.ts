import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../services/login.service';

@Component({
  template: `<div class="container row col-md-6 col-md-offset-3">
    <h1>Register Form</h1>
    <div *ngIf="error" class="alert alert-danger" role="alert" [innerText]="error"></div>
    <form #formRef="ngForm" (ngSubmit)="onSubmit(formRef.value)">
      <div class="form-group">
        <label for="name">Name</label>
        <input 
          type="text" 
          class="form-control" 
          name="username" 
          [(ngModel)]="userModel.username"
          #usernameRef="ngModel"
          minlength="3"  
        required>
      </div>
      <div *ngIf="usernameRef.dirty && usernameRef.errors?.required">This field is required</div>
      <div *ngIf="usernameRef.dirty && usernameRef.errors?.minlength">
          This field must be longer than {{usernameRef.errors?.minlength.requiredLength}} characters. 
          You only typed {{usernameRef.errors?.minlength.actualLength}}
      </div>
        
      <div class="form-group">
        <label for="name">Eemail</label>
        <input type="text" class="form-control" name="useremail" [(ngModel)]="userModel.useremail" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" name="password" [(ngModel)]="userModel.password" required>
      </div>
      <div class="form-group">
        <label for="password">Repeat password</label>
        <input type="password" class="form-control" name="repeatPassword" [(ngModel)]="userModel.repeatPassword" required>
      </div>
      <button type="submit" [disabled]="formRef.invalid" class="btn btn-success">Register</button> or
      <a [routerLink]="['/login']" [routerLinkActive]="['is-active']">Login</a>
    </form>
</div>`,
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
