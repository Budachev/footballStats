import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SWService } from '../services/sw.service';

@Injectable()
export class NavResolver implements Resolve<any> {
  constructor(
    private swService: SWService    
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.swService.getCategories();
  }
}