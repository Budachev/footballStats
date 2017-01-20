import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/Rx';

import { config } from '../configs/app.config';

@Injectable()
export class PlayersService {

  constructor(private http: Http) { }

  getPlayers(id: string | number) {
    let request = `${config.APIUrl}/players/${id}`;

    return this.http.get(request)
  }
}
