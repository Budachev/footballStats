import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(elementRef: ElementRef, renderer: Renderer) {
    this.globalListenFunc = renderer.listenGlobal('document', 'click', (event) => {
      if (this.sideNavOpen === true && event.target.innerHTML !== 'open menu' && event.srcElement.localName !== 'aside') {
        console.log(event)
        this.closeSideNav();
      }
    })
  }

  sideNavOpen: Boolean = false;
  globalListenFunc: Function = null;

  ngOnInit() {}

  ngOnDestroy():void {
    // Removs "listenGlobal" listener
    this.globalListenFunc();
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Escape') {
      this.closeSideNav();
    }
  }

  openSideNav() {
    this.sideNavOpen = true;
  }

  closeSideNav() {
    this.sideNavOpen = false;
  }
}
