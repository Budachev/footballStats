import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/Rx';

import { CompetitionsService } from '../../services/competitions.service';

@Component({
  selector: 'app-home',
  templateUrl: './competitions.component.html'

})
export class Competitions implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private http: Http,
    private competitionsService: CompetitionsService
  ) {
    this.route.data.subscribe(val => {
      const data = val['competition'].json();
      const fixtures = val['fixtures'].json();
      // TODO create component for fixtures (matches) and mapper with result (win/lose)
      this.fixtures = fixtures.fixtures;

      if (data.standings) {
        this.groups = true;
        this.table = data.standings;
        this.keys = Object.keys(this.table)
      } else {
        this.leagueCaption = data.leagueCaption;
        this.data = data;
        this.table = this.standingsMapper(data.standing, this.fixtures);
        console.log(this.table)
      }

      //console.log(this.table)
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.saveCompetition(params['id']);
      }
    });

  }
  data: any = {};
  selectedDay: number = null;
  leagueCaption = '';
  dayOptions = [];
  fixtures = [];
  table: any[] = [];
  selectedMatchDay = [];
  groups: boolean = false

  keys = []

  ngOnInit() {
    if (this.data) {
      this.onChangeDay(this.data.matchday);
      this.selectedDay = this.data.matchday;
      for (let i = 1; i <= this.data.numberOfMatchdays; i++) {
        this.dayOptions.push(i);
      }
    }
    
    console.log("Competitions");
  }
  
  standingsMapper(standings, fixtures){
    
    return standings.map(stand => {
      let temp = [];
    
      fixtures.forEach(fixture => {
        if( fixture.status === 'FINISHED' && (fixture.awayTeamName === stand.teamName || fixture.homeTeamName === stand.teamName) ){
          temp.push(fixture);
        }
      });
      
      let lastGames = temp.length > 5 ? temp.splice(-5) : temp;

      lastGames = lastGames.map(s => {
        let winner;

        if(s.result.goalsHomeTeam === s.result.goalsAwayTeam){
          winner = 'draw'
        } else {
          let winnerName = s.result.goalsHomeTeam < s.result.goalsAwayTeam ? 'homeTeamName' : 'awayTeamName';
          // TODO somesing wrong with calculation of winner
          if(stand.teamName === s[winnerName]){
            winner = true;
          } else {
            winner = false;
          }
        } 
        
        s.result.winner = winner;

        return s;
      })

      stand.lastGames = lastGames;
      return stand;
    });
  }

  saveCompetition(id) {
    let list: any = localStorage.getItem('lastCompetitions');
    list = JSON.parse(list);

    if (!list) {
      list = [];
    }

    if (!list.includes(id)) {
      list.push(parseInt(id));
    }

    if (list.length > 2) {
      list.shift();
    }

    localStorage.setItem('lastCompetitions', JSON.stringify(list));
  }

  onChangeDay(day) {
    if (day <= this.data.matchday) {
      this.competitionsService.getCompetitionDay(this.data.id, day).subscribe(val => {
        this.selectedMatchDay = val.json().standing;
      });
    }

  }

}
