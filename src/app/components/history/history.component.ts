import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/Rx';

import { HomeService } from '../../services/home.service';

@Component({
    templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit {

    constructor(private route: ActivatedRoute, private http: Http, private homeService: HomeService) {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.id = params['id'];
            }
        });
    }

    id: number = null;
    data: Object = {};

    ngOnInit() {
        this.homeService.getHistory(this.id).subscribe(val => {
            this.data = val.json();
        })
    }
}
