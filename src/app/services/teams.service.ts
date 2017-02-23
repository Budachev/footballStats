import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { config } from '../configs/app.config';

@Injectable()
export class TeamsService {

  constructor(private http: Http) { }

  getTeam(id) {
    let request = `${config.APIUrl}/teams/${id}`;

    return this.http.get(request)
  }
}
