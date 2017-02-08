import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { HostListener } from '@angular/core';
import { CompetitionsService } from '../../services/competitions.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(elementRef: ElementRef, renderer: Renderer, private competitionsService: CompetitionsService) {
    this.globalListenFunc = renderer.listenGlobal('document', 'click', (event) => {
      if (this.sideNavOpen === true && event.target.innerHTML !== 'open menu' && event.srcElement.localName !== 'aside') {
        this.closeSideNav();
      }
    })
  }

  sideNavOpen: Boolean = false;
  globalListenFunc: Function = null;
  competitions = [];

  ngOnInit() {
    this.competitionsService.getCompetitions().map(i => i.json()).subscribe(data => this.competitions = data);
  }

  ngOnDestroy(): void {
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
