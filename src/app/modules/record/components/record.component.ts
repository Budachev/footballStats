import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';

@Component({
  template: `<ul *ngIf="users.length">
    <li *ngFor='let user of users' [innerText]="user.username"></li>
  </ul>`
})
export class RecordComponent implements OnInit {
  users = [];
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers()
      .map(data => data.json())
      .subscribe(res => {
        this.users = res;
      }, err => {
        console.error(err);
      });
  }
}
