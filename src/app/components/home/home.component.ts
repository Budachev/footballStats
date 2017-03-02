import { CompetitionsComponent } from '../competitions/competitions.component';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import { InlineArray } from '@angular/core/src/linker/view_utils';
import { ArrayType } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public dt: Date = new Date();
  public minDate: Date = void 0;
  lastCompetitions: number[] = [];
  allCompetitions: any[] = [];
  homeData = { fixtures: [], competitions: [] };
  vocablurary: Object = {};
  competitions: any[] = [];
  table: any[] = [];
  filter = 'date';

  constructor(private route: ActivatedRoute, private http: Http, private homeService: HomeService) {
    this.route.data
      .takeWhile(() => !this.allCompetitions.length || !this.homeData.fixtures.length)
      .subscribe(val => {
        this.homeData = val['home'].json();

        let filteredCompetitions = this.homeData.competitions.filter(c => c._links);

        this.homeData.fixtures = this.homeData.fixtures.map(f => {
          let competition;

          if (f._links) {
            competition = filteredCompetitions.find(c => c._links.competition.id === f._links.competition.id);
          }

          if (competition && competition.standing) {
            f._links.awayTeam.img = competition.standing.find(c => c.teamName === f.awayTeamName).crestURI;
            f._links.homeTeam.img = competition.standing.find(c => c.teamName === f.homeTeamName).crestURI;

            return f;
          }
        });

        this.sortFixtures();

        this.allCompetitions = val['competitions'].json();

        this.allCompetitions.forEach(competition => {
          this.vocablurary[competition.id] = competition.caption;
        });
      });
  }


  ngOnInit() {
    let lastIds = this.getLastCompetitions();
    // console.log('l', lastIds, this.competitions);

    this.competitions = this.allCompetitions.filter(cmp => {
      // console.log('cmp', cmp.id, lastIds.includes(cmp.id));
      return !lastIds.includes(cmp.id);
    });

    this.lastCompetitions = this.allCompetitions.filter(cmp => lastIds.includes(cmp.id));
  }

  public getDate(): number {
    return this.dt && this.dt.getTime() || new Date().getTime();
  }

  isNewCompetition(match, i): boolean {
    if (!match) {
      return false;
    };

    const prev = this.homeData.fixtures[i - 1];

    return i === 0 || (prev && match._links.competition.id !== prev._links.competition.id);
  }

  getHistory(match) {}

  getLastCompetitions() {
    let list: any = localStorage.getItem('lastCompetitions');
    list = JSON.parse(list);

    return list && list.length ? list : [];
  }

  isCheched(val): boolean {
    return this.filter === val;
  }

  onSortChange(val): void {
    this.filter = val;
    this.sortFixtures();
  }

  sortFixtures() {
    if (this.filter === 'league') {
      this.homeData.fixtures =
        this.homeData.fixtures.sort((prev, curr) => prev._links.competition.id - curr._links.competition.id);
    } else if (this.filter === 'date') {
      this.homeData.fixtures = this.homeData.fixtures.sort((prev, curr) => {
        let date1 = new Date(prev.date);
        let date2 = new Date(curr.date);
        return date1.getTime() - date2.getTime();
      });
    }

  }
}
