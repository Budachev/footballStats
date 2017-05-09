import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { config } from '../../../configs/app.config';

@Component({
  template: `<div class="container row col-md-6 col-md-offset-3">
    <h1>Hero Form</h1>
    <form #formRef="ngForm" (ngSubmit)="onSubmit(formRef.value)">
      <div class="form-group">
        <label for="name">Name or email</label>
        <input type="text" class="form-control" name="username" [(ngModel)]="username" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" name="password" [(ngModel)]="password" required>
      </div>
      <button type="submit" class="btn btn-success">Submit</button>
    </form>
</div>`
})
export class RecordAuthComponent {
  heroForm: FormGroup;
  username = 'John';
  password = '';

  constructor(private http: Http, private router: Router) { }

  onSubmit(formValue) {
    console.log('submit');
    console.log(formValue);

    let request = `${config.APIUrl}/login`;

    this.http.post(request, formValue)
      .map(data => data.json())
      .subscribe(res => {
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.router.navigate(['/record']);
      }, err => {
        console.error(err);
      });
  }
}
