/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NavComponent } from './nav.component';

import { CompetitionsService } from '../../services/competitions.service';
import { Http, Response } from '@angular/http';

describe('NavComponent', () => {
   let component: NavComponent;
   let fixture: ComponentFixture<NavComponent>;

   beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavComponent
      ],
      providers: [CompetitionsService, Http]
    });
  });

  // it('should create the app', async(() => {
  //   let fixture = TestBed.createComponent(NavComponent);
  //   let app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // }));

});
