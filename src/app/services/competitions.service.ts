import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { config } from '../configs/app.config';
import 'rxjs/Rx';


@Injectable()
export class CompetitionsService {

  constructor(private http: Http) { }

  getCompetitions(id: number) {
    let request = `${config.APIUrl}/competitions`;

    if (id) {
      request += `/${id}/leagueTable`;
    }

    return this.http.get(request)
  }

  getCompetitionsFixture(id: number) {
    let request = `${config.APIUrl}/competitions/${id}/fixtures/`;

    return this.http.get(request)
  }

  getCompetitionDay(cmpId: number, id: number) {
    let request = `${config.APIUrl}/competitions/${cmpId}/leagueTable/?matchday=${id}`;
    
    return this.http.get(request)
  }

}
