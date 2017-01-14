import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { config } from '../configs/app.config';
import 'rxjs/Rx';


@Injectable()
export class CompetitionsService {

  constructor(private http: Http) { }

  getCompetitions(id) {
    let request = `${config.APIUrl}/competitions`;

    if(id){
      request += `/${id}/leagueTable`;
    }

    return this.http.get(request)
  }
}
