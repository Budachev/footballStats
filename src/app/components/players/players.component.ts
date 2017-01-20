import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/Rx';

@Component({
    selector: 'app-home',
    templateUrl: './players.component.html'
})
export class PlayersComponent implements OnInit {

    constructor(private route: ActivatedRoute, private http: Http) {
        this.route.data.subscribe(val => {
            const data = val['players'].json();
            this.players = data.players;
            console.log(this.players);
        });
    }

    players = []

    ngOnInit() {
        console.log("Team");
    }
}
