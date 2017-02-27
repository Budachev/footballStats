import { Component, OnInit, Input, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { debounce }  from './../../../utils/helpers';
import { config } from '../../../configs/app.config';

@Component({
    selector: 'back2top',
    templateUrl: 'back2top.component.html',
    styleUrls: ['./back2top.scss']
})
export class Back2TopComponent implements OnInit {
    isVisible: Boolean = false;
    scrollHandler = debounce(this.checkScroll, config.debounceTimeout);
    constructor() { }

    checkScroll() {
        if (document.body.scrollTop > window.innerHeight * 1.5) {
            this.isVisible = true;
        } else {
            this.isVisible = false;
        }
    }

    @HostListener('window:scroll', ['$event'])
    doSomething() {
        this.scrollHandler();
    }

    back() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.isVisible = false;
    }

    ngOnInit() {}
}
