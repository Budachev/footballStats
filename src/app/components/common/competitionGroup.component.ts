import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'leagueGroup',
    templateUrl: 'competitionGroup.component.html'
})
export class CompetitionGroupComponent implements OnInit {
    @Input() table: any;
    keys = [];

    constructor() {}

    ngOnInit() {
        this.keys = Object.keys(this.table);
    }
}