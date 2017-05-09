import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { config } from '../../../configs/app.config';

@Component({
  template: `<ul *ngIf="users.length">
    <li *ngFor='let user of users'>{{user.username}}</li>
  </ul>`
})
export class RecordComponent implements OnInit {
  users = [];
  constructor(private http: Http) { }
  ngOnInit() {
    let request = `${config.APIUrl}/users`;
    let user    = JSON.parse(localStorage.getItem('currentUser'));
    let headers = new Headers({ 'x-access-token': user.token });

    let options = new RequestOptions({ headers });

    this.http.get(request, options)
      .map(data => data.json())
      .subscribe(res => {
        console.log(res)
        this.users = res;
      }, err => {
        console.error(err);
      });
  }
}