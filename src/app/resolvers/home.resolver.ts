import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { HomeService } from '../services/home.service';

@Injectable()
export class HomeResolver implements Resolve<any> {
  constructor(
    private homeService: HomeService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.homeService.getHomeData();
  }
}