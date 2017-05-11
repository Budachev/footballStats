import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/Rx';

import competitionMapper from '../../mappers/competitions.mapper';

@Component({
  selector: 'app-home',
  templateUrl: './competitions.component.html'

})
export class CompetitionsComponent implements OnInit {
  selectedDay: number = null;
  leagueCaption = '';
  fixtures = [];
  table: any[] = [];
  groups: Boolean = false;
  data: any = {};

  constructor(
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe(val => {
      const data = val['competition'].json();
      const fixtures = val['fixtures'].json();
      // TODO create component for fixtures (matches) and mapper with result (win/lose)

      if (data.standings) {
        this.groups = true;
        this.table = data.standings;
      } else {
        this.leagueCaption = data.leagueCaption;
        this.data = data;
        this.table = competitionMapper.standingsMapper(data.standing, fixtures.fixtures);
      }

      this.fixtures = fixtures.fixtures.filter(game => {
        return game.matchday === this.data.matchday;
      });
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.saveCompetition(params['id']);
      }
    });
  }

  ngOnInit() {}

  saveCompetition(id) {
    let list: any = localStorage.getItem('lastCompetitions');
    list = JSON.parse(list);

    if (!list) {
      list = [];
    }

    if (!list.includes(id)) {
      list.push(parseInt(id, 10));
    }

    if (list.length > 2) {
      list.shift();
    }

    localStorage.setItem('lastCompetitions', JSON.stringify(list));
  }

}
