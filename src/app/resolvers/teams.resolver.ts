import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { TeamsService } from '../services/teams.service';

@Injectable()
export class TeamsResolver implements Resolve<any> {
  constructor(
    private teamService: TeamsService,
    private route: ActivatedRoute,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let id = route.params['id'];
    
    return this.teamService.getTeam(id);
  }
}