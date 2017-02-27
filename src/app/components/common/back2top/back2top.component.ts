import { Component, OnInit, Input, ChangeDetectionStrategy, HostListener } from '@angular/core';

function debounce(func, wait, immediate = false) {
    let timeout;
    return function () {
        let context = this, args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) { func.apply(context, args) };
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {func.apply(context, args)};
    };
};

@Component({
    selector: 'back2top',
    templateUrl: 'back2top.component.html',
    styleUrls: ['./back2top.scss']
})
export class Back2TopComponent implements OnInit {
    isVisible: boolean = false;
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
        this.checkScroll();
    }


    ngOnInit() {
        console.log('back 2 top');
    }

    back() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.isVisible = false;
    }
}