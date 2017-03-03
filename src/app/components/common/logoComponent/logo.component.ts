import { Component, OnInit, Input, ChangeDetectionStrategy, HostListener } from '@angular/core';

@Component({
    selector: 'logo',
    templateUrl: 'logo.component.html',
    styleUrls: ['./logo.scss']
})
export class LogoComponent implements OnInit {
    @Input() team: any;
    times: any = [];
    logoClass = '';
    constructor() { }

    ngOnInit() {
        if (this.team.teamName === 'Tottenham Hotspur FC') {
            this.times = new Array(21);
            this.logoClass = 'icon-Tottenham_Hotspur';
        }
    }

    getClass(i) {
        return `path${i + 1}`;
    }
}
