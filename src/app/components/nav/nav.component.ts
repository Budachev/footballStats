import { Component, OnInit, OnDestroy, ElementRef, Renderer } from '@angular/core';
import { HostListener } from '@angular/core';
import { CompetitionsService } from '../../services/competitions.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  user = null;
  sideNavOpen: Boolean = false;
  globalListenFunc: Function = null;
  competitions = [];

  constructor(
    renderer: Renderer,
    private competitionsService: CompetitionsService,
    private loginService: LoginService,
    ) {
    this.loginService.userChanged$.subscribe(user => {
      this.user = user;
    });

    this.globalListenFunc = renderer.listenGlobal('document', 'click', (event) => {
      if (this.sideNavOpen === true && event.target.innerHTML !== 'open menu' && event.srcElement.localName !== 'aside') {
        this.closeSideNav();
      }
    });
  }

  ngOnInit() {
    this.competitionsService.getCompetitions()
      .map(i => i.json())
      .subscribe(data => this.competitions = data);

      this.user = this.loginService.getUser();
  }

  ngOnDestroy(): void {
    // Removes "listenGlobal" listener
    this.globalListenFunc();
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    if (event.key === 'Escape') {
      this.closeSideNav();
    }
  }

  logout() {
    this.loginService.logout();
  }

  openSideNav() {
    this.sideNavOpen = true;
  }

  closeSideNav() {
    this.sideNavOpen = false;
  }
}
