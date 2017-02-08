import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { CompetitionsService } from '../../services/competitions.service';

@Component({
    selector: 'leagueTable',
    templateUrl: 'competitionTable.component.html',
    styleUrls: ['competitionTable.component.scss']
})
export class CompetitionTable implements OnInit {
    constructor(private competitionsService: CompetitionsService) { }
    @Input() table: any;
    @Input() data: any;
    @Input() hl: any;
    selectedMatchDay = [];
    selectedDay: any;
    dayOptions = [];

    isHighlighted(id) {
        if (this.hl) {
            return this.hl.includes(id);
        }
    }

    onChanges(changes) {
        // Only update game when game has actually changed
        if (changes.hasOwnProperty('table')) {
            console.log(changes);
        }
    }

    onChangeDay(day) {
        if (day <= this.data.matchday) {
            this.competitionsService.getCompetitionDay(this.data.id, day).subscribe(val => {
                this.selectedMatchDay = val.json().standing;
            });
        }
    }

    ngOnInit() {
        if (this.data) {
            this.onChangeDay(this.data.matchday);
            this.selectedDay = this.data.matchday;
            for (let i = 1; i <= this.data.numberOfMatchdays; i++) {
                this.dayOptions.push(i);
            }
        }
    }
}