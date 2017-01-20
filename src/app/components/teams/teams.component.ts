import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/Rx';

@Component({
    selector: 'app-home',
    templateUrl: './teams.component.html'
})
export class TeamsComponent implements OnInit {

    constructor(private route: ActivatedRoute, private http: Http) {
        this.route.data.subscribe(val => {
            const data = val['team'].json();
            this.team = data;
            console.log(this.team);
        });
    }

    team = {}

    ngOnInit() {
        console.log("Team");
    }


}
