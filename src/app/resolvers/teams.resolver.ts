import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TeamsService } from '../services/teams.service';

@Injectable()
export class TeamsResolver implements Resolve<any> {
  constructor( private teamService: TeamsService ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let id = route.params['id'];

    return this.teamService.getTeam(id);
  }
}
