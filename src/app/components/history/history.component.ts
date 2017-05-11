import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { HomeService } from '../../services/home.service';
import { CompetitionsService } from '../../services/competitions.service';

@Component({
    templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit, OnDestroy {
    historyId: number = null;
    data: Object = {};
    table = [];
    highlightTeams = [];
    subscription: any = {};

    constructor(
        private route: ActivatedRoute,
        private http: Http,
        private homeService: HomeService,
        private competitionsService: CompetitionsService
        ) {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.historyId = params['id'];
            }
        });
    }

    ngOnInit() {
        this.subscription = this.homeService.getHistory(this.historyId)
        .map(this.extractData)
        .subscribe(this.handleData.bind(this), this.handleError, this.handleComplete);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    handleData(data) {
        this.data = data;
        let links = data.fixture._links;
        this.highlightTeams = [links.homeTeam.id, links.awayTeam.id];
        this.competitionsService.getCompetitions(data.fixture._links.competition.id)
            .map(this.extractData)
            .subscribe(res => this.table = res.standing);
    }

    extractData(response) {
        const body = response.json();
        return body || { };
    }

    handleComplete() {
        console.log('Complete history onInit');
    }

    handleError(error) {
        console.log('error:', error);
        return Observable.throw(error);
    }
}
