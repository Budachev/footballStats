import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/Rx';

import { HomeService } from '../../services/home.service';
import { CompetitionsService } from '../../services/competitions.service';

@Component({
    templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private http: Http,
        private homeService: HomeService,
        private competitionsService: CompetitionsService
        ) {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.id = params['id'];
            }
        });
    }

    id: number = null;
    data: Object = {};
    table = [];
    highlightTeams = [];

    ngOnInit() {
        this.homeService.getHistory(this.id).subscribe(val => {
            let data = val.json()
            this.data = data;
            this.highlightTeams = [data.fixture._links.homeTeam.id, data.fixture._links.awayTeam.id];

            this.competitionsService.getCompetitions(data.fixture._links.competition.id)
                .map(i => i.json())
                .subscribe(data => this.table = data.standing);
        });
    }
}
