import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';


@Component({
  template: `<div class="container row col-md-6 col-md-offset-3">
    <h1>Login Form</h1>
    <div *ngIf="error" class="alert alert-danger" role="alert">{{error}}</div>
    <form #formRef="ngForm" (ngSubmit)="onSubmit(formRef.value)">
      <div class="form-group">
        <label for="name">Name or email</label>
        <input type="text" class="form-control" name="username" [(ngModel)]="username" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" name="password" [(ngModel)]="password" required>
      </div>
      <button type="submit" class="btn btn-success">Login</button> or
      <a [routerLink]="['/record/register']" [routerLinkActive]="['is-active']">Register</a>
    </form>
</div>`,
})
export class RecordLoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private router: Router, private loginService: LoginService) {}

  onSubmit(formValue) {
    this.loginService.login(formValue)
      .map(data => data.json())
      .subscribe(res => {
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.router.navigate(['/record']);
      }, err => {
        this.error = err._body;
      });
  }
}
