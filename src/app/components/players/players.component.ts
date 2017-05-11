import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-home',
    templateUrl: './players.component.html'
})
export class PlayersComponent implements OnInit {
    players = [];

    constructor(private route: ActivatedRoute) {
        this.route.data.subscribe(val => {
            const data = val['players'].json();
            this.players = data.players;
        });
    }

    ngOnInit() {}
}
