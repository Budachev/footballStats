import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PlayersService } from '../services/players.service';

@Injectable()
export class PlayersResolver implements Resolve<any> {
  constructor( private playersService: PlayersService ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let id = route.params['id'];

    return this.playersService.getPlayers(id);
  }
}
