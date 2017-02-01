import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'leagueGroup',
    templateUrl: 'competitionGroup.component.html'
})
export class CompetitionGroup implements OnInit {
    @Input() table: any;
    constructor() {
        //this.keys = Object.keys(this.table);
        console.log(this.table)
     }
    keys = [];
    ngOnInit() { 
        this.keys = Object.keys(this.table);
    }
}