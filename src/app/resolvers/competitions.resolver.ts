import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { CompetitionsService } from '../services/competitions.service';

@Injectable()
export class CompetitionsResolver implements Resolve<any> {
  constructor(
    private competitionsService: CompetitionsService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let id = route.params['id'];

    return this.competitionsService.getCompetitions(id);
  }
}

@Injectable()
export class CompetitionsFixturesResolver implements Resolve<any> {
  constructor(
    private competitionsService: CompetitionsService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let id = route.params['id'];

    return this.competitionsService.getCompetitionsFixture(id);
  }
}
