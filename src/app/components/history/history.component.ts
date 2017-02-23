import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { HomeService } from '../../services/home.service';
import { CompetitionsService } from '../../services/competitions.service';

@Component({
    templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit, OnDestroy {

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
    subscription:any = {};

    ngOnInit() {
        this.subscription = this.homeService.getHistory(this.id)
        .map(this.extractData)
        .subscribe(this.handleData.bind(this), this.handleError, this.handleComplete);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    handleData(data){
        this.data = data;
            this.highlightTeams = [data.fixture._links.homeTeam.id, data.fixture._links.awayTeam.id];

            this.competitionsService.getCompetitions(data.fixture._links.competition.id)
                .map(this.extractData)
                .subscribe(data => this.table = data.standing);
    }

    extractData(response) {
        const body = response.json();
        return body || { };
    }

    handleComplete() {
        console.log('Complete');
    }

    handleError(error) {
        console.log('error:', error)
        return Observable.throw(error);
    }
}
