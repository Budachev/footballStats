import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: '[game-title]',
  template: `
  <span [style.font-weight]="homeWin === true ? 'bold' : 'normal'">
    {{game.homeTeamName}}
  </span> -
  <span [style.font-weight]="homeWin === false? 'bold' : 'normal'">
    {{game.awayTeamName}}
  </span>
  
  <span [style.font-weight]="homeWin === true ? 'bold' : 'normal'">
    {{game.result.goalsHomeTeam}} 
  </span> 
  : 
  <span [style.font-weight]="homeWin === false ? 'bold' : 'normal'">
    {{game.result.goalsAwayTeam}}
  </span>  
  `
})
export class GameTitleComponent implements OnInit, OnChanges {
  homeWin: Boolean = null;
  @Input() game: any;
  constructor(
    private route: ActivatedRoute,
    private http: Http
  ) {}

  ngOnInit() {
    if (this.game.result.goalsHomeTeam !== this.game.result.goalsAwayTeam) {
      this.homeWin = this.game.result.goalsHomeTeam > this.game.result.goalsAwayTeam;
    }

  }

  ngOnChanges(changes) {}

  isHomeWinner() {}

}
