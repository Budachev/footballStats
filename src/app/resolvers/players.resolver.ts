import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PlayersService } from '../services/players.service';

@Injectable()
export class PlayersResolver implements Resolve<any> {
  constructor(
    private playersService: PlayersService,
    private route: ActivatedRoute,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let id = route.params['id'];
    
    return this.playersService.getPlayers(id);
  }
}