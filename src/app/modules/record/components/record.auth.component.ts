import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

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
        <input type="password" class="form-control" id="password">
      </div>
      <button type="submit" class="btn btn-success">Submit</button>
    </form>
</div>`
})
export class RecordAuthComponent {
  heroForm: FormGroup;
  username = 'John';

  constructor(private http: Http) { }

  onSubmit(formValue) {
    console.log('submit');
    console.log(formValue);

    let request = `${config.APIUrl}/adduser/`;

    this.http.post(request, formValue)
      .map(data => {
        return  data;
      })
      .subscribe(res => {
        console.log(res)
      });
  }
}
